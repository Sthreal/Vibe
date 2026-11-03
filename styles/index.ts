import type {ThemeId} from "../src/types";
import type {StylePackage} from "./types";
import historyFlat from "./history-flat";
import pixelDark from "./pixel-dark";
import vectorMinimal from "./vector-minimal";

export const STYLE_PACKAGES: Record<ThemeId, StylePackage> = {
  "pixel-dark": pixelDark,
  "vector-minimal": vectorMinimal,
  "history-flat": historyFlat,
};

export const getStylePackage = (themeId: ThemeId): StylePackage => {
  return STYLE_PACKAGES[themeId] ?? STYLE_PACKAGES["pixel-dark"];
};

export type {StylePackage, StyleTheme, VisualSceneProps} from "./types";
