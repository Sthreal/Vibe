import React from "react";
import {interpolate} from "remotion";
import type {VisualLayout} from "../../src/types";
import type {StylePackage, VisualSceneProps} from "../types";

const palette = {
  background: "#e8dbc3",
  surface: "#f7efdf",
  text: "#2d261e",
  muted: "#776957",
  line: "#b6a58a",
  accent: "#b9502d",
};

const ChapterNames: Record<VisualLayout, string[]> = {
  "router-worker": ["决策", "执行", "验收"],
  loop: ["计划", "行动", "观察", "修正"],
  trace: ["来处", "经手", "凭据", "结论"],
  takeaway: ["可追溯", "可复核", "可退回"],
};

const HistoryScene: React.FC<VisualSceneProps> = ({scene, progress}) => {
  const items = ChapterNames[scene.visual];
  const lift = interpolate(progress, [0, 1], [12, -12]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        color: palette.text,
        background: palette.background,
        fontFamily:
          '"Noto Serif CJK SC", "Songti SC", "SimSun", serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.28,
          backgroundImage:
            "repeating-linear-gradient(7deg, rgba(84,63,41,.16) 0, rgba(84,63,41,.16) 1px, transparent 1px, transparent 8px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 96,
          right: 94,
          width: 200,
          height: 200,
          border: `2px solid ${palette.accent}`,
          transform: "rotate(8deg)",
          opacity: 0.35,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          letterSpacing: 5,
        }}
      >
        工作簿
      </div>
      <div
        style={{
          position: "absolute",
          left: 58,
          right: 58,
          top: 742,
          height: 630,
          boxSizing: "border-box",
          padding: "32px 42px",
          background: palette.surface,
          border: `2px solid ${palette.line}`,
          boxShadow: `10px 14px 0 rgba(78,59,38,.15)`,
          transform: `translateY(${lift}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 20,
            borderBottom: `1px solid ${palette.line}`,
            color: palette.muted,
            fontSize: 23,
            letterSpacing: 3,
          }}
        >
          <span>案卷 · {String(scene.id).toUpperCase()}</span>
          <span style={{color: palette.accent}}>
            {String(Math.round(progress * 100)).padStart(2, "0")}%
          </span>
        </div>
        <div
          style={{
            marginTop: 38,
            display: "grid",
            gridTemplateColumns:
              items.length > 3 ? "1fr 1fr" : `repeat(${items.length}, 1fr)`,
            gap: 22,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item}
              style={{
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                border: `1px solid ${palette.line}`,
                background:
                  progress > index * (0.8 / items.length)
                    ? index === 1
                      ? "rgba(185,80,45,.10)"
                      : "#fffaf0"
                    : "rgba(232,219,195,.34)",
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              <span style={{fontSize: 18, color: palette.accent}}>
                第 {index + 1} 则
              </span>
              {item}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 44,
            paddingTop: 22,
            borderTop: `1px dashed ${palette.line}`,
            color: palette.muted,
            fontSize: 22,
            lineHeight: 1.65,
          }}
        >
          凡调度，必留因由；凡产出，必附凭据；凡失败，必可复归。
        </div>
      </div>
    </div>
  );
};

const historyFlat: StylePackage = {
  theme: {
    id: "history-flat",
    label: "History Flat",
    palette,
    headingFont:
      '"Noto Serif CJK SC", "Songti SC", "SimSun", serif',
    bodyFont:
      '"Noto Serif CJK SC", "Songti SC", "SimSun", serif',
    radius: 2,
  },
  SceneVisual: HistoryScene,
};

export default historyFlat;
