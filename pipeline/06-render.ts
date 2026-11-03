import type {Episode} from "../src/types";
import type {RenderPlan} from "./types";

export interface RenderPlanOptions {
  propsPath?: string;
}

export const createRenderPlan = (
  episode: Episode,
  {propsPath = `episodes/${episode.id}.json`}: RenderPlanOptions = {},
): RenderPlan => {
  const outputPath = `out/${episode.id}.mp4`;

  return {
    compositionId: "VibeEpisode",
    entryPoint: "src/index.ts",
    propsPath,
    outputPath,
    command: `npx remotion render src/index.ts VibeEpisode ${outputPath} --props=${propsPath}`,
  };
};
