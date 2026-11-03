import {execFile} from "node:child_process";
import {access, mkdir, readdir, readFile, rename, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {promisify} from "node:util";
import {setTimeout as delay} from "node:timers/promises";
import type {Episode} from "../../src/types";
import {validateEpisode} from "../../src/validate-episode";

const execFileAsync = promisify(execFile);

const VOICE = "zh-CN-YunyangNeural";
const FPS = 30;
const MAX_RETRIES = 3;
const EDGE_TTS_TIMEOUT_MS = 45_000;
const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const EDGE_TTS_PATH = path.join(PROJECT_ROOT, ".venv/bin/edge-tts");

type AlignMode = "proportional" | "groups";

interface CliOptions {
  episodePath: string;
  segmentRoot: string;
  combinedAudioPath: string;
  align: AlignMode;
}

interface ProbedSegment {
  captionIndex: number;
  filePath: string;
  durationSec: number;
  startFrame: number;
  durationInFrames: number;
}

const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = {
    episodePath: path.join(PROJECT_ROOT, "episodes/router-worker.mock.json"),
    segmentRoot: path.join(PROJECT_ROOT, "public/voiceover/router-worker"),
    combinedAudioPath: path.join(PROJECT_ROOT, "public/voiceover/router-worker.mp3"),
    align: "proportional",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === "--episode" && next) {
      options.episodePath = resolveProjectPath(next);
      index += 1;
      continue;
    }
    if (arg === "--segments" && next) {
      options.segmentRoot = resolveProjectPath(next);
      index += 1;
      continue;
    }
    if (arg === "--combined" && next) {
      options.combinedAudioPath = resolveProjectPath(next);
      index += 1;
      continue;
    }
    if (arg === "--align" && next) {
      if (next !== "proportional" && next !== "groups") {
        throw new Error(`--align 只接受 proportional 或 groups，收到 ${next}`);
      }
      options.align = next;
      index += 1;
      continue;
    }
    throw new Error(`未知参数: ${arg}`);
  }

  return options;
};

const resolveProjectPath = (value: string) => {
  return path.isAbsolute(value) ? value : path.join(PROJECT_ROOT, value);
};

const toProjectPath = (absolutePath: string) => {
  return path.relative(PROJECT_ROOT, absolutePath).split(path.sep).join("/");
};

const readEpisode = async (episodePath: string): Promise<Episode> => {
  const source = await readFile(episodePath, "utf8");
  return JSON.parse(source) as Episode;
};

const run = async (
  command: string,
  args: string[],
  timeoutMs?: number,
): Promise<{stdout: string; stderr: string}> => {
  try {
    return await execFileAsync(command, args, {
      cwd: PROJECT_ROOT,
      maxBuffer: 10 * 1024 * 1024,
      timeout: timeoutMs,
    });
  } catch (error) {
    const failure = error as Error & {stderr?: string};
    const detail = failure.stderr?.trim() || failure.message;
    throw new Error(`${path.basename(command)} 失败: ${detail}`);
  }
};

const probeDurationSec = async (filePath: string): Promise<number> => {
  const {stdout} = await run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);
  const durationSec = Number.parseFloat(stdout.trim());

  if (!Number.isFinite(durationSec) || durationSec <= 0) {
    throw new Error(`ffprobe 未返回有效时长: ${stdout.trim()}`);
  }

  return durationSec;
};

const synthesizeWithRetry = async (
  text: string,
  outputPath: string,
  captionIndex: number,
): Promise<number> => {
  const temporaryPath = `${outputPath}.tmp.mp3`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await rm(temporaryPath, {force: true});
      // Never pass --list-voices. That flag hangs on this network path.
      await run(
        EDGE_TTS_PATH,
        [
          "--voice",
          VOICE,
          "--text",
          text,
          "--write-media",
          temporaryPath,
        ],
        EDGE_TTS_TIMEOUT_MS,
      );
      const durationSec = await probeDurationSec(temporaryPath);
      await rename(temporaryPath, outputPath);
      return durationSec;
    } catch (error) {
      await rm(temporaryPath, {force: true});
      if (attempt === MAX_RETRIES) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `caption ${captionIndex + 1} 首次合成及 ${MAX_RETRIES} 次重试均失败: ${message}`,
        );
      }

      const waitMs = 1000 * 2 ** attempt;
      console.warn(
        `[tts] caption ${captionIndex + 1} 第 ${attempt + 1} 次失败，${waitMs}ms 后重试`,
      );
      await delay(waitMs);
    }
  }

  throw new Error(`caption ${captionIndex + 1} 合成失败`);
};

const concatSegments = async (
  files: string[],
  segmentRoot: string,
  combinedAudioPath: string,
): Promise<void> => {
  const concatListPath = path.join(segmentRoot, ".concat.txt");
  const temporaryAudioPath = `${combinedAudioPath}.tmp.mp3`;
  const list = files
    .map((filePath) => `file '${filePath.replaceAll("'", "'\\''")}'`)
    .join("\n");

  await writeFile(concatListPath, `${list}\n`, "utf8");

  try {
    await run("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatListPath,
      "-c:a",
      "copy",
      temporaryAudioPath,
    ]);
    await rename(temporaryAudioPath, combinedAudioPath);
  } finally {
    await Promise.all([
      rm(concatListPath, {force: true}),
      rm(temporaryAudioPath, {force: true}),
    ]);
  }
};

const assignCaptionGroups = (episode: Episode): number[][] => {
  const groups = episode.scenes.map(() => [] as number[]);

  episode.captions.forEach((caption, captionIndex) => {
    const sceneIndex = episode.scenes.findIndex(
      (scene) =>
        caption.from >= scene.from &&
        caption.from < scene.from + scene.durationInFrames,
    );
    if (sceneIndex < 0) {
      throw new Error(`caption ${captionIndex + 1} 没有落在任何 scene 内`);
    }
    groups[sceneIndex].push(captionIndex);
  });

  let expectedIndex = 0;
  groups.forEach((group, sceneIndex) => {
    if (group.length === 0) {
      throw new Error(`scene ${episode.scenes[sceneIndex]?.id} 没有对应 caption`);
    }
    for (const captionIndex of group) {
      if (captionIndex !== expectedIndex) {
        throw new Error("caption 与 scene 的分组必须按顺序连续");
      }
      expectedIndex += 1;
    }
  });

  if (expectedIndex !== episode.captions.length) {
    throw new Error("caption 分组没有覆盖全部字幕");
  }

  return groups;
};

const applyProportionalTimeline = (
  episode: Episode,
  segments: ProbedSegment[],
  audioSrc: string,
): Episode => {
  const totalDurationSec = segments.reduce(
    (sum, segment) => sum + segment.durationSec,
    0,
  );
  const totalFrames = Math.round(totalDurationSec * FPS);
  const oldTotalFrames = Math.max(
    ...episode.scenes.map((scene) => scene.from + scene.durationInFrames),
  );
  const scaledBoundaries = episode.scenes.map((scene, index) =>
    index === episode.scenes.length - 1
      ? totalFrames
      : Math.round(
          ((scene.from + scene.durationInFrames) / oldTotalFrames) *
            totalFrames,
        ),
  );

  const captions = episode.captions.map((caption, index) => {
    const segment = segments[index];
    if (!segment) {
      throw new Error(`缺少 caption ${index + 1} 的音频段`);
    }

    return {
      ...caption,
      from: segment.startFrame,
      durationInFrames: segment.durationInFrames,
    };
  });
  const scenes = episode.scenes.map((scene, index) => {
    const from = index === 0 ? 0 : scaledBoundaries[index - 1];
    const end = scaledBoundaries[index];
    return {
      ...scene,
      from,
      durationInFrames: end - from,
    };
  });

  return {
    ...episode,
    fps: FPS,
    durationSec: Number((totalFrames / FPS).toFixed(6)),
    voiceover: {
      ...episode.voiceover,
      strategy: "tts",
      status: "ready",
      voice: VOICE,
      audioSrc,
    },
    scenes,
    captions,
  };
};

const applyGroupTimeline = (
  episode: Episode,
  segments: ProbedSegment[],
  groups: number[][],
  audioSrc: string,
): Episode => {
  const captions = episode.captions.map((caption, index) => {
    const segment = segments[index];
    if (!segment) {
      throw new Error(`缺少 caption ${index + 1} 的音频段`);
    }

    return {
      ...caption,
      from: segment.startFrame,
      durationInFrames: segment.durationInFrames,
    };
  });
  let cursor = 0;
  const scenes = episode.scenes.map((scene, index) => {
    const durationInFrames = groups[index].reduce((sum, captionIndex) => {
      const segment = segments[captionIndex];
      if (!segment) {
        throw new Error(`缺少 caption ${captionIndex + 1} 的音频段`);
      }
      return sum + segment.durationInFrames;
    }, 0);
    const next = {
      ...scene,
      from: cursor,
      durationInFrames,
    };
    cursor += durationInFrames;
    return next;
  });
  const totalFrames =
    segments.length === 0
      ? 0
      : segments[segments.length - 1].startFrame +
        segments[segments.length - 1].durationInFrames;

  return {
    ...episode,
    fps: FPS,
    durationSec: Number((totalFrames / FPS).toFixed(6)),
    voiceover: {
      ...episode.voiceover,
      strategy: "tts",
      status: "ready",
      voice: VOICE,
      audioSrc,
    },
    scenes,
    captions,
  };
};

const removeStaleSegments = async (
  segmentRoot: string,
  produced: string[],
): Promise<void> => {
  const producedNames = new Set(produced.map((filePath) => path.basename(filePath)));
  const existing = await readdir(segmentRoot);
  await Promise.all(
    existing
      .filter((name) => /^\d+\.mp3$/.test(name) && !producedNames.has(name))
      .map((name) => rm(path.join(segmentRoot, name), {force: true})),
  );
};

const main = async (): Promise<void> => {
  const options = parseArgs(process.argv.slice(2));
  await access(EDGE_TTS_PATH);
  await mkdir(options.segmentRoot, {recursive: true});
  await mkdir(path.dirname(options.combinedAudioPath), {recursive: true});

  const episode = await readEpisode(options.episodePath);
  if (episode.captions.length === 0) {
    throw new Error("episode 没有 captions");
  }
  if (episode.fps !== FPS) {
    throw new Error(`目前只支持 ${FPS}fps，收到 ${episode.fps}`);
  }

  const groups =
    options.align === "groups" ? assignCaptionGroups(episode) : null;
  const audioSrc = toProjectPath(options.combinedAudioPath);
  const pad = Math.max(2, String(episode.captions.length).length);

  console.log(
    `[tts] 使用 ${VOICE} 合成 ${episode.captions.length} 条 caption ` +
      `(${options.align})`,
  );

  const segmentPaths: string[] = [];
  const probedSegments: ProbedSegment[] = [];
  let cumulativeDurationSec = 0;

  for (const [index, caption] of episode.captions.entries()) {
    const filePath = path.join(
      options.segmentRoot,
      `${String(index + 1).padStart(pad, "0")}.mp3`,
    );
    const startFrame = Math.round(cumulativeDurationSec * FPS);
    const durationSec = await synthesizeWithRetry(
      caption.text,
      filePath,
      index,
    );

    cumulativeDurationSec += durationSec;
    const nextFrame = Math.round(cumulativeDurationSec * FPS);

    segmentPaths.push(filePath);
    probedSegments.push({
      captionIndex: index,
      filePath,
      durationSec,
      startFrame,
      durationInFrames: nextFrame - startFrame,
    });
    console.log(
      `[tts] ${String(index + 1).padStart(pad, "0")}/${episode.captions.length} ` +
        `${durationSec.toFixed(3)}s · ${nextFrame - startFrame} frames`,
    );
  }

  await concatSegments(
    segmentPaths,
    options.segmentRoot,
    options.combinedAudioPath,
  );
  await removeStaleSegments(options.segmentRoot, segmentPaths);
  const combinedDurationSec = await probeDurationSec(options.combinedAudioPath);
  const expectedDurationSec = probedSegments.reduce(
    (sum, segment) => sum + segment.durationSec,
    0,
  );
  if (Math.abs(combinedDurationSec - expectedDurationSec) > 0.25) {
    throw new Error(
      `整轨时长 ${combinedDurationSec.toFixed(3)}s 与分段总时长 ` +
        `${expectedDurationSec.toFixed(3)}s 不一致`,
    );
  }

  const updatedEpisode =
    options.align === "groups"
      ? applyGroupTimeline(episode, probedSegments, groups ?? [], audioSrc)
      : applyProportionalTimeline(episode, probedSegments, audioSrc);
  validateEpisode(updatedEpisode);
  await writeFile(
    options.episodePath,
    `${JSON.stringify(updatedEpisode, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `[tts] 完成：${updatedEpisode.durationSec}s / ` +
      `${Math.round(updatedEpisode.durationSec * FPS)} frames`,
  );
  console.log(`[tts] 整轨：${audioSrc}`);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
