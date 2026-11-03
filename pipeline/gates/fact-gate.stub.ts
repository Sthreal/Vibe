import type {GateResult} from "../types";

export interface FactGateInput {
  claims: string[];
  sources?: string[];
}

/**
 * 事实闸占位实现。
 * 后续可在这里接检索、来源快照与 claim-level citation 校验。
 */
export const runFactGateStub = (input: FactGateInput): GateResult => {
  return {
    gate: "facts",
    pass: true,
    notes: [
      `stub 已接收 ${input.claims.length} 条待核验 claim。`,
      "当前未调用外部检索；上线前需接入来源快照与逐条引用。",
      "输出仅表示结构检查通过，不代表事实已经人工确认。",
    ],
  };
};
