import React from "react";
import type {StylePackage, VisualSceneProps} from "../types";
import {ArchitectureCompare} from "./ArchitectureCompare";
import {CaptionBar} from "./CaptionBar";
import {
  BoundarySplit,
  BudgetMeter,
  ChecklistTable,
  ContractCards,
  EscalateCard,
  ManyWindows,
  NeuralColumns,
  RollbackSteps,
  RouterChoice,
  StateLoop,
  TakeawayChecks,
  ToolRack,
  TraceFlow,
  WorkerEvidence,
} from "./diagrams";
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

const PixelScene: React.FC<VisualSceneProps> = ({scene, progress, frame}) => {
  const score = SCORE[scene.id] ?? 1;

  return (
    <StageFrame score={score} title={scene.title}>
      <SceneDiagram scene={scene} progress={progress} frame={frame} />
    </StageFrame>
  );
};

const SceneDiagram: React.FC<VisualSceneProps> = ({scene, progress, frame}) => {
  switch (scene.id) {
    case "hook":
      return <ManyWindows frame={frame} />;
    case "definition":
      return <NeuralColumns />;
    case "misconception":
      return <ArchitectureCompare progress={progress} />;
    case "router":
      return <RouterChoice scene={scene} progress={progress} />;
    case "worker":
      return <WorkerEvidence scene={scene} />;
    case "tools":
      return <ToolRack frame={frame} />;
    case "contract":
      return <ContractCards scene={scene} />;
    case "boundaries":
      return <BoundarySplit />;
    case "loop":
      return <StateLoop progress={progress} labels={["计划", "执行", "观察", "重试"]} />;
    case "budget":
      return <BudgetMeter progress={progress} />;
    case "escalate":
      return <EscalateCard scene={scene} />;
    case "trace":
      return <TraceFlow frame={frame} />;
    case "case":
      return <TraceFlow frame={frame} failed />;
    case "rollback":
      return <RollbackSteps progress={progress} />;
    case "checklist":
      return <ChecklistTable />;
    case "takeaway":
      return <TakeawayChecks progress={progress} labels={scene.bullets} />;
    default:
      return <ArchitectureCompare progress={progress} />;
  }
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
