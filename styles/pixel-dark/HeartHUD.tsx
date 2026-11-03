import React from "react";
import {cream, PIXEL_FONT} from "./palette";
import {usePixelFont} from "./usePixelFont";

const HEART = ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"];

export const HeartHUD: React.FC<{
  score: number;
}> = ({score}) => {
  usePixelFont();
  const label = `x${String(score).padStart(2, "0")}`;

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        right: 28,
        zIndex: 4,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: cream.hud,
        border: `4px solid ${cream.ink}`,
        padding: "10px 14px 10px 12px",
        fontFamily: PIXEL_FONT,
        fontSynthesis: "none",
        fontWeight: 400,
      }}
    >
      <div style={{display: "flex", gap: 4}}>
        {[0, 1, 2].map((heart) => (
          <Heart key={heart} />
        ))}
      </div>
      <div
        style={{
          width: 16,
          height: 16,
          background: cream.yellow,
          boxShadow: `0 0 0 3px ${cream.ink}`,
        }}
      />
      <span style={{color: cream.yellow, fontSize: 28, lineHeight: 1}}>
        {label}
      </span>
      <span style={{color: cream.white, fontSize: 28, lineHeight: 1}}>
        Vibe
      </span>
    </div>
  );
};

const Heart: React.FC = () => {
  const scale = 4;
  return (
    <div
      style={{
        position: "relative",
        width: 7 * scale,
        height: 6 * scale,
      }}
    >
      {HEART.map((row, y) =>
        [...row].map((cell, x) =>
          cell === "1" ? (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * scale,
                top: y * scale,
                width: scale,
                height: scale,
                background: "#e23d3d",
              }}
            />
          ) : null,
        ),
      )}
    </div>
  );
};
