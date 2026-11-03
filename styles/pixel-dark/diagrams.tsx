import React from "react";
import type {EpisodeScene} from "../../src/types";
import {cream} from "./palette";
import {PixelRobot} from "./PixelRobot";
import {DashedArrow, PixelPanel, PixelTag, PixelWindow} from "./ui";

const ColumnColors = ["#f6c7b8", "#f6e3b2", "#d5eee4", "#d5e4f8"];
const NodeCounts = [2, 3, 4, 3];

export const NeuralColumns: React.FC = () => {
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 28}}>
      <div style={{display: "flex", gap: 28, alignItems: "center"}}>
        {NodeCounts.map((count, column) => (
          <div
            key={column}
            style={{
              width: 108,
              minHeight: 420,
              background: ColumnColors[column],
              border: `4px solid ${cream.ink}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              padding: "18px 0",
            }}
          >
            {Array.from({length: count}, (_, node) => (
              <div
                key={node}
                style={{
                  width: 42,
                  height: 42,
                  background: ["#e07a4a", "#e2b143", "#3fafa3", "#4f86c6"][column],
                  border: `4px solid ${cream.ink}`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <PixelTag text="模型" color={cream.panelAlt} />
      <Meter filled={14} total={22} />
      <PixelTag text="不是更大的模型" color="#fff" />
    </div>
  );
};

export const ManyWindows: React.FC<{frame: number}> = ({frame}) => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 18, width: "100%"}}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
        <PixelRobot variant="laptop" scale={11} />
        <PixelTag text="先别加" color={cream.danger} ink="#fff" />
      </div>
      <DashedArrow width={70} frame={frame} color={cream.danger} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {["#5ec8c5", "#f0a05a", "#8eb7e8", "#e07a4a"].map((accent, index) => (
          <PixelWindow
            key={accent}
            accent={accent}
            width={300}
            height={250}
            mascot
            alert={index === 1 || index === 3}
          />
        ))}
      </div>
    </div>
  );
};

export const RouterChoice: React.FC<{
  scene: EpisodeScene;
  progress: number;
}> = ({scene, progress}) => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 28, width: "100%"}}>
      <PixelPanel title="Router" titleColor={cream.yellow} width={420}>
        <PixelRobot variant="wave" scale={12} />
        <PixelTag text="只做选择" color={cream.panelAlt} size={28} />
      </PixelPanel>
      <div style={{display: "flex", flexDirection: "column", gap: 18, flex: 1}}>
        {scene.bullets.map((bullet, index) => {
          const on = progress > 0.12 + index * 0.22;
          return (
            <div
              key={bullet}
              style={{
                border: `4px solid ${cream.ink}`,
                background: on ? cream.yellow : cream.panelAlt,
                padding: "22px 18px",
                fontFamily: '"VibePixel", sans-serif',
                fontSize: 32,
                boxShadow: on ? `6px 6px 0 ${cream.ink}` : "none",
              }}
            >
              {`${index + 1}. ${bullet}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const WorkerEvidence: React.FC<{scene: EpisodeScene}> = ({scene}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%"}}>
      <PixelTag text="交回证据" color={cream.teal} />
      <div style={{display: "flex", gap: 16}}>
        {scene.bullets.map((bullet, index) => (
          <div key={bullet} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
            <PixelWindow
              accent={["#5ec8c5", "#f0a05a", "#8eb7e8"][index] ?? cream.teal}
              width={280}
              height={210}
            />
            <div style={{marginTop: -36}}>
              <PixelRobot variant="laptop" scale={4} />
            </div>
            <PixelTag text={bullet} color={cream.panelAlt} size={24} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ToolRack: React.FC<{frame: number}> = ({frame}) => {
  const tools = [
    {label: "读文件", color: "#d5e4f8"},
    {label: "跑命令", color: "#f6e3b2"},
    {label: "查网页", color: "#d5eee4"},
  ];
  return (
    <div style={{display: "flex", alignItems: "center", gap: 16, width: "100%"}}>
      <div style={{display: "flex", flexDirection: "column", gap: 16}}>
        {tools.map((tool) => (
          <PixelTag key={tool.label} text={tool.label} color={tool.color} />
        ))}
      </div>
      <DashedArrow width={80} frame={frame} />
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
        <PixelWindow accent="#7fd1c7" width={360} height={240} />
        <PixelTag text="Worker" color={cream.teal} />
      </div>
    </div>
  );
};

export const ContractCards: React.FC<{scene: EpisodeScene}> = ({scene}) => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 18}}>
      <Note title="输入" lines={["目标", "缺口", "预算"]} color="#d5e4f8" />
      <PixelRobot variant="clipboard" scale={7} />
      <Note title="输出" lines={scene.bullets} color="#d5eee4" />
    </div>
  );
};

export const BoundarySplit: React.FC = () => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 22}}>
      <PixelPanel title="Router" titleColor={cream.yellow} width={430}>
        <PixelRobot variant="idle" scale={8} />
        <PixelTag text="只选择" color={cream.panelAlt} />
      </PixelPanel>
      <PixelPanel title="最终答案" titleColor={cream.danger} titleInk="#fff" width={430}>
        <div
          style={{
            width: 120,
            height: 120,
            border: `10px solid ${cream.danger}`,
            color: cream.danger,
            fontSize: 84,
            lineHeight: "100px",
            textAlign: "center",
            fontFamily: '"VibePixel", sans-serif',
          }}
        >
          ×
        </div>
        <PixelTag text="不在这里写" color={cream.panelAlt} size={28} />
      </PixelPanel>
    </div>
  );
};

export const StateLoop: React.FC<{
  progress: number;
  labels: string[];
}> = ({progress, labels}) => {
  const steps = labels.length >= 3 ? labels.slice(0, 4) : ["计划", "执行", "观察", "重试"];
  while (steps.length < 4) {
    steps.push(["计划", "执行", "观察", "重试"][steps.length]);
  }
  return (
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, width: 760}}>
      {steps.map((label, index) => {
        const on = progress > index * 0.18;
        return (
          <div
            key={`${label}-${index}`}
            style={{
              minHeight: 240,
              border: `5px solid ${cream.ink}`,
              background: on ? cream.yellow : cream.panel,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              boxShadow: on ? `6px 6px 0 ${cream.ink}` : "none",
            }}
          >
            <span style={{fontFamily: '"VibePixel", sans-serif', fontSize: 28, color: cream.muted}}>
              {`0${index + 1}`}
            </span>
            <span style={{fontFamily: '"VibePixel", sans-serif', fontSize: 40}}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const BudgetMeter: React.FC<{progress: number}> = ({progress}) => {
  const total = 24;
  const filled = Math.round(4 + progress * 14);
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 28}}>
      <PixelTag text="重试封顶" color={cream.danger} ink="#fff" />
      <div style={{display: "flex", alignItems: "center", gap: 16}}>
        <div
          style={{
            display: "flex",
            background: "#2a2a2a",
            border: `4px solid ${cream.ink}`,
            padding: 8,
            gap: 4,
          }}
        >
          {Array.from({length: total}, (_, index) => (
            <div
              key={index}
              style={{
                width: 22,
                height: 36,
                background:
                  index < filled
                    ? index < 12
                      ? "#e15b4c"
                      : "#f2c14b"
                    : "#3a3a3a",
              }}
            />
          ))}
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "22px solid transparent",
            borderRight: "22px solid transparent",
            borderBottom: `36px solid ${cream.green}`,
          }}
        />
      </div>
      <PixelTag text="没有新证据就停" color={cream.panelAlt} size={28} />
    </div>
  );
};

export const EscalateCard: React.FC<{scene: EpisodeScene}> = ({scene}) => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 24}}>
      <PixelRobot variant="clipboard" scale={9} />
      <PixelPanel title="升级给人" titleColor={cream.accent} titleInk="#fff" width={520}>
        {scene.bullets.map((bullet) => (
          <PixelTag key={bullet} text={bullet} color={cream.panelAlt} />
        ))}
      </PixelPanel>
    </div>
  );
};

export const TraceFlow: React.FC<{
  frame: number;
  failed?: boolean;
}> = ({frame, failed = false}) => {
  const rows = failed
    ? [
        {label: "测试仍是红", bad: true},
        {label: "同一份报错", bad: true},
        {label: "升级给人", bad: false},
      ]
    : [
        {label: "路由输入", bad: false},
        {label: "Worker 产出", bad: false},
        {label: "工具回执", bad: false},
      ];
  return (
    <div style={{display: "flex", alignItems: "center", gap: 12, width: "100%"}}>
      <div style={{display: "flex", flexDirection: "column", gap: 14, width: 280}}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              border: `4px solid ${cream.ink}`,
              background: row.bad ? "#3a2222" : cream.panelAlt,
              color: row.bad ? "#fff" : cream.ink,
              padding: "16px 14px",
              fontFamily: '"VibePixel", sans-serif',
              fontSize: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{row.label}</span>
            <span>{row.bad ? "×" : "→"}</span>
          </div>
        ))}
      </div>
      <DashedArrow width={64} frame={frame} />
      <div style={{display: "flex", flexDirection: "column", gap: 16, flex: 1}}>
        <PixelPanel title="Router" titleColor={cream.yellow} width="100%">
          <PixelRobot variant="idle" scale={10} />
        </PixelPanel>
        <PixelPanel title="Worker" titleColor={cream.teal} width="100%">
          <PixelWindow
            accent={failed ? cream.danger : cream.teal}
            width={280}
            height={150}
            alert={failed}
          />
        </PixelPanel>
      </div>
    </div>
  );
};

export const RollbackSteps: React.FC<{progress: number}> = ({progress}) => {
  const steps = ["写入", "检查点", "撤回"];
  return (
    <div style={{display: "flex", alignItems: "center", gap: 12}}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            style={{
              width: 230,
              minHeight: 260,
              border: `5px solid ${cream.ink}`,
              background: progress > index * 0.25 ? cream.yellow : cream.panel,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <PixelRobot variant={index === 2 ? "wave" : "laptop"} scale={5} />
            <PixelTag text={step} color={index === 2 ? cream.teal : cream.panelAlt} size={28} />
          </div>
          {index < steps.length - 1 ? (
            <div style={{fontSize: 42, fontFamily: '"VibePixel", sans-serif'}}>→</div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export const ChecklistTable: React.FC = () => {
  const rows = [
    ["检索", "问题", "引用", "空结果"],
    ["改文件", "路径", "diff", "测试红"],
    ["跑命令", "预算", "退出码", "超时"],
  ];
  return (
    <div style={{border: `5px solid ${cream.ink}`, background: cream.panelAlt}}>
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 180px)"}}>
        {["Worker", "输入", "输出", "失败码"].map((head) => (
          <Cell key={head} text={head} head />
        ))}
        {rows.flat().map((cell, index) => (
          <Cell key={`${cell}-${index}`} text={cell} />
        ))}
      </div>
    </div>
  );
};

export const TakeawayChecks: React.FC<{
  progress: number;
  labels: string[];
}> = ({progress, labels}) => {
  const rows = [
    {en: "TRACE", zh: labels[0] ?? "可追溯"},
    {en: "VERIFY", zh: labels[1] ?? "可验收"},
    {en: "ROLLBACK", zh: labels[2] ?? "可回滚"},
  ];
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 16, width: 820}}>
      {rows.map((row, index) => {
        const on = progress > 0.15 + index * 0.22;
        return (
          <div
            key={row.en}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: `5px solid ${on && index === 1 ? cream.accent : cream.ink}`,
              background: on && index === 1 ? "#fff1df" : cream.panel,
              minHeight: 150,
              padding: "28px 22px",
              fontFamily: '"VibePixel", sans-serif',
            }}
          >
            <span style={{fontSize: 36}}>{row.en}</span>
            <span style={{fontSize: 32}}>{row.zh}</span>
            <span style={{fontSize: 36, color: on ? cream.accent : cream.muted}}>
              {on ? "✓" : "·"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Meter: React.FC<{filled: number; total: number}> = ({filled, total}) => {
  return (
    <div style={{display: "flex", alignItems: "center", gap: 14}}>
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "#2c2c2c",
          border: `4px solid ${cream.ink}`,
          padding: 8,
        }}
      >
        {Array.from({length: total}, (_, index) => (
          <div
            key={index}
            style={{
              width: 18,
              height: 28,
              background: index < filled ? (index < 10 ? "#e15b4c" : "#f2c14b") : "#3c3c3c",
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderBottom: "28px solid #3faf6a",
        }}
      />
    </div>
  );
};

const Note: React.FC<{
  title: string;
  lines: string[];
  color: string;
}> = ({title, lines, color}) => {
  return (
    <div
      style={{
        width: 300,
        minHeight: 360,
        background: color,
        border: `5px solid ${cream.ink}`,
        boxShadow: `8px 8px 0 rgba(60,42,24,.12)`,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <PixelTag text={title} color={cream.panelAlt} />
      {lines.map((line) => (
        <div
          key={line}
          style={{
            borderBottom: `4px solid ${cream.ink}`,
            fontFamily: '"VibePixel", sans-serif',
            fontSize: 30,
            paddingBottom: 8,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

const Cell: React.FC<{text: string; head?: boolean}> = ({text, head = false}) => {
  return (
    <div
      style={{
        borderRight: `3px solid ${cream.ink}`,
        borderBottom: `3px solid ${cream.ink}`,
        background: head ? cream.yellow : "transparent",
        padding: "16px 10px",
        textAlign: "center",
        fontFamily: '"VibePixel", sans-serif',
        fontSize: head ? 26 : 28,
      }}
    >
      {text}
    </div>
  );
};
