import React from "react";
import {interpolate} from "remotion";
import type {VisualLayout} from "../../src/types";
import type {StylePackage, VisualSceneProps} from "../types";

const palette = {
  background: "#f4f2ea",
  surface: "#ffffff",
  text: "#141a21",
  muted: "#68717d",
  line: "#ced3d7",
  accent: "#ff6b35",
};

const VisualCopy: Record<VisualLayout, string[]> = {
  "router-worker": ["Route", "Work", "Verify"],
  loop: ["Plan", "Act", "Observe", "Retry"],
  trace: ["Input", "Worker", "Tool", "Result"],
  takeaway: ["Traceable", "Verifiable", "Reversible"],
};

const VectorScene: React.FC<VisualSceneProps> = ({scene, progress}) => {
  const labels = VisualCopy[scene.visual];
  const shift = interpolate(progress, [0, 1], [0, 44]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: palette.background,
        color: palette.text,
        fontFamily:
          '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "#dfe9ff",
          right: -110,
          top: 120,
          transform: `translateY(${shift}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 190,
          height: 190,
          borderRadius: "50%",
          border: "38px solid #ffbf69",
          left: -54,
          top: 540,
          opacity: 0.72,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 760,
          height: 600,
          padding: 38,
          boxSizing: "border-box",
          border: `2px solid ${palette.text}`,
          borderRadius: 32,
          background: "rgba(255,255,255,.84)",
          boxShadow: "0 30px 80px rgba(20,26,33,.10)",
          transform: `translateY(${shift * 0.15}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: palette.muted,
            fontSize: 23,
            letterSpacing: 2,
          }}
        >
          <span>LIVE WORKFLOW</span>
          <span style={{color: palette.accent, fontWeight: 800}}>
            {String(Math.round(progress * 100)).padStart(2, "0")}%
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginTop: 94,
            flexWrap: "wrap",
          }}
        >
          {labels.map((label, index) => (
            <React.Fragment key={label}>
              <div
                style={{
                  width: labels.length > 3 ? 184 : 214,
                  height: 156,
                  borderRadius: 26,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background:
                    progress > index * (0.8 / labels.length)
                      ? index === 1
                        ? "#141a21"
                        : palette.surface
                      : "#ecebe5",
                  color: index === 1 ? "#ffffff" : palette.text,
                  border: `2px solid ${
                    index === 1 ? palette.accent : palette.line
                  }`,
                  boxSizing: "border-box",
                }}
              >
                <span style={{fontSize: 16, opacity: 0.55}}>
                  0{index + 1}
                </span>
                <span style={{fontSize: 27, fontWeight: 750}}>{label}</span>
              </div>
              {index < labels.length - 1 ? (
                <span
                  style={{
                    width: labels.length > 3 ? 18 : 30,
                    height: 2,
                    background: palette.accent,
                  }}
                />
              ) : null}
            </React.Fragment>
          ))}
        </div>
        <div
          style={{
            marginTop: 70,
            padding: "20px 24px",
            borderRadius: 18,
            background: "#eef2f7",
            color: palette.muted,
            fontSize: 22,
            lineHeight: 1.5,
          }}
        >
          每个节点输出可检查证据，异常沿原路径回传。
        </div>
      </div>
    </div>
  );
};

const vectorMinimal: StylePackage = {
  theme: {
    id: "vector-minimal",
    label: "Vector Minimal",
    palette,
    headingFont:
      '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    bodyFont:
      '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    radius: 26,
  },
  SceneVisual: VectorScene,
};

export default vectorMinimal;
