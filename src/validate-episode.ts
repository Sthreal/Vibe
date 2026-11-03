import {THEME_IDS, type Episode} from "./types";

const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) {
    throw new Error(`[episode] ${message}`);
  }
};

export const validateEpisode = (episode: Episode): void => {
  assert(episode.schemaVersion === 1, "schemaVersion 必须为 1");
  assert(episode.fps > 0, "fps 必须大于 0");
  assert(episode.durationSec > 0, "durationSec 必须大于 0");
  assert(
    THEME_IDS.includes(episode.themeId),
    `未知 themeId: ${episode.themeId}`,
  );
  assert(episode.scenes.length > 0, "至少需要一个 scene");
  assert(episode.captions.length > 0, "至少需要一条字幕");

  const expectedFrames = Math.round(episode.durationSec * episode.fps);
  const sceneEnd = Math.max(
    ...episode.scenes.map((scene) => scene.from + scene.durationInFrames),
  );
  assert(
    sceneEnd === expectedFrames,
    `scene 总帧数 ${sceneEnd} 与 durationSec*fps ${expectedFrames} 不一致`,
  );

  const orderedScenes = [...episode.scenes].sort((a, b) => a.from - b.from);
  assert(orderedScenes[0]?.from === 0, "第一个 scene 必须从第 0 帧开始");

  orderedScenes.forEach((scene, index) => {
    assert(scene.from >= 0, `scene ${scene.id} 起点不能为负数`);
    assert(scene.durationInFrames > 0, `scene ${scene.id} 时长必须大于 0`);
    const previous = orderedScenes[index - 1];
    assert(
      !previous ||
        scene.from === previous.from + previous.durationInFrames,
      `scene ${scene.id} 与前一个 scene 之间存在空隙或重叠`,
    );
  });

  for (const cue of episode.captions) {
    assert(cue.from >= 0, `字幕 ${cue.from} 起点不能为负数`);
    assert(cue.durationInFrames > 0, `字幕 ${cue.from} 时长必须大于 0`);
    assert(
      cue.from + cue.durationInFrames <= expectedFrames,
      `字幕 ${cue.from} 超出 episode 时长`,
    );
  }
};
