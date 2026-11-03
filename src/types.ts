export const THEME_IDS = [
  "pixel-dark",
  "vector-minimal",
  "history-flat",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export type VisualLayout = "router-worker" | "loop" | "trace" | "takeaway";

export interface CaptionCue {
  from: number;
  durationInFrames: number;
  text: string;
  highlight?: string;
}

export interface EpisodeScene {
  id: string;
  from: number;
  durationInFrames: number;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  visual: VisualLayout;
}

export interface VoiceoverConfig {
  strategy: "tts";
  status: "mocked" | "ready" | "missing";
  voice: string;
  audioSrc?: string;
}

export interface BgmConfig {
  enabled: boolean;
  audioSrc?: string;
  volumeDb: number;
}

export interface Episode {
  schemaVersion: 1;
  id: string;
  topic: string;
  title: string;
  themeId: ThemeId;
  width: number;
  height: number;
  fps: number;
  durationSec: number;
  durationTargetSec: {
    min: number;
    max: number;
  };
  voiceover: VoiceoverConfig;
  bgm: BgmConfig;
  scenes: EpisodeScene[];
  captions: CaptionCue[];
}
