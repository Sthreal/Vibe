import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import type {CaptionCue} from "../../src/types";
import {cream, PIXEL_FONT} from "./palette";
import {usePixelFont} from "./usePixelFont";

export const CaptionBar: React.FC<{
  captions: CaptionCue[];
}> = ({captions}) => {
  usePixelFont();
  const frame = useCurrentFrame();
  const cue = captions.find(
    (candidate) =>
      frame >= candidate.from &&
      frame < candidate.from + candidate.durationInFrames,
  );

  if (!cue) {
    return null;
  }

  const entrance = interpolate(frame - cue.from, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const parts = splitHighlight(cue);

  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        right: 48,
        bottom: 64,
        zIndex: 5,
        display: "flex",
        justifyContent: "center",
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 10}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 984,
          boxSizing: "border-box",
          background: cream.caption,
          border: `4px solid ${cream.ink}`,
          boxShadow: "0 0 0 4px #e4d8c4, 6px 6px 0 rgba(60,42,24,.18)",
          padding: "18px 22px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <Tick />
        <div
          style={{
            color: cream.white,
            fontFamily: PIXEL_FONT,
            fontSize: 36,
            fontWeight: 400,
            fontSynthesis: "none",
            lineHeight: 1.45,
            textAlign: "center",
          }}
        >
          {parts.map((part, index) => (
            <span
              key={`${cue.from}-${index}`}
              style={
                part.highlight ? {color: cream.highlight} : undefined
              }
            >
              {part.text}
            </span>
          ))}
        </div>
        <Tick />
      </div>
    </div>
  );
};

const Tick: React.FC = () => {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        flex: "0 0 auto",
        background: cream.accent,
        alignSelf: "center",
      }}
    />
  );
};

const splitHighlight = (cue: CaptionCue) => {
  if (!cue.highlight) {
    return [{text: cue.text, highlight: false}];
  }
  const at = cue.text.indexOf(cue.highlight);
  if (at < 0) {
    return [{text: cue.text, highlight: false}];
  }
  return [
    {text: cue.text.slice(0, at), highlight: false},
    {text: cue.highlight, highlight: true},
    {text: cue.text.slice(at + cue.highlight.length), highlight: false},
  ].filter((part) => part.text.length > 0);
};
