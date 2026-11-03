import type {GateResult} from "../types";

export interface PreviewGateInput {
  compositionId: string;
  durationInFrames: number;
  captionCount: number;
}

/**
 * 预览闸占位实现。
 * 后续可在这里接关键帧抽检、静音检测、字幕越界检测和人工确认。
 */
export const runPreviewGateStub = (
  input: PreviewGateInput,
): GateResult => {
  return {
    gate: "preview",
    pass: true,
    notes: [
      `${input.compositionId} 已登记预览，时长 ${input.durationInFrames} 帧。`,
      `发现 ${input.captionCount} 条字幕；当前未执行 OCR/静音/二维码抽检。`,
      "最终发布前仍需人工完整观看一次。",
    ],
  };
};
