import type {ScriptDraft, ScriptSection, TopicBrief} from "./types";

const defaultSections: Omit<ScriptSection, "id">[] = [
  {
    heading: "先拆责任边界",
    narration:
      "Router 负责决定下一步，Worker 负责在受限上下文里执行，并把可验证证据交回来。",
    claims: ["Router 与 Worker 的职责可以分离。"],
  },
  {
    heading: "把执行变成状态机",
    narration:
      "计划、执行、观察、重试都必须落成状态；重试没有新证据时，就应该升级给人。",
    claims: ["状态机能够约束重试并暴露失败原因。"],
  },
  {
    heading: "先看轨迹再改模型",
    narration:
      "Debug 时先检查路由输入、Worker 产出和工具回执，再决定是否调整提示词或模型。",
    claims: ["轨迹日志是定位多 Agent 故障的主要证据。"],
  },
];

export const draftScript = (topic: TopicBrief): ScriptDraft => {
  return {
    title: topic.topic,
    thesis: "可观测、可验收、可回滚，是多 Agent 工作流的底线。",
    sections: defaultSections.map((section, index) => ({
      ...section,
      id: `section-${index + 1}`,
    })),
    editorialStatus: "stub",
  };
};
