import type {
  CaptionCue,
  EpisodeScene,
  ThemeId,
} from "../src/types";

export interface TopicBrief {
  id: string;
  topic: string;
  angle: string;
  audience: string;
  durationTargetSec: {
    min: number;
    max: number;
  };
  exclusions: string[];
}

export interface ScriptSection {
  id: string;
  heading: string;
  narration: string;
  claims: string[];
}

export interface ScriptDraft {
  title: string;
  thesis: string;
  sections: ScriptSection[];
  editorialStatus: "stub";
}

export interface GateResult {
  gate: "facts" | "preview";
  pass: boolean;
  notes: string[];
}

export interface FactCheckStepResult {
  result: GateResult;
  checkedClaimCount: number;
}

export interface StoryboardDraft {
  fps: number;
  durationInFrames: number;
  durationSec: number;
  themeId: ThemeId;
  scenes: EpisodeScene[];
  captions: CaptionCue[];
}

export interface TtsSegment {
  id: string;
  from: number;
  durationInFrames: number;
  text: string;
}

export interface TtsManifest {
  engine: "stub";
  voice: string;
  status: "not-generated";
  segments: TtsSegment[];
  bgm: "disabled";
  note: string;
}

export interface RenderPlan {
  compositionId: "VibeEpisode";
  entryPoint: "src/index.ts";
  propsPath: string;
  outputPath: string;
  command: string;
}

export interface ExportManifest {
  episodeId: string;
  videoPath: string;
  gates: GateResult[];
  status: "blocked" | "ready-for-review";
  notes: string[];
}
