import React from "react";
import {
  Composition,
  type CalculateMetadataFunction,
} from "remotion";
import mockEpisodeJson from "../episodes/router-worker.mock.json";
import {EpisodeComposition, type EpisodeProps} from "./Episode";
import type {Episode} from "./types";
import {validateEpisode} from "./validate-episode";

const mockEpisode = mockEpisodeJson as unknown as Episode;
validateEpisode(mockEpisode);

export const calculateEpisodeMetadata: CalculateMetadataFunction<
  EpisodeProps
> = ({props}) => {
  validateEpisode(props.episode);

  return {
    durationInFrames: Math.round(
      props.episode.durationSec * props.episode.fps,
    ),
    fps: props.episode.fps,
    width: props.episode.width,
    height: props.episode.height,
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
