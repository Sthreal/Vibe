import type {
  ExportManifest,
  GateResult,
  RenderPlan,
} from "./types";

export interface ExportInput {
  episodeId: string;
  renderPlan: RenderPlan;
  gates: GateResult[];
}

export const createExportManifest = ({
  episodeId,
  renderPlan,
  gates,
}: ExportInput): ExportManifest => {
  const failedGate = gates.find((gate) => !gate.pass);

  return {
    episodeId,
    videoPath: renderPlan.outputPath,
    gates,
    status: failedGate ? "blocked" : "ready-for-review",
    notes: failedGate
      ? [`阻断：${failedGate.gate} 闸未通过，禁止进入发布。`]
      : ["stub 闸均通过；导出前仍需人工预览确认。"],
  };
};
