import {runPreviewGateStub} from "./gates/preview-gate.stub";
import type {GateResult, StoryboardDraft} from "./types";

export const applyPreviewGate = (
  storyboard: StoryboardDraft,
): GateResult => {
  return runPreviewGateStub({
    compositionId: "VibeEpisode",
    durationInFrames: storyboard.durationInFrames,
    captionCount: storyboard.captions.length,
  });
};
