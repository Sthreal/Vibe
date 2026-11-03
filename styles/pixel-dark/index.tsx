import React from "react";
import {interpolate} from "remotion";
import type {VisualLayout} from "../../src/types";
import type {StylePackage, VisualSceneProps} from "../types";

const palette = {
  background: "#070b12",
  surface: "#111a2a",
  text: "#f2f6ff",
  muted: "#8ea0bd",
  line: "#29405f",
  accent: "#ff8a1f",
};

const Labels: Record<VisualLayout, string[]> = {
  "router-worker": ["ROUTER", "WORKER_A", "WORKER_B", "WORKER_C"],
  loop: ["PLAN", "ACT", "OBSERVE", "RETRY"],
  trace: ["INPUT", "WORKER", "TOOL", "RESULT"],
  takeaway: ["TRACE", "VERIFY", "ROLLBACK"],
};

const PixelScene: React.FC<VisualSceneProps> = ({
  scene,
  progress,
  frame,
}) => {
  const labels = Labels[scene.visual];
  const pulse = 0.5 + Math.sin(frame / 9) * 0.5;
  const drift = interpolate(progress, [0, 1], [24, -24]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        color: palette.text,
        background: palette.background,
        fontFamily:
          '"Noto Sans Mono CJK SC", "Noto Sans CJK SC", monospace',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(74,111,156,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(74,111,156,.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          right: -190,
          top: 80,
          border: "2px solid rgba(255,138,31,.26)",
          transform: `rotate(45deg) translateY(${drift}px)`,
          boxShadow: `0 0 ${80 + pulse * 80}px rgba(255,138,31,.08)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 28,
          height: 28,
          left: 76,
          top: 86,
          background: palette.accent,
          boxShadow: "72px 0 0 #243854, 144px 0 0 #243854",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 742,
          height: 636,
          boxSizing: "border-box",
          padding: 34,
          background: "rgba(9, 15, 25, .88)",
          border: `2px solid ${palette.line}`,
          boxShadow: "12px 12px 0 rgba(0, 0, 0, .36)",
          transform: `translateY(${drift * 0.32}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: palette.muted,
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span>TRACE/{String(scene.id).toUpperCase()}</span>
          <span style={{color: palette.accent}}>
            ● {String(Math.round(progress * 100)).padStart(3, "0")}%
          </span>
        </div>

        {scene.visual === "router-worker" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: 26,
              marginTop: 54,
              alignItems: "center",
            }}
          >
            <PixelNode
              label={labels[0]}
              active={progress > 0.2}
              accent
              large
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              {labels.slice(1).map((label, index) => (
                <PixelNode
                  key={label}
                  label={label}
                  active={progress > 0.38 + index * 0.12}
                />
              ))}
              <div
                style={{
                  gridColumn: "1 / -1",
                  color: palette.muted,
                  fontSize: 20,
                  lineHeight: 1.5,
                  borderTop: `1px dashed ${palette.line}`,
                  paddingTop: 20,
                }}
              >
                &gt; dispatch(task) -&gt; evidence -&gt; verify()
              </div>
            </div>
          </div>
        ) : null}

        {scene.visual === "loop" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginTop: 48,
            }}
          >
            {labels.map((label, index) => (
              <PixelNode
                key={label}
                label={`${String(index + 1).padStart(2, "0")} ${label}`}
                active={progress > 0.12 + index * 0.18}
              />
            ))}
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "18px 22px",
                border: `1px solid ${palette.accent}`,
                color: palette.accent,
                fontSize: 22,
              }}
            >
              IF retry += 1 &gt; budget: ESCALATE_HUMAN
            </div>
          </div>
        ) : null}

        {scene.visual === "trace" ? (
          <div style={{marginTop: 58}}>
            {labels.map((label, index) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  marginBottom: 18,
                  opacity: progress > 0.08 + index * 0.15 ? 1 : 0.25,
                }}
              >
                <span
                  style={{
                    width: 106,
                    color: index === 1 ? palette.accent : palette.muted,
                    fontSize: 21,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    flex: 1,
                    height: 42,
                    border: `1px solid ${palette.line}`,
                    background:
                      index === 1
                        ? "rgba(255,138,31,.13)"
                        : "rgba(40,62,91,.30)",
                    padding: "8px 14px",
                    boxSizing: "border-box",
                    fontSize: 20,
                    color: palette.text,
                  }}
                >
                  {["request", "tool_call", "timeout: 8s", "unverified"][index]}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {scene.visual === "takeaway" ? (
          <div
            style={{
              marginTop: 62,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {labels.map((label, index) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: `1px solid ${
                    index === 1 ? palette.accent : palette.line
                  }`,
                  padding: "20px 24px",
                  background:
                    index === 1 ? "rgba(255,138,31,.10)" : "transparent",
                  fontSize: 25,
                  letterSpacing: 2,
                }}
              >
                <span>{label}</span>
                <span
                  style={{
                    color:
                      progress > 0.25 + index * 0.18
                        ? palette.accent
                        : palette.muted,
                  }}
                >
                  ✓
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const PixelNode: React.FC<{
  label: string;
  active: boolean;
  accent?: boolean;
  large?: boolean;
}> = ({label, active, accent = false, large = false}) => {
  return (
    <div
      style={{
        minHeight: large ? 188 : 98,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 18,
        boxSizing: "border-box",
        border: `2px solid ${active && accent ? palette.accent : palette.line}`,
        background: active
          ? accent
            ? "rgba(255,138,31,.14)"
            : "rgba(29,47,71,.72)"
          : "rgba(14,22,36,.42)",
        color: active ? palette.text : palette.muted,
        fontSize: large ? 26 : 21,
        letterSpacing: 2,
        boxShadow: active ? "6px 6px 0 rgba(0,0,0,.32)" : "none",
      }}
    >
      {label}
    </div>
  );
};

const pixelDark: StylePackage = {
  theme: {
    id: "pixel-dark",
    label: "Pixel Dark",
    palette,
    headingFont:
      '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    bodyFont:
      '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    radius: 0,
  },
  SceneVisual: PixelScene,
};

export default pixelDark;
