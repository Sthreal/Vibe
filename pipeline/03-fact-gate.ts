import {runFactGateStub} from "./gates/fact-gate.stub";
import type {FactCheckStepResult, ScriptDraft} from "./types";

export const applyFactGate = (draft: ScriptDraft): FactCheckStepResult => {
  const claims = draft.sections.flatMap((section) => section.claims);

  return {
    result: runFactGateStub({claims}),
    checkedClaimCount: claims.length,
  };
};
