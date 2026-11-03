import React from "react";
import {
  Composition,
  type CalculateMetadataFunction,
} from "remotion";
import mockEpisodeJson from "../episodes/router-worker.mock.json";
import {EpisodeComposition, type EpisodeProps} from "./Episode";
import {resolveEpisode} from "./resolve-episode";
import type {Episode} from "./types";
import {validateEpisode} from "./validate-episode";

const mockEpisode = mockEpisodeJson as unknown as Episode;
validateEpisode(mockEpisode);

export const calculateEpisodeMetadata: CalculateMetadataFunction<
  EpisodeProps
> = ({props}) => {
  const episode = resolveEpisode(props);
  validateEpisode(episode);

  return {
    durationInFrames: Math.round(episode.durationSec * episode.fps),
    fps: episode.fps,
    width: episode.width,
    height: episode.height,
    props: {episode},
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="VibeEpisode"
      component={EpisodeComposition}
      durationInFrames={Math.round(mockEpisode.durationSec * mockEpisode.fps)}
      fps={mockEpisode.fps}
      width={mockEpisode.width}
      height={mockEpisode.height}
      defaultProps={{episode: mockEpisode}}
      calculateMetadata={calculateEpisodeMetadata}
    />
  );
};
