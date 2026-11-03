import type {TopicBrief} from "./types";

export interface SelectTopicInput {
  id: string;
  topic: string;
  angle?: string;
}

export const selectTopic = ({
  id,
  topic,
  angle = "用可观测的工作流解释 Super-agent 的调度、执行与失败恢复",
}: SelectTopicInput): TopicBrief => {
  return {
    id,
    topic,
    angle,
    audience: "正在搭建多 Agent 工作流、需要 Debug 的开发者",
    durationTargetSec: {
      min: 300,
      max: 480,
    },
    exclusions: [
      "不做产品壳",
      "不做带货",
      "不接入 Seedance 或可灵",
      "不使用外部 BGM 作为叙事主体",
    ],
  };
};
