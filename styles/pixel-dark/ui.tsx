import React from "react";
import {cream, PIXEL_FONT} from "./palette";
import {PixelRobot} from "./PixelRobot";

export const PixelTag: React.FC<{
  text: string;
  color?: string;
  ink?: string;
  size?: number;
}> = ({text, color = cream.yellow, ink = cream.ink, size = 36}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        color: ink,
        border: `4px solid ${cream.ink}`,
        boxShadow: `4px 4px 0 ${cream.ink}`,
        padding: size > 32 ? "8px 14px" : "6px 10px",
        fontFamily: PIXEL_FONT,
        fontSize: size,
        fontWeight: 400,
        fontSynthesis: "none",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const PixelPanel: React.FC<{
  title: string;
  titleColor?: string;
  titleInk?: string;
  children: React.ReactNode;
  width?: number | string;
  fill?: string;
  tall?: boolean;
}> = ({
  title,
  titleColor = cream.yellow,
  titleInk = cream.ink,
  children,
  width = "100%",
  fill = cream.panel,
  tall = false,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width,
        flex: tall ? 1 : undefined,
        height: tall ? "100%" : undefined,
        boxSizing: "border-box",
        justifyContent: tall ? "space-evenly" : undefined,
        background: fill,
        border: `6px solid ${cream.ink}`,
        boxShadow: "8px 8px 0 rgba(60, 42, 24, 0.12)",
        padding: "64px 22px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div style={{position: "absolute", top: -22, left: 18}}>
        <PixelTag text={title} color={titleColor} ink={titleInk} />
      </div>
      {children}
    </div>
  );
};

export const PixelWindow: React.FC<{
  accent: string;
  width?: number;
  height?: number;
  alert?: boolean;
  mascot?: boolean;
  bars?: string[];
}> = ({
  accent,
  width = 210,
  height = 168,
  alert = false,
  mascot = false,
  bars = ["#59d98a", "#f0a05a", "#79c8f6", "#f2c14b"],
}) => {
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        background: cream.window,
        border: `4px solid ${alert ? cream.danger : cream.ink}`,
        boxShadow: "6px 6px 0 rgba(28, 26, 23, 0.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 28,
          background: "#2a303c",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 8px",
        }}
      >
        <Dot color="#ff5f57" />
        <Dot color="#febc2e" />
        <Dot color="#28c840" />
        <div
          style={{
            marginLeft: 8,
            flex: 1,
            height: 8,
            background: accent,
          }}
        />
      </div>
      <div style={{padding: "14px 12px", display: "flex", gap: 10, alignItems: "flex-end"}}>
        {mascot ? <PixelRobot variant="laptop" scale={3} /> : null}
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 10}}>
          {bars.map((color, index) => (
            <div
              key={`${color}-${index}`}
              style={{
                height: 12,
                width: `${88 - index * 14}%`,
                background: color,
              }}
            />
          ))}
        </div>
      </div>
      {alert ? (
        <div
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            width: 28,
            height: 28,
            background: cream.danger,
            color: "#fff",
            fontFamily: PIXEL_FONT,
            fontSize: 24,
            lineHeight: "28px",
            textAlign: "center",
            border: `3px solid ${cream.ink}`,
          }}
        >
          !
        </div>
      ) : null}
    </div>
  );
};

const Dot: React.FC<{color: string}> = ({color}) => {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        background: color,
        boxShadow: `0 0 0 2px ${cream.ink}`,
      }}
    />
  );
};

export const DashedArrow: React.FC<{
  width?: number;
  flip?: boolean;
  color?: string;
  frame?: number;
}> = ({width = 88, flip = false, color = "#8a8175", frame = 0}) => {
  const shift = (frame % 16) * 1.2;
  return (
    <svg
      width={width}
      height={28}
      viewBox={`0 0 ${width} 28`}
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        flex: "0 0 auto",
      }}
    >
      <line
        x1={4}
        y1={14}
        x2={width - 16}
        y2={14}
        stroke={color}
        strokeWidth={4}
        strokeDasharray="10 8"
        strokeDashoffset={-shift}
      />
      <polygon
        points={`${width - 18},4 ${width - 2},14 ${width - 18},24`}
        fill={color}
      />
    </svg>
  );
};
