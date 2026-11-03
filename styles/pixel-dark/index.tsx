import React from "react";
import type {StylePackage, VisualSceneProps} from "../types";
import {CaptionBar} from "./CaptionBar";
import {StageShow} from "./layouts";
import {cream, PIXEL_FONT} from "./palette";
import {StageFrame} from "./StageFrame";

const SCORE: Record<string, number> = {
  hook: 1,
  definition: 2,
  misconception: 3,
  router: 4,
  worker: 5,
  tools: 6,
  contract: 7,
  boundaries: 8,
  loop: 9,
  budget: 10,
  escalate: 11,
  trace: 12,
  case: 13,
  rollback: 14,
  checklist: 15,
  takeaway: 16,
};

const PixelScene: React.FC<VisualSceneProps> = ({scene}) => {
  const score = SCORE[scene.id] ?? 1;

  return (
    <StageFrame score={score}>
      <StageShow />
    </StageFrame>
  );
};

const pixelDark: StylePackage = {
  theme: {
    id: "pixel-dark",
    label: "Cream Pixel",
    palette: {
      background: cream.background,
      surface: cream.panel,
      text: cream.ink,
      muted: cream.muted,
      line: cream.line,
      accent: cream.accent,
    },
    headingFont: PIXEL_FONT,
    bodyFont: PIXEL_FONT,
    radius: 0,
  },
  chrome: "stage",
  Caption: CaptionBar,
  voiceVolume: 1,
  SceneVisual: PixelScene,
};

export default pixelDark;
