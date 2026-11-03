import React from "react";
import {Audio, staticFile} from "remotion";
import type {
  BgmConfig,
  CaptionCue,
  VoiceoverConfig,
} from "../../src/types";
import {OrangeCaption} from "./OrangeCaption";

export interface NarrationLayerProps {
  captions: CaptionCue[];
  voiceover: VoiceoverConfig;
  bgm: BgmConfig;
  Caption?: React.ComponentType<{captions: CaptionCue[]}>;
  volume?: number;
}

const resolveAudioSource = (path: string) => {
  if (/^(https?:|data:)/.test(path)) {
    return path;
  }

  return staticFile(path.replace(/^\/?public\//, ""));
};

const DecibelToGain = (decibels: number) => Math.pow(10, decibels / 20);

export const NarrationLayer: React.FC<NarrationLayerProps> = ({
  captions,
  voiceover,
  bgm,
  Caption = OrangeCaption,
  volume = 1,
}) => {
  return (
    <>
      {voiceover.audioSrc ? (
        <Audio src={resolveAudioSource(voiceover.audioSrc)} volume={volume} />
      ) : null}
      {bgm.enabled && bgm.audioSrc ? (
        <Audio
          src={resolveAudioSource(bgm.audioSrc)}
          volume={DecibelToGain(bgm.volumeDb)}
          loop
        />
      ) : null}
      <Caption captions={captions} />
    </>
  );
};
