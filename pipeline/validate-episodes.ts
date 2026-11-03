import ep1Json from "../episodes/router-worker.ep1.json";
import mockJson from "../episodes/router-worker.mock.json";
import {resolveEpisode} from "../src/resolve-episode";
import type {Episode} from "../src/types";
import {validateEpisode} from "../src/validate-episode";

const mockEpisode = mockJson as unknown as Episode;
const ep1Episode = ep1Json as unknown as Episode;

const assert: (condition: unknown, message: string) => asserts condition = (
  condition,
  message,
) => {
  if (!condition) {
    throw new Error(`[validate] ${message}`);
  }
};

for (const episode of [mockEpisode, ep1Episode]) {
  validateEpisode(episode);
  console.log(
    `[episode] ${episode.id} ${episode.durationSec}s ` +
      `${episode.scenes.length} scenes ${episode.captions.length} captions ` +
      `voice=${episode.voiceover.voice}`,
  );
}

const wrapped = resolveEpisode({episode: mockEpisode});
assert(wrapped.id === mockEpisode.id, "包裹后的 props 应解析为 mock");

const flat = resolveEpisode(ep1Episode);
assert(flat.id === ep1Episode.id, "扁平 episode JSON 应解析为 ep1");

const merged = resolveEpisode({
  episode: mockEpisode,
  ...ep1Episode,
});
assert(
  merged.id === ep1Episode.id,
  "defaultProps 与 --props 合并后应优先使用扁平 episode",
);
assert(!("episode" in merged), "解析结果不应再嵌套一份 episode");

assert(ep1Episode.themeId === "pixel-dark", "ep1 themeId 必须是 pixel-dark");
assert(ep1Episode.width === 1080 && ep1Episode.height === 1920, "ep1 必须是 1080×1920");
assert(ep1Episode.fps === 30, "ep1 必须是 30fps");
assert(ep1Episode.bgm.enabled === false, "ep1 不应启用 BGM");
assert(
  ep1Episode.voiceover.voice === "zh-CN-YunyangNeural",
  "ep1 声线必须是 zh-CN-YunyangNeural",
);
assert(
  ep1Episode.voiceover.audioSrc === "public/voiceover/router-worker-ep1.mp3",
  "ep1 口播必须指向独立整轨",
);
assert(
  mockEpisode.voiceover.audioSrc === "public/voiceover/router-worker.mp3",
  "mock 口播路径不能被 ep1 改掉",
);

const ep1Frames = Math.round(ep1Episode.durationSec * ep1Episode.fps);
const captionEnd = ep1Episode.captions.reduce(
  (end, caption) => Math.max(end, caption.from + caption.durationInFrames),
  0,
);
const captionStart = Math.min(...ep1Episode.captions.map((caption) => caption.from));
assert(captionStart === 0, "ep1 第一条字幕必须从第 0 帧开始");
assert(captionEnd === ep1Frames, "ep1 字幕必须铺满整条时间轴");

let cursor = 0;
for (const caption of ep1Episode.captions) {
  assert(caption.from === cursor, "ep1 字幕之间不能有空隙或重叠");
  cursor += caption.durationInFrames;
}

assert(
  ep1Episode.durationSec >= ep1Episode.durationTargetSec.min &&
    ep1Episode.durationSec <= ep1Episode.durationTargetSec.max,
  `ep1 时长 ${ep1Episode.durationSec}s 不在 ${ep1Episode.durationTargetSec.min}-${ep1Episode.durationTargetSec.max}s`,
);
assert(ep1Episode.voiceover.status === "ready", "ep1 口播状态必须是 ready");

console.log("[validate] episode props 与 ep1 成片约束通过");
