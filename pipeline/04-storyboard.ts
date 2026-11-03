import type {EpisodeScene, ThemeId, VisualLayout} from "../src/types";
import type {ScriptDraft, StoryboardDraft} from "./types";

export interface BuildStoryboardInput {
  fps?: number;
  durationSec?: number;
  themeId: ThemeId;
}

const visuals: VisualLayout[] = [
  "router-worker",
  "loop",
  "trace",
  "takeaway",
];

export const buildStoryboard = (
  draft: ScriptDraft,
  {
    fps = 30,
    durationSec = 45,
    themeId,
  }: BuildStoryboardInput,
): StoryboardDraft => {
  const durationInFrames = Math.round(durationSec * fps);
  const sectionCount = Math.max(1, draft.sections.length);
  const baseFrames = Math.floor(durationInFrames / sectionCount);

  const scenes: EpisodeScene[] = draft.sections.map((section, index) => {
    const from = index * baseFrames;
    const duration =
      index === sectionCount - 1
        ? durationInFrames - from
        : baseFrames;

    return {
      id: section.id,
      from,
      durationInFrames: duration,
      kicker: `STUB / ${String(index + 1).padStart(2, "0")}`,
      title: section.heading,
      body: section.narration,
      bullets: section.claims.slice(0, 3),
      visual: visuals[index % visuals.length],
    };
  });

  return {
    fps,
    durationInFrames,
    durationSec,
    themeId,
    scenes,
    captions: scenes.map((scene) => ({
      from: scene.from,
      durationInFrames: scene.durationInFrames,
      text: scene.body,
      highlight: scene.title,
    })),
  };
};
