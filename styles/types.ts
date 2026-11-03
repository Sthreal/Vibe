import type {ComponentType} from "react";
import type {EpisodeScene, ThemeId} from "../src/types";

export interface StylePalette {
  background: string;
  surface: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
}

export interface StyleTheme {
  id: ThemeId;
  label: string;
  palette: StylePalette;
  headingFont: string;
  bodyFont: string;
  radius: number;
}

export interface VisualSceneProps {
  scene: EpisodeScene;
  progress: number;
  frame: number;
}

export interface StylePackage {
  theme: StyleTheme;
  SceneVisual: ComponentType<VisualSceneProps>;
}
