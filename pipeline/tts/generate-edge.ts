import {execFile} from "node:child_process";
import {
  access,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {promisify} from "node:util";
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
const EPISODE_PATH = path.join(
  PROJECT_ROOT,
  "episodes/router-worker.mock.json",
);
const AUDIO_ROOT = path.join(PROJECT_ROOT, "public/voiceover");
const SEGMENT_ROOT = path.join(AUDIO_ROOT, "router-worker");
const COMBINED_AUDIO_PATH = path.join(AUDIO_ROOT, "router-worker.mp3");
const EDGE_TTS_PATH = path.join(PROJECT_ROOT, ".venv/bin/edge-tts");

interface ProbedSegment {
  captionIndex: number;
  filePath: string;
  durationSec: number;
  startFrame: number;
  durationInFrames: number;
}

const readEpisode = async (): Promise<Episode> => {
  const source = await readFile(EPISODE_PATH, "utf8");
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

      console.warn(
        `[tts] caption ${captionIndex + 1} 第 ${attempt + 1} 次失败，正在重试`,
      );
    }
  }

  throw new Error(`caption ${captionIndex + 1} 合成失败`);
};

const concatSegments = async (files: string[]): Promise<void> => {
  const concatListPath = path.join(SEGMENT_ROOT, ".concat.txt");
  const temporaryAudioPath = `${COMBINED_AUDIO_PATH}.tmp.mp3`;
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
    await rename(temporaryAudioPath, COMBINED_AUDIO_PATH);
  } finally {
    await Promise.all([
      rm(concatListPath, {force: true}),
      rm(temporaryAudioPath, {force: true}),
    ]);
  }
};

const applyVoiceoverTimeline = (
  episode: Episode,
  segments: ProbedSegment[],
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
      audioSrc: "public/voiceover/router-worker.mp3",
    },
    scenes,
    captions,
  };
};

const main = async (): Promise<void> => {
  await access(EDGE_TTS_PATH);
  await mkdir(SEGMENT_ROOT, {recursive: true});

  const episode = await readEpisode();
  if (episode.captions.length === 0) {
    throw new Error("mock episode 没有 captions");
  }

  console.log(
    `[tts] 使用 ${VOICE} 合成 ${episode.captions.length} 条 caption`,
  );

  const segmentPaths: string[] = [];
  const probedSegments: ProbedSegment[] = [];
  let cumulativeDurationSec = 0;

  for (const [index, caption] of episode.captions.entries()) {
    const filePath = path.join(
      SEGMENT_ROOT,
      `${String(index + 1).padStart(2, "0")}.mp3`,
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
      `[tts] ${String(index + 1).padStart(2, "0")}/${episode.captions.length} ` +
        `${durationSec.toFixed(3)}s · ${nextFrame - startFrame} frames`,
    );
  }

  await concatSegments(segmentPaths);
  const combinedDurationSec = await probeDurationSec(COMBINED_AUDIO_PATH);
  const expectedDurationSec = probedSegments.reduce(
    (sum, segment) => sum + segment.durationSec,
    0,
  );
  if (Math.abs(combinedDurationSec - expectedDurationSec) > 0.1) {
    throw new Error(
      `整轨时长 ${combinedDurationSec.toFixed(3)}s 与分段总时长 ` +
        `${expectedDurationSec.toFixed(3)}s 不一致`,
    );
  }

  const updatedEpisode = applyVoiceoverTimeline(episode, probedSegments);
  validateEpisode(updatedEpisode);
  await writeFile(
    EPISODE_PATH,
    `${JSON.stringify(updatedEpisode, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `[tts] 完成：${updatedEpisode.durationSec}s / ` +
      `${Math.round(updatedEpisode.durationSec * FPS)} frames`,
  );
  console.log(`[tts] 整轨：${path.relative(PROJECT_ROOT, COMBINED_AUDIO_PATH)}`);
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
