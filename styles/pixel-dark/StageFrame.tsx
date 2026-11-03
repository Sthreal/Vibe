import React from "react";
import {cream} from "./palette";
import {HeartHUD} from "./HeartHUD";
import {usePixelFont} from "./usePixelFont";

const SPECKS = [
  {x: 70, y: 240, c: "#f0c9b0"},
  {x: 140, y: 860, c: "#d7eadf"},
  {x: 960, y: 420, c: "#f3ddb0"},
  {x: 80, y: 1320, c: "#d5e3f4"},
  {x: 990, y: 1100, c: "#f0c9c0"},
  {x: 520, y: 180, c: "#e7f0df"},
];

export const StageFrame: React.FC<{
  score: number;
  children: React.ReactNode;
}> = ({score, children}) => {
  usePixelFont();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: cream.background,
        backgroundImage: `radial-gradient(${cream.dot} 1.7px, transparent 1.8px)`,
        backgroundSize: "22px 22px",
        color: cream.ink,
      }}
    >
      {SPECKS.map((speck) => (
        <div
          key={`${speck.x}-${speck.y}`}
          style={{
            position: "absolute",
            left: speck.x,
            top: speck.y,
            width: 10,
            height: 10,
            background: speck.c,
            boxShadow: `12px 8px 0 ${speck.c}`,
          }}
        />
      ))}
      <Corner style={{top: 18, left: 18}} />
      <Corner style={{top: 18, right: 18, transform: "scaleX(-1)"}} />
      <Corner style={{bottom: 18, left: 18, transform: "scaleY(-1)"}} />
      <Corner
        style={{bottom: 18, right: 18, transform: "scale(-1, -1)"}}
      />
      <HeartHUD score={score} />
      <div
        style={{
          position: "absolute",
          top: 108,
          left: 40,
          right: 40,
          height: 4,
          background: cream.corner,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 248,
          left: 40,
          right: 40,
          height: 4,
          background: cream.corner,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 242,
          left: "50%",
          width: 18,
          height: 12,
          marginLeft: -9,
          background: cream.accent,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 128,
          left: 28,
          right: 28,
          bottom: 270,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Corner: React.FC<{style: React.CSSProperties}> = ({style}) => {
  return (
    <div
      style={{
        position: "absolute",
        width: 54,
        height: 54,
        borderTop: `6px solid ${cream.corner}`,
        borderLeft: `6px solid ${cream.corner}`,
        ...style,
      }}
    />
  );
};
