import React from "react";
import {cream} from "./palette";
import {HeartHUD} from "./HeartHUD";
import {usePixelFont} from "./usePixelFont";
import {PixelTag} from "./ui";

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
  title: string;
  children: React.ReactNode;
}> = ({score, title, children}) => {
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
      <div style={{position: "absolute", top: 118, left: 48, zIndex: 3}}>
        <PixelTag text={title} color={cream.panelAlt} size={36} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 196,
          left: 36,
          right: 36,
          bottom: 250,
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
