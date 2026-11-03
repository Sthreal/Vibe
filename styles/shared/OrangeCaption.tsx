import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import type {CaptionCue} from "../../src/types";

const ACCENT = "#ff8a1f";

export interface OrangeCaptionProps {
  captions: CaptionCue[];
}

const splitHighlight = (cue: CaptionCue) => {
  if (!cue.highlight) {
    return [cue.text];
  }

  const at = cue.text.indexOf(cue.highlight);
  if (at < 0) {
    return [cue.text];
  }

  return [
    cue.text.slice(0, at),
    cue.highlight,
    cue.text.slice(at + cue.highlight.length),
  ];
};

export const OrangeCaption: React.FC<OrangeCaptionProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const cue = captions.find(
    (candidate) =>
      frame >= candidate.from &&
      frame < candidate.from + candidate.durationInFrames,
  );

  if (!cue) {
    return null;
  }

  const cueProgress =
    (frame - cue.from) / Math.max(1, cue.durationInFrames - 1);
  const entrance = interpolate(cueProgress, [0, 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const segments = splitHighlight(cue);
  const highlightIndex = cue.highlight ? 1 : -1;

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 72,
        minHeight: 218,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        padding: "34px 40px 36px 44px",
        borderLeft: `10px solid ${ACCENT}`,
        borderRadius: 10,
        background: "rgba(5, 8, 14, 0.93)",
        boxShadow: "0 20px 80px rgba(0, 0, 0, 0.38)",
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 28}px)`,
      }}
    >
      <div
        style={{
          color: "#f5f7fb",
          fontFamily:
            '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
          fontSize: 52,
          fontWeight: 750,
          lineHeight: 1.45,
          letterSpacing: 1,
        }}
      >
        {segments.map((segment, index) => (
          <span
            key={`${cue.from}-${index}`}
            style={
              index === highlightIndex
                ? {
                    color: ACCENT,
                    textShadow: "0 0 28px rgba(255, 138, 31, 0.32)",
                  }
                : undefined
            }
          >
            {segment}
          </span>
        ))}
      </div>
    </div>
  );
};
