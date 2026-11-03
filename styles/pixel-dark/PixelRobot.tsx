import React from "react";

const COLORS: Record<string, string> = {
  "#": "#1b1b1b",
  "@": "#f7f8fa",
  s: "#d5dae1",
  b: "#3ec0ff",
  e: "#79c8f6",
  d: "#3d87bf",
  k: "#1b1b1b",
  y: "#f2c14b",
  o: "#e07a2f",
  g: "#8fd18f",
  r: "#d4544a",
  w: "#2a3140",
  c: "#59d98a",
  a: "#f0a05a",
  p: "#efe7d6",
};

const IDLE = [
  ".......bb.......",
  ".......##.......",
  "......####......",
  "....########....",
  "...##@@@@@@##...",
  "..#e#@@@@@@#e#..",
  "..#e#@k@@@k@#e#.",
  "..#e#@@@@@@#e#..",
  "...##@@mm@@##...",
  ".....######.....",
  "......####......",
  ".....######.....",
  "....########....",
  "...##@@@@@@##...",
  "..###@@@@@@###..",
  "..#@@@@@@@@@@#..",
  "...##@@@@@@##...",
  "....########....",
  ".....##..##.....",
  ".....##..##.....",
];

const WAVE = [
  ".......bb.......",
  ".......##.......",
  "......####......",
  "....########....",
  "...##@@@@@@##...",
  ".s#e#@@@@@@#e#..",
  "s.#e#@kk@@kk@#e.",
  "s..#e#@@@@@@#e#.",
  "s...##@@mm@@##..",
  ".....######.....",
  "......####......",
  ".....######.....",
  "....########....",
  "...##@@@@@@##...",
  "...##@@@@@@###..",
  "....#@######@@#.",
  "...##@@@@@@##...",
  "....########....",
  ".....##..##.....",
  ".....##..##.....",
];

const CROWN = [
  "...y..y..y..y...",
  "..yyyyyyyyyyyy..",
  ".......bb.......",
  ".......##.......",
  "......####......",
  "....########....",
  "...##@@@@@@##...",
  "..#e#@@@@@@#e#..",
  "..#e#@k@@@k@#e#.",
  "..#e#@@@@@@#e#..",
  "...##@@mm@@##...",
  ".....######.....",
  "......####......",
  ".....######.....",
  "....########....",
  "...##@@@@@@##...",
  "..###@@@@@@###..",
  "..#@@@@@@@@@@#..",
  "...##@@@@@@##...",
  "....########....",
  ".....##..##.....",
  ".....##..##.....",
];

export type RobotVariant = "idle" | "laptop" | "crown" | "wave" | "clipboard";

const spriteFor = (variant: RobotVariant) => {
  if (variant === "crown") {
    return CROWN;
  }
  if (variant === "wave") {
    return WAVE;
  }
  return IDLE;
};

export const PixelRobot: React.FC<{
  variant?: RobotVariant;
  scale?: number;
  blink?: boolean;
}> = ({variant = "idle", scale = 8, blink = false}) => {
  const rows = spriteFor(variant).map((row) => row.padEnd(18, ".").slice(0, 18));
  const width = 18;
  const antenna = blink ? "#8fd8ff" : COLORS.b;
  const extra = variant === "clipboard" ? 7 * scale : 0;

  return (
    <div
      style={{
        position: "relative",
        width: width * scale + extra,
        height: rows.length * scale,
        flex: "0 0 auto",
      }}
    >
      {rows.map((row, y) =>
        [...row].map((cell, x) => {
          if (cell === "." || cell === " ") {
            return null;
          }
          const color = cell === "b" ? antenna : COLORS[cell];
          if (!color) {
            return null;
          }
          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * scale,
                top: y * scale,
                width: scale,
                height: scale,
                background: color,
              }}
            />
          );
        }),
      )}
      {variant === "laptop" ? (
        <Laptop scale={scale} top={13 * scale} left={4 * scale} />
      ) : null}
      {variant === "clipboard" ? (
        <Clipboard scale={scale} top={11 * scale} left={12 * scale} />
      ) : null}
    </div>
  );
};

const Laptop: React.FC<{scale: number; top: number; left: number}> = ({
  scale,
  top,
  left,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 12 * scale,
        height: 7 * scale,
        background: "#232833",
        boxShadow: `0 0 0 ${Math.max(2, scale / 2)}px #1b1b1b`,
      }}
    >
      <Bar scale={scale} top={1} width={8} color="#59d98a" />
      <Bar scale={scale} top={3} width={5} color="#f0a05a" />
      <Bar scale={scale} top={5} width={7} color="#79c8f6" />
    </div>
  );
};

const Clipboard: React.FC<{scale: number; top: number; left: number}> = ({
  scale,
  top,
  left,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 6 * scale,
        height: 8 * scale,
        background: "#f4efe4",
        boxShadow: `0 0 0 ${Math.max(2, scale / 2)}px #1b1b1b`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 1.5 * scale,
          top: -scale,
          width: 3 * scale,
          height: 2 * scale,
          background: "#d9d3c6",
          boxShadow: `0 0 0 ${Math.max(2, scale / 3)}px #1b1b1b`,
        }}
      />
      <Bar scale={scale} top={2} width={4} color="#1b1b1b" />
      <Bar scale={scale} top={4} width={3} color="#7dcf8a" />
      <Bar scale={scale} top={6} width={4} color="#1b1b1b" />
    </div>
  );
};

const Bar: React.FC<{
  scale: number;
  top: number;
  width: number;
  color: string;
}> = ({scale, top, width, color}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: scale,
        top: top * scale,
        width: width * scale,
        height: scale,
        background: color,
      }}
    />
  );
};
