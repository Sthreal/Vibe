import React, {useContext} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {EpisodeClockContext} from "../shared/episode-clock";
import {BEATS, type Beat} from "./beats";
import {cream, PIXEL_FONT} from "./palette";
import {Laptop, Robot, Whale, YouSeat} from "./sprites";
import {DashedArrow, PixelTag} from "./ui";

const ink = {
  fontFamily: PIXEL_FONT,
  fontWeight: 400 as const,
  fontSynthesis: "none" as const,
  lineHeight: 1,
};

const Nameplate: React.FC<{text: string; size?: number}> = ({
  text,
  size = 36,
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#fffdf8",
        border: "4px solid #1b1b1b",
        boxShadow: "4px 4px 0 #1b1b1b",
        padding: "6px 8px",
      }}
    >
      <div style={{width: 8, height: size * 0.72, background: cream.accent}} />
      <span style={{...ink, fontSize: size, color: cream.ink}}>{text}</span>
      <div style={{width: 8, height: size * 0.72, background: cream.accent}} />
    </div>
  );
};

const DownDash: React.FC<{frame: number; height?: number; color?: string}> = ({
  frame,
  height = 72,
  color = cream.accent,
}) => {
  return (
    <svg width={28} height={height}>
      <line
        x1={14}
        y1={2}
        x2={14}
        y2={height - 18}
        stroke={color}
        strokeWidth={4}
        strokeDasharray="8 7"
        strokeDashoffset={-(frame % 21)}
      />
      <polygon
        points={`4,${height - 18} 14,${height - 2} 24,${height - 18}`}
        fill={color}
      />
    </svg>
  );
};

const MeterBar: React.FC<{
  frame: number;
  progress: number;
  bad?: boolean;
}> = ({frame, progress, bad = false}) => {
  const total = 18;
  const filled = Math.max(2, Math.round(4 + progress * (total - 4)));
  const bob = Math.round(Math.sin(frame / 6) * 6);
  return (
    <div style={{display: "flex", alignItems: "flex-end", gap: 16}}>
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "#241f1c",
          border: "4px solid #1b1b1b",
          padding: 8,
        }}
      >
        {Array.from({length: total}, (_, index) => {
          const on = index < filled;
          const hot = bad ? on : on && index < total * 0.55;
          return (
            <div
              key={index}
              style={{
                width: 18,
                height: 30,
                background: !on ? "#3c3834" : hot ? "#e15b4c" : "#f2c14b",
              }}
            />
          );
        })}
      </div>
      <div style={{transform: `translateY(${bob}px)`}}>
        <div
          style={
            bad
              ? {
                  width: 0,
                  height: 0,
                  borderLeft: "16px solid transparent",
                  borderRight: "16px solid transparent",
                  borderTop: "28px solid #e15b4c",
                }
              : {
                  width: 0,
                  height: 0,
                  borderLeft: "16px solid transparent",
                  borderRight: "16px solid transparent",
                  borderBottom: "28px solid #3faf6a",
                }
          }
        />
      </div>
    </div>
  );
};

const TermWindow: React.FC<{
  accent: string;
  frame: number;
  focused?: boolean;
  alert?: boolean;
  width?: number;
}> = ({accent, frame, focused = false, alert = false, width = 250}) => {
  const bars = [accent, "#f0a05a", "#8eb7e8", "#f2c14b"];
  return (
    <div
      style={{
        width,
        height: 220,
        background: "#16181f",
        border: `4px solid ${alert ? "#e15b4c" : "#1b1b1b"}`,
        boxShadow: focused ? "0 0 0 6px #f2c14b" : "6px 6px 0 rgba(28,26,23,.2)",
        display: "flex",
        flexDirection: "column",
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
        {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
          <div
            key={color}
            style={{width: 10, height: 10, background: color, boxShadow: "0 0 0 2px #1b1b1b"}}
          />
        ))}
      </div>
      <div style={{flex: 1, display: "flex", gap: 8, padding: 10, alignItems: "flex-end"}}>
        <Robot scale={4} pose="idle" frame={frame + accent.length} />
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 8}}>
          {bars.map((color, index) => (
            <div
              key={color}
              style={{
                height: 10,
                width: `${86 - index * 14}%`,
                background: color,
              }}
            />
          ))}
        </div>
      </div>
      <div style={{height: 10, background: accent}} />
    </div>
  );
};

const MacButton: React.FC<{text: string; hot?: boolean}> = ({text, hot}) => {
  return (
    <div
      style={{
        ...ink,
        fontSize: 24,
        color: "#24292f",
        border: `3px solid ${hot ? "#9fd18a" : "#d0d7de"}`,
        background: hot ? "#f6fff3" : "#f6f8fa",
        padding: "8px 12px",
        boxShadow: hot ? "0 0 0 3px #9fd18a" : undefined,
      }}
    >
      {text}
    </div>
  );
};

const PointScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 18}}>
      <YouSeat frame={frame} pose="point" scale={8} />
      <DashedArrow width={78} frame={frame} color={beat.tone === "bad" ? "#e15b4c" : "#e07a4a"} />
      <div style={{display: "flex", flexDirection: "column", gap: 14}}>
        <Nameplate text={beat.title} />
        {beat.chips.map((chip, index) => {
          const on = progress > 0.08 + index * 0.18;
          return (
            <div
              key={chip}
              style={{
                opacity: on ? 1 : 0.28,
                transform: `translateX(${on ? 0 : 18}px)`,
                background: beat.tone === "bad" && index === beat.chips.length - 1 ? "#ffe1dc" : "#fffdf8",
                border: "4px solid #1b1b1b",
                boxShadow: on ? "6px 6px 0 #1b1b1b" : "none",
                padding: "12px 16px",
                minWidth: 280,
                ...ink,
                fontSize: 36,
                color: cream.ink,
              }}
            >
              {chip}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrgScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const workers = beat.chips.slice(0, 6);
  return (
    <div style={{width: 940, position: "relative"}}>
      <div style={{position: "absolute", left: 0, top: 0}}>
        <PixelTag text={beat.kicker} color="#241f33" ink="#fffdf8" size={24} />
      </div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 36}}>
        <YouSeat frame={frame} pose="sit" scale={7} heart />
        <DashedArrow width={90} frame={frame} color="#6fbfb0" />
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <Robot scale={9} pose={Math.floor(frame / 50) % 2 === 0 ? "wave" : "point"} frame={frame} />
          <PixelTag text={beat.title} color={cream.yellow} size={24} />
        </div>
      </div>
      <svg width={820} height={78} style={{display: "block", margin: "0 auto"}}>
        {workers.map((_, index) => {
          const x = 70 + (index % 3) * 270 + (index >= 3 ? 0 : 0);
          const row = index >= 3 ? 1 : 0;
          return (
            <line
              key={index}
              x1={410}
              y1={4}
              x2={x}
              y2={row === 0 ? 70 : 70}
              stroke="#7eb8ae"
              strokeWidth={3}
              strokeDasharray="8 8"
              strokeDashoffset={-(frame % 24)}
              opacity={progress > 0.12 + index * 0.08 ? 1 : 0.15}
            />
          );
        })}
      </svg>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px 24px",
          width: 820,
          margin: "0 auto",
        }}
      >
        {workers.map((label, index) => {
          const on = progress > 0.12 + index * 0.08;
          return (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: on ? 1 : 0,
                transform: `translateY(${on ? 0 : 16}px)`,
              }}
            >
              <Robot scale={5} pose="idle" frame={frame + index * 11} />
              <Laptop scale={4} />
              <div
                style={{
                  marginTop: 4,
                  width: 120,
                  height: 12,
                  background: "#d7b07a",
                  boxShadow: "0 8px 0 #8d6a42",
                }}
              />
              <div style={{marginTop: 10}}>
                <PixelTag text={label} color="#fffdf8" size={24} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ModelScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const cols = [
    {fill: "#f6c7b8", node: "#e07a4a", count: 3},
    {fill: "#f6e3b2", node: "#e2b143", count: 4},
    {fill: "#d7f0ea", node: "#3fafa3", count: 4},
    {fill: "#d5e4f8", node: "#4f86c6", count: 3},
  ];
  const colW = 108;
  const gap = 40;
  const colH = 520;
  const nodeY = (count: number, index: number) => {
    if (count === 1) {
      return colH / 2;
    }
    return 40 + ((colH - 80) * index) / (count - 1);
  };
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 22}}>
      <div style={{display: "flex", alignItems: "center", gap: 18}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
          <Whale frame={frame} scale={8} />
          <PixelTag text="模型" color="#d5e4f8" size={24} />
        </div>
        <div style={{position: "relative", width: cols.length * colW + (cols.length - 1) * gap, height: colH}}>
          <svg width="100%" height={colH} style={{position: "absolute", inset: 0}}>
            {cols.slice(0, -1).map((col, column) =>
              Array.from({length: col.count}, (_, a) =>
                Array.from({length: cols[column + 1].count}, (_, b) => {
                  const x1 = column * (colW + gap) + colW / 2;
                  const x2 = (column + 1) * (colW + gap) + colW / 2;
                  const y1 = nodeY(col.count, a);
                  const y2 = nodeY(cols[column + 1].count, b);
                  return (
                    <line
                      key={`${column}-${a}-${b}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#c3b394"
                      strokeWidth={2}
                    />
                  );
                }),
              ),
            )}
            {(() => {
              const t = (frame % 48) / 48;
              const x = 20 + t * (cols.length * colW + (cols.length - 1) * gap - 40);
              const y = colH / 2 + Math.sin(t * Math.PI * 2) * 80;
              return <circle cx={x} cy={y} r={6} fill="#e07a2f" />;
            })()}
          </svg>
          <div style={{display: "flex", gap, position: "relative"}}>
            {cols.map((col) => (
              <div
                key={col.node}
                style={{
                  position: "relative",
                  width: colW,
                  height: colH,
                  background: col.fill,
                }}
              >
                {Array.from({length: col.count}, (_, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: (colW - 48) / 2,
                      top: nodeY(col.count, index) - 24,
                      width: 48,
                      height: 48,
                      background: col.node,
                      border: "4px solid #1b1b1b",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Nameplate text={beat.title} />
      <MeterBar frame={frame} progress={progress} />
      <div style={{display: "flex", gap: 10}}>
        {beat.chips.map((chip) => (
          <PixelTag key={chip} text={chip} color="#fffdf8" size={24} />
        ))}
      </div>
    </div>
  );
};

const DuoScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const stamp = interpolate(progress, [0.18, 0.32], [1.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showStamp = progress > 0.16;
  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 28, width: 940}}>
      <Cluster
        frame={frame}
        label={beat.chips[0] ?? ""}
        pose="oops"
        brain={beat.chips[0]?.includes("脑") ?? false}
        crossed={beat.tone === "bad"}
      />
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
        <Nameplate text={beat.title} size={36} />
        {beat.tone === "bad" && showStamp ? (
          <div
            style={{
              ...ink,
              fontSize: 36,
              color: "#fffdf8",
              background: "#e15b4c",
              border: "4px solid #1b1b1b",
              padding: "8px 12px",
              transform: `scale(${stamp}) rotate(-8deg)`,
            }}
          >
            不是这边
          </div>
        ) : null}
      </div>
      <Cluster frame={frame + 12} label={beat.chips[1] ?? ""} pose="wave" />
    </div>
  );
};

const Cluster: React.FC<{
  frame: number;
  label: string;
  pose: "idle" | "wave" | "oops" | "point";
  brain?: boolean;
  crossed?: boolean;
}> = ({frame, label, pose, brain = false, crossed = false}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12, position: "relative"}}>
      {brain ? (
        <div style={{display: "flex", gap: 8}}>
          {[0, 1, 2].map((index) => (
            <div key={index} style={{width: 16, height: 16, background: "#f2c14b", border: "3px solid #1b1b1b"}} />
          ))}
        </div>
      ) : (
        <div style={{height: 22}} />
      )}
      <Robot scale={10} pose={pose} frame={frame} />
      {crossed ? (
        <div
          style={{
            position: "absolute",
            top: 70,
            ...ink,
            fontSize: 72,
            color: "#e15b4c",
          }}
        >
          ×
        </div>
      ) : null}
      <PixelTag text={label} color={crossed ? "#ffe1dc" : cream.yellow} size={24} />
    </div>
  );
};

const FlowScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const steps = beat.chips.slice(0, 3);
  const x = interpolate(progress, [0.08, 0.88], [0, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 28}}>
      <Nameplate text={beat.title} />
      <div style={{position: "relative", width: 860, height: 280}}>
        <div
          style={{
            position: "absolute",
            left: Math.round(x),
            top: 0,
          }}
        >
          <Robot scale={7} pose="walk" frame={frame} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {steps.map((step, index) => {
            const active = progress >= index / steps.length && progress < (index + 1) / steps.length;
            return (
              <React.Fragment key={step}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 200}}>
                  <PixelTag text={step} color={active ? cream.yellow : "#fffdf8"} size={24} />
                  <div style={{width: 150, height: 14, background: "#d7b07a", boxShadow: "0 8px 0 #8d6a42"}} />
                </div>
                {index < steps.length - 1 ? (
                  <div style={{marginBottom: 18}}>
                    <DashedArrow width={70} frame={frame} color={beat.tone === "bad" ? "#e15b4c" : "#8a8175"} />
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LoopScene: React.FC<{beat: Beat; frame: number}> = ({beat, frame}) => {
  const nodes = beat.chips.slice(0, 4);
  const pts = [
    {x: 330, y: 0},
    {x: 620, y: 210},
    {x: 330, y: 420},
    {x: 40, y: 210},
  ];
  const t = (frame % 100) / 100;
  const seg = Math.floor(t * 4) % 4;
  const local = (t * 4) % 1;
  const a = pts[seg];
  const b = pts[(seg + 1) % 4];
  const x = a.x + (b.x - a.x) * local;
  const y = a.y + (b.y - a.y) * local;
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
      <Nameplate text={beat.title} />
      <div style={{position: "relative", width: 860, height: 560}}>
        <svg width={860} height={560} style={{position: "absolute", inset: 0}}>
          <polygon
            points="410,70 700,280 410,490 120,280"
            fill="none"
            stroke="#c3b394"
            strokeWidth={4}
            strokeDasharray="10 8"
            strokeDashoffset={-(frame % 28)}
          />
        </svg>
        <div style={{position: "absolute", left: 360, top: 200}}>
          <Robot scale={8} pose="idle" frame={frame} />
        </div>
        <div
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 22,
            height: 22,
            background: "#e07a2f",
            border: "4px solid #1b1b1b",
          }}
        />
        {nodes.map((label, index) => (
          <div key={label} style={{position: "absolute", left: pts[index].x, top: pts[index].y + 28}}>
            <PixelTag text={label} color={seg === index ? cream.yellow : "#fffdf8"} size={24} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  progress,
}) => {
  const reveal = interpolate(progress, [0.05, 0.8], [520, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
      <div
        style={{
          width: 900,
          background: "#24182c",
          border: "6px solid #1b1b1b",
          padding: "28px 26px 22px",
          display: "flex",
          gap: 18,
          position: "relative",
        }}
      >
        <div style={{position: "absolute", left: 18, top: -22}}>
          <PixelTag text={beat.kicker} color={cream.accent} ink="#fffdf8" size={24} />
        </div>
        <div style={{width: 210, color: "#fffdf8", ...ink, fontSize: 24, display: "flex", flexDirection: "column", gap: 16, paddingTop: 24}}>
          <div>1 次</div>
          <div style={{width: 28, height: 20, background: "#f2c14b"}} />
          <div>10 次</div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(5, 22px)", gap: 6}}>
            {Array.from({length: 10}, (_, index) => (
              <div key={index} style={{width: 22, height: 16, background: index < 6 ? "#e07a4a" : "#f2c14b"}} />
            ))}
          </div>
        </div>
        <div style={{flex: 1}}>
          <div style={{...ink, fontSize: 36, color: "#fffdf8", marginBottom: 8}}>{beat.title}</div>
          <svg width={560} height={300}>
            <line x1={36} y1={20} x2={36} y2={250} stroke="#d9d0c4" strokeWidth={4} />
            <line x1={36} y1={250} x2={530} y2={250} stroke="#d9d0c4" strokeWidth={4} />
            <path
              d="M48 36 C 140 48, 210 120, 300 168 S 470 228, 510 236"
              fill="none"
              stroke="#e07a2f"
              strokeWidth={6}
              strokeDasharray={520}
              strokeDashoffset={reveal}
            />
            <circle cx={510} cy={236} r={7} fill="#f2c14b" />
          </svg>
          <div style={{display: "flex", justifyContent: "space-between", ...ink, fontSize: 24, color: "#fffdf8"}}>
            <span>{beat.chips[0]}</span>
            <span>{beat.chips[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrowserScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const lines = beat.chips.filter((_, index) => progress > 0.2 + index * 0.18);
  return (
    <div style={{display: "flex", alignItems: "center", gap: 16}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
        <Whale frame={frame} scale={8} />
        <PixelTag text="模型" color="#d5e4f8" size={24} />
        <PixelTag text="Super-agent" color={cream.accent} ink="#fffdf8" size={24} />
      </div>
      <DashedArrow width={64} frame={frame} color="#8eb7e8" />
      <div
        style={{
          width: 680,
          background: "#fffdf8",
          border: "4px solid #1b1b1b",
          boxShadow: "0 16px 0 rgba(80,60,40,.08)",
        }}
      >
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 14px",
            borderBottom: "4px solid #efe8dc",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
            <div key={color} style={{width: 14, height: 14, borderRadius: 14, background: color}} />
          ))}
        </div>
        <div style={{padding: 18, display: "flex", flexDirection: "column", gap: 14}}>
          <div style={{display: "flex", gap: 10}}>
            <MacButton text="通知" />
            <MacButton text="分叉" />
            <MacButton text="★ 收藏" hot />
          </div>
          <div style={{...ink, fontSize: 24, color: "#57606a"}}>About</div>
          <div
            style={{
              border: "4px solid #e07a2f",
              padding: "14px 16px",
              ...ink,
              fontSize: 36,
              color: "#1b1b1b",
              lineHeight: 1.35,
            }}
          >
            {beat.title}
          </div>
          {lines.map((line) => (
            <div key={line} style={{...ink, fontSize: 24, color: "#24292f"}}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HandoffScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const x = interpolate(progress, [0.12, 0.72], [0, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrived = progress > 0.7;
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 20}}>
      <Nameplate text={beat.title} />
      <div style={{display: "flex", alignItems: "center", gap: 10, position: "relative", width: 860, justifyContent: "space-between"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <Robot scale={10} pose="point" frame={frame} />
          <PixelTag text={beat.chips[0] ?? ""} color={cream.yellow} size={24} />
        </div>
        <div style={{position: "absolute", left: 180 + x, top: 40}}>
          <div
            style={{
              background: "#fffdf8",
              border: "4px solid #1b1b1b",
              boxShadow: "6px 6px 0 #1b1b1b",
              padding: "12px 14px",
              ...ink,
              fontSize: 24,
              maxWidth: 220,
            }}
          >
            {beat.chips[1]}
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <Robot scale={10} pose={arrived ? "wave" : "idle"} frame={frame + 8} />
          <PixelTag text={beat.chips[2] ?? beat.chips[1] ?? ""} color={cream.teal} size={24} />
        </div>
      </div>
    </div>
  );
};

const MeterScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const bad = beat.tone === "bad";
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 22}}>
      <Nameplate text={beat.title} />
      <div style={{display: "flex", alignItems: "center", gap: 28}}>
        <MeterBar frame={frame} progress={bad ? progress : 1 - progress * 0.45} bad={bad} />
        <Robot scale={10} pose={bad ? "oops" : "wave"} frame={frame} />
      </div>
      <div style={{display: "flex", gap: 12}}>
        {beat.chips.map((chip) => (
          <PixelTag key={chip} text={chip} color={bad ? "#ffe1dc" : "#fffdf8"} size={24} />
        ))}
      </div>
    </div>
  );
};

const BubbleScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 28}}>
      <YouSeat frame={frame} pose="sit" scale={8} />
      <div style={{display: "flex", flexDirection: "column", gap: 18}}>
        {beat.chips.map((chip, index) => {
          const on = progress > 0.12 + index * 0.28;
          return (
            <div
              key={chip}
              style={{
                opacity: on ? 1 : 0,
                transform: `translateY(${on ? 0 : 12}px)`,
                background: "#fffdf8",
                border: "4px solid #1b1b1b",
                boxShadow: "6px 6px 0 #1b1b1b",
                padding: "16px 18px",
                ...ink,
                fontSize: 36,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -14,
                  top: 22,
                  width: 16,
                  height: 16,
                  background: "#fffdf8",
                  borderLeft: "4px solid #1b1b1b",
                  borderBottom: "4px solid #1b1b1b",
                  transform: "rotate(45deg)",
                }}
              />
              {chip}
            </div>
          );
        })}
        <Nameplate text={beat.title} />
      </div>
    </div>
  );
};

const CastScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const poses = ["wave", "point", "oops"] as const;
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 28}}>
      <Nameplate text={beat.title} />
      <div style={{display: "flex", gap: 36}}>
        {beat.chips.slice(0, 3).map((chip, index) => {
          const arrive = 0.28 + index * 0.14;
          const walking = progress < arrive;
          const x = interpolate(progress, [index * 0.06, arrive], [-180, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={chip}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                transform: `translateX(${Math.round(x)}px)`,
              }}
            >
              <Robot
                scale={9}
                pose={walking ? "walk" : poses[index]}
                frame={frame + index * 7}
              />
              <PixelTag text={chip} color={index === 1 ? cream.teal : cream.yellow} size={24} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BannerScene: React.FC<{beat: Beat; frame: number; progress: number}> = ({
  beat,
  frame,
  progress,
}) => {
  const open = interpolate(progress, [0, 0.2], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
      <YouSeat frame={frame} pose="sit" scale={6} />
      <DownDash frame={frame} />
      <div
        style={{
          width: 860,
          minHeight: 280,
          background: "#2a2433",
          border: "6px solid #1b1b1b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          transform: `scale(${open})`,
          padding: "20px 24px",
        }}
      >
        <Robot scale={10} pose={progress > 0.45 ? "wave" : "idle"} frame={frame} />
        <div style={{display: "flex", flexDirection: "column", gap: 12}}>
          <Nameplate text={beat.title} />
          {beat.chips.map((chip, index) => (
            <div
              key={chip}
              style={{
                opacity: progress > 0.2 + index * 0.15 ? 1 : 0.3,
                ...ink,
                fontSize: 24,
                color: "#fffdf8",
                background: "#3a3348",
                border: "3px solid #f2c14b",
                padding: "8px 12px",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WindowsScene: React.FC<{beat: Beat; frame: number}> = ({beat, frame}) => {
  const accents = ["#5ec8c5", "#f0a05a", "#8eb7e8", "#e07a4a"];
  const focus = Math.floor(frame / 16) % 4;
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
      <div style={{display: "flex", alignItems: "center", gap: 12}}>
        <YouSeat frame={frame} pose="point" scale={7} />
        <DashedArrow width={70} frame={frame} color="#e15b4c" />
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
          {accents.map((accent, index) => (
            <TermWindow
              key={accent}
              accent={accent}
              frame={frame + index * 13}
              focused={focus === index}
              alert={beat.tone === "bad" && (index === 1 || index === 3)}
              width={270}
            />
          ))}
        </div>
      </div>
      <Nameplate text={beat.title} />
    </div>
  );
};

const renderBeat = (beat: Beat, frame: number, progress: number) => {
  switch (beat.layout) {
    case "point":
      return <PointScene beat={beat} frame={frame} progress={progress} />;
    case "org":
      return <OrgScene beat={beat} frame={frame} progress={progress} />;
    case "model":
      return <ModelScene beat={beat} frame={frame} progress={progress} />;
    case "duo":
      return <DuoScene beat={beat} frame={frame} progress={progress} />;
    case "flow":
      return <FlowScene beat={beat} frame={frame} progress={progress} />;
    case "loop":
      return <LoopScene beat={beat} frame={frame} />;
    case "chart":
      return <ChartScene beat={beat} frame={frame} progress={progress} />;
    case "browser":
      return <BrowserScene beat={beat} frame={frame} progress={progress} />;
    case "handoff":
      return <HandoffScene beat={beat} frame={frame} progress={progress} />;
    case "meter":
      return <MeterScene beat={beat} frame={frame} progress={progress} />;
    case "bubbles":
      return <BubbleScene beat={beat} frame={frame} progress={progress} />;
    case "cast":
      return <CastScene beat={beat} frame={frame} progress={progress} />;
    case "banner":
      return <BannerScene beat={beat} frame={frame} progress={progress} />;
    case "windows":
      return <WindowsScene beat={beat} frame={frame} />;
    default:
      return <PointScene beat={beat} frame={frame} progress={progress} />;
  }
};

export const StageShow: React.FC = () => {
  const frame = useCurrentFrame();
  const captions = useContext(EpisodeClockContext);
  const found = captions.findIndex(
    (cue) => frame >= cue.from && frame < cue.from + cue.durationInFrames,
  );
  const index = found >= 0 ? found : Math.max(0, captions.length - 1);
  const cue = captions[index];
  const beat = BEATS[index] ?? BEATS[index % BEATS.length] ?? BEATS[0];
  const local = cue ? frame - cue.from : frame;
  const duration = cue?.durationInFrames ?? 150;
  const progress = Math.min(1, Math.max(0, local / Math.max(1, duration)));
  const fade = interpolate(local, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slide = interpolate(local, [0, 8], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: fade,
        transform: `translateY(${Math.round(slide)}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {renderBeat(beat, frame, progress)}
    </div>
  );
};
