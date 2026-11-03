import React from "react";
import {interpolate} from "remotion";
import {cream} from "./palette";
import {PixelRobot} from "./PixelRobot";
import {PixelPanel, PixelTag, PixelWindow} from "./ui";

const WINDOW_ACCENTS = ["#5ec8c5", "#f0a05a", "#8eb7e8"];

export const ArchitectureCompare: React.FC<{
  progress: number;
}> = ({progress}) => {
  const right = interpolate(progress, [0.08, 0.28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: 1240,
        display: "flex",
        gap: 22,
        alignItems: "stretch",
      }}
    >
      <PixelPanel title="常见架构" titleColor="#5c4d86" titleInk="#f6f3ee" width="48%" tall>
        <PixelRobot variant="crown" scale={11} />
        <PixelTag text="主 agent" color={cream.yellow} />
      </PixelPanel>
      <div style={{width: "52%", height: "100%", display: "flex", opacity: 0.35 + right * 0.65}}>
        <PixelPanel title="双层架构" titleColor={cream.accent} titleInk="#fff8ef" tall>
          <PixelRobot variant="wave" scale={9} />
          <PixelTag text="Router" color={cream.yellow} />
          <div style={{display: "flex", gap: 10}}>
            {WINDOW_ACCENTS.map((accent) => (
              <PixelWindow
                key={accent}
                accent={accent}
                width={148}
                height={132}
                mascot
                bars={["#59d98a", "#f0a05a"]}
              />
            ))}
          </div>
          <PixelTag text="Worker" color={cream.teal} />
        </PixelPanel>
      </div>
    </div>
  );
};
