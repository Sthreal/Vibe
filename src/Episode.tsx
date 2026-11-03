import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {NarrationLayer} from "../styles/shared/NarrationLayer";
import {getStylePackage} from "../styles";
import type {Episode} from "./types";

export interface EpisodeProps {
  episode: Episode;
}

export const EpisodeComposition: React.FC<EpisodeProps> = ({episode}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const style = getStylePackage(episode.themeId);
  const palette = style.theme.palette;
  const activeScene =
    episode.scenes.find(
      (scene) =>
        frame >= scene.from && frame < scene.from + scene.durationInFrames,
    ) ?? episode.scenes[episode.scenes.length - 1];
  const localFrame = Math.max(0, frame - activeScene.from);
  const sceneProgress = Math.min(
    1,
    localFrame / Math.max(1, activeScene.durationInFrames - 1),
  );
  const entrance = interpolate(localFrame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneIndex = episode.scenes.findIndex(
    (scene) => scene.id === activeScene.id,
  );
  const currentSecond = Math.floor(frame / videoConfig.fps);
  const durationLabel = `${String(Math.floor(currentSecond / 60)).padStart(
    2,
    "0",
  )}:${String(currentSecond % 60).padStart(2, "0")}`;

  return (
    <AbsoluteFill
      style={{
        background: palette.background,
        color: palette.text,
        fontFamily: style.theme.bodyFont,
      }}
    >
      <style.SceneVisual
        scene={activeScene}
        progress={sceneProgress}
        frame={frame}
      />

      <div
        style={{
          position: "absolute",
          top: 64,
          left: 64,
          right: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: palette.muted,
          fontFamily:
            '"Noto Sans Mono CJK SC", "Noto Sans CJK SC", monospace',
          fontSize: 22,
          letterSpacing: 2.5,
        }}
      >
        <span
          style={{
            padding: "10px 15px",
            border: `1px solid ${palette.line}`,
            background: "rgba(0,0,0,.24)",
          }}
        >
          VIBE / DEBUG
        </span>
        <span>
          {String(sceneIndex + 1).padStart(2, "0")} /
          {String(episode.scenes.length).padStart(2, "0")} · {durationLabel}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 174,
          left: 66,
          right: 66,
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * 20}px)`,
        }}
      >
        <div
          style={{
            color: palette.accent,
            fontFamily:
              '"Noto Sans Mono CJK SC", "Noto Sans CJK SC", monospace',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          {activeScene.kicker}
        </div>
        <div
          style={{
            maxWidth: 930,
            fontFamily: style.theme.headingFont,
            fontSize: 80,
            fontWeight: 850,
            lineHeight: 1.16,
            letterSpacing: -1.5,
          }}
        >
          {activeScene.title}
        </div>
        <div
          style={{
            maxWidth: 880,
            marginTop: 28,
            color: palette.text,
            fontSize: 34,
            fontWeight: 450,
            lineHeight: 1.55,
            opacity: 0.78,
          }}
        >
          {activeScene.body}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1418,
          display: "flex",
          gap: 12,
          justifyContent: "center",
          opacity: entrance,
        }}
      >
        {activeScene.bullets.map((bullet, index) => (
          <div
            key={bullet}
            style={{
              flex: 1,
              minHeight: 74,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 14px",
              boxSizing: "border-box",
              border: `1px solid ${
                index === sceneIndex % activeScene.bullets.length
                  ? palette.accent
                  : palette.line
              }`,
              color: palette.text,
              background:
                index === sceneIndex % activeScene.bullets.length
                  ? "rgba(255,138,31,.12)"
                  : "rgba(0,0,0,.22)",
              fontSize: 21,
              lineHeight: 1.35,
              textAlign: "center",
            }}
          >
            {bullet}
          </div>
        ))}
      </div>

      <NarrationLayer
        captions={episode.captions}
        voiceover={episode.voiceover}
        bgm={episode.bgm}
      />
    </AbsoluteFill>
  );
};
