import React, {useMemo} from "react";

const PALETTE: Record<string, string> = {
  k: "#1b1b1b",
  w: "#f7fbff",
  a: "#d7e0ec",
  b: "#3ec0ff",
  d: "#1f6fbf",
  n: "#163e86",
  e: "#1b1b1b",
  m: "#1b1b1b",
  o: "#5a302c",
  y: "#ffd15a",
  u: "#e2a62e",
  h: "#d5dbe6",
  i: "#8e99ab",
  s: "#ffd2b8",
  p: "#4e463f",
  g: "#6dce8a",
  t: "#3aafa0",
  c: "#f2c14b",
  r: "#e23d3d",
  f: "#fffdf8",
  z: "#d7b07a",
};

const centerRows = (rows: string[]) => {
  const width = Math.max(1, ...rows.map((row) => row.length));
  return rows.map((row) => {
    const pad = width - row.length;
    const left = Math.floor(pad / 2);
    return `${".".repeat(left)}${row}${".".repeat(pad - left)}`;
  });
};

export const PixelArt: React.FC<{
  rows: string[];
  scale: number;
}> = ({rows, scale}) => {
  const norm = centerRows(rows);
  const shadow = norm
    .flatMap((row, y) =>
      [...row].flatMap((cell, x) => {
        const color = PALETTE[cell];
        if (!color) {
          return [];
        }
        return [`${x * scale}px ${y * scale}px 0 ${color}`];
      }),
    )
    .join(",");
  const width = norm[0].length * scale;
  const height = norm.length * scale;

  return (
    <div style={{width, height, position: "relative", flex: "0 0 auto"}}>
      <div
        style={{
          width: scale,
          height: scale,
          background: "transparent",
          boxShadow: shadow,
        }}
      />
    </div>
  );
};

const ROBOT_BODY = [
  "..........bb..........",
  "..........bb..........",
  "..........kk..........",
  "........kwwwwk........",
  ".......kwwwwwwk.......",
  "......kwwwwwwwwk......",
  ".....kwwewwwwewwk.....",
  "...bbbwwwwwwwwwwbbb...",
  "...bbbwwwwmmwwwwbbb...",
  "....kkwwwwwwwwwwkk....",
  "......kwwwwwwwwk......",
  ".....kwwwaaaawwwk.....",
  "....kwwwwaaaawwwwk....",
  "...kkwwwwwwwwwwwwkk...",
  "..kwwkwwwwwwwwwwkwwk..",
  "..kww.kwwwwwwwwk.wwk..",
  "...kk....kkkk....kk...",
  "....ww...kwwk...ww....",
  "....ww....kk....ww....",
  "...ww..........ww.....",
];

const LEGS_STEP = [
  "..ww..........ww..",
  ".ww..............ww",
  "ww................ww",
];

const POINT_ARM = ["kwwwwwwk", "kwwwwwwk", "kkkkkkkk"];

const WAVE_ARM = ["kk..", "kwk.", "kwwk", ".kwwk", "..kk"];

export type RobotPose = "idle" | "walk" | "point" | "wave" | "oops";

const robotRows = (pose: RobotPose, blink: boolean, step: number) => {
  const body =
    pose === "walk" && step === 1
      ? [...ROBOT_BODY.slice(0, -3), ...LEGS_STEP]
      : ROBOT_BODY;
  return body.map((row) => {
    let next = blink ? row.replaceAll("e", "w") : row;
    if (pose === "oops") {
      next = next.replaceAll("m", "o");
    }
    return next;
  });
};

export const Robot: React.FC<{
  scale?: number;
  pose?: RobotPose;
  frame?: number;
}> = ({scale = 8, pose = "idle", frame = 0}) => {
  const blink = frame % 100 < 6;
  const step = Math.floor(frame / 7) % 2;
  const rows = useMemo(
    () => robotRows(pose, blink, step),
    [pose, blink, step],
  );
  const bob = Math.round(Math.sin(frame / 8) * (pose === "walk" ? 3 : 5));
  const bodyWidth = Math.max(...rows.map((row) => row.length));

  return (
    <div
      style={{
        position: "relative",
        transform: `translateY(${bob}px)`,
        width: "fit-content",
      }}
    >
      <PixelArt rows={rows} scale={scale} />
      {pose === "point" ? (
        <div
          style={{
            position: "absolute",
            left: (bodyWidth - 3) * scale,
            top: 13 * scale,
          }}
        >
          <PixelArt rows={POINT_ARM} scale={scale} />
        </div>
      ) : null}
      {pose === "wave" ? (
        <div style={{position: "absolute", left: -2 * scale, top: 1 * scale}}>
          <PixelArt rows={WAVE_ARM} scale={scale} />
        </div>
      ) : null}
    </div>
  );
};

const GIRL = [
  "........hhhh........",
  ".......hhhhhh.......",
  "........iiii........",
  "......hhhhhhhh......",
  ".....hhihhhhiih.....",
  "....hhsssssssshh....",
  "...hhssseessessh....",
  "...hhsssssssssssh...",
  "....hsssmmmmsssh....",
  ".....ssssssssss.....",
  "......yyyyyyyy......",
  ".....yyyyyyyyyy.....",
  "....yyuyyyyyyuyy....",
  "...yyyu......uyyy...",
  "...yyy........yyy...",
  "....yy........yy....",
  "....pp........pp....",
  "...ppp........ppp...",
  "...pp..........pp...",
  "..pp............pp..",
];

const GIRL_LEGS = [
  "...pp........pp...",
  "..pp..........pp..",
  ".pp............pp.",
];

export type GirlPose = "idle" | "walk" | "point" | "sit";

export const Girl: React.FC<{
  scale?: number;
  pose?: GirlPose;
  frame?: number;
}> = ({scale = 7, pose = "idle", frame = 0}) => {
  const blink = frame % 110 < 6;
  const step = Math.floor(frame / 8) % 2;
  const rows = useMemo(() => {
    const cropped =
      pose === "sit"
        ? GIRL.slice(0, 16)
        : pose === "walk" && step === 1
          ? [...GIRL.slice(0, -3), ...GIRL_LEGS]
          : GIRL;
    return cropped.map((row) => (blink ? row.replaceAll("e", "s") : row));
  }, [pose, blink, step]);
  const bob = Math.round(Math.sin((frame + 4) / 9) * 3);

  return (
    <div style={{position: "relative", transform: `translateY(${bob}px)`}}>
      <PixelArt rows={rows} scale={scale} />
      {pose === "point" ? (
        <div
          style={{
            position: "absolute",
            left: 14 * scale,
            top: 12 * scale,
          }}
        >
          <PixelArt rows={["yyyyyyyy", "kkkkkkkk"]} scale={scale} />
        </div>
      ) : null}
    </div>
  );
};

const WHALE_A = [
  ".........bbbbbbb........",
  "......bbbbbbbbbbbb......",
  "....bbbbbbwwwwbbbbbb....",
  "...bbbbbwwwwwwwwbbbbb...",
  "..bbbbbbwwwwwwwwwbbbbb..",
  "..bbbbbekwwwwwwwwbbbbb..",
  "..bbbbbbwwwwmmwwwbbbb...",
  "...bbbbbbbbbbbbbbbbb....",
  ".....bbbbbbbbbbb..bb....",
  "........bbbbbb..........",
  "..........bb....bb......",
];

const WHALE_B = [
  ".........bbbbbbb........",
  "......bbbbbbbbbbbb......",
  "....bbbbbbwwwwbbbbbb....",
  "...bbbbbwwwwwwwwbbbbb...",
  "..bbbbbbwwwwwwwwwbbbbb..",
  "..bbbbbekwwwwwwwwbbbbb..",
  "..bbbbbbwwwwmmwwwbbbb...",
  "...bbbbbbbbbbbbbbbbb....",
  ".....bbbbbbbbbbb........",
  "........bbbbbb...bb.....",
  "..........bbbbbbb.......",
];

export const Whale: React.FC<{scale?: number; frame?: number}> = ({
  scale = 7,
  frame = 0,
}) => {
  const step = Math.floor(frame / 10) % 2;
  const bob = Math.round(Math.sin(frame / 9) * 6);
  return (
    <div style={{transform: `translateY(${bob}px)`}}>
      <PixelArt rows={step ? WHALE_B : WHALE_A} scale={scale} />
    </div>
  );
};

const LAPTOP = [
  ".kkkkkkkk.",
  "kffffffffk",
  "kggggggggk",
  "kffffffffk",
  "kttttttttk",
  ".kkkkkkkkk.",
];

export const Laptop: React.FC<{scale?: number}> = ({scale = 5}) => {
  return <PixelArt rows={LAPTOP} scale={scale} />;
};

const HEART = ["rr.rr", "rrrrr", "rrrrr", ".rrr.", "..r.."];

export const MiniHeart: React.FC<{scale?: number}> = ({scale = 5}) => {
  return <PixelArt rows={HEART} scale={scale} />;
};

export const YouSeat: React.FC<{
  frame: number;
  pose?: GirlPose;
  scale?: number;
  heart?: boolean;
}> = ({frame, pose = "sit", scale = 6, heart = false}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      {heart ? (
        <div
          style={{
            background: "#fffdf8",
            border: "4px solid #1b1b1b",
            padding: 6,
            marginBottom: 8,
          }}
        >
          <MiniHeart scale={4} />
        </div>
      ) : null}
      <Girl pose={pose} frame={frame} scale={scale} />
      <div
        style={{
          marginTop: pose === "sit" ? -8 : 8,
          background: "#e15b3c",
          color: "#fffdf8",
          border: "4px solid #1b1b1b",
          fontFamily: '"VibePixel", sans-serif',
          fontSize: 24,
          lineHeight: 1,
          padding: "6px 14px",
        }}
      >
        你
      </div>
    </div>
  );
};
