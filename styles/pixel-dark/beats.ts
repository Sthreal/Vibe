export type Layout =
  | "point"
  | "org"
  | "model"
  | "duo"
  | "flow"
  | "loop"
  | "chart"
  | "browser"
  | "handoff"
  | "meter"
  | "bubbles"
  | "cast"
  | "banner"
  | "windows";

export type Beat = {
  layout: Layout;
  kicker: string;
  title: string;
  chips: string[];
  tone?: "ok" | "bad" | "ask";
};

/**
 * One illustrated cut per spoken line in episodes/router-worker.ep1.json.
 * Index 0 is the first caption.
 */
export const BEATS: Beat[] = [
  {layout: "point", kicker: "拆开", title: "先看任务怎么拆", chips: ["目标", "步骤", "收尾"], tone: "ask"},
  {layout: "meter", kicker: "收尾", title: "没人负责收尾", chips: ["模型很聪明", "没人收场"], tone: "bad"},
  {layout: "bubbles", kicker: "先问", title: "加角色之前", chips: ["下一步谁选的", "失败谁收的"], tone: "ask"},
  {layout: "cast", kicker: "本集", title: "只讲三件事", chips: ["Router 调度", "Worker 交证据", "失败要停"]},
  {layout: "model", kicker: "模型", title: "不是更大的模型", chips: ["会调度", "会停止", "会留证据"]},
  {layout: "org", kicker: "公司", title: "一个入口", chips: ["选择", "交付", "证据", "停止", "预算", "回执"]},
  {layout: "flow", kicker: "职责", title: "名字可以换", chips: ["编排器", "负责选择", "负责交付"]},
  {layout: "point", kicker: "顺序", title: "先把角色写窄", chips: ["角色", "记忆", "工具"], tone: "bad"},
  {layout: "duo", kicker: "误区", title: "路由不是大脑", chips: ["大脑", "只做选择"], tone: "bad"},
  {layout: "handoff", kicker: "证据", title: "不是手脚", chips: ["Worker", "可核对证据", "Router"]},
  {layout: "windows", kicker: "失控", title: "不要写成万能助手", chips: ["选择", "执行", "收尾", "复盘"], tone: "bad"},
  {layout: "banner", kicker: "状态", title: "读当前状态", chips: ["目标", "已完成", "缺证据", "剩余预算"]},
  {layout: "handoff", kicker: "输出", title: "只输出一个动作", chips: ["Router", "调用或停止", "Worker"]},
  {layout: "point", kicker: "理由", title: "每次选择留下理由", chips: ["是谁", "为什么", "为什么是现在"]},
  {layout: "duo", kicker: "边界", title: "不碰工具", chips: ["碰工具", "只决定谁来做"], tone: "bad"},
  {layout: "point", kicker: "上下文", title: "只看受限上下文", chips: ["用得到的", "其余不给", "原文不进"]},
  {layout: "flow", kicker: "窄事", title: "一件窄事", chips: ["检索", "改文件", "跑测试"]},
  {layout: "handoff", kicker: "验收", title: "结果必须可验收", chips: ["Worker", "行号和退出码", "Router"]},
  {layout: "point", kicker: "空话", title: "已经处理好了", chips: ["没有依据", "不能前进", "停在这里"], tone: "bad"},
  {layout: "cast", kicker: "工具", title: "工具不是 Worker", chips: ["读文件", "跑命令", "查网页"]},
  {layout: "handoff", kicker: "字段", title: "整理成契约字段", chips: ["工具", "回执字段", "Worker"]},
  {layout: "flow", kicker: "回执", title: "失败也是回执", chips: ["超时", "没权限", "输出为空"], tone: "bad"},
  {layout: "duo", kicker: "边界", title: "不直接调用工具", chips: ["Router 不调用", "Worker 来调用"]},
  {layout: "handoff", kicker: "契约", title: "事先写明", chips: ["输入契约", "输出契约", "失败码"]},
  {layout: "meter", kicker: "停", title: "缺一个字段就停", chips: ["缺字段", "不要自己补"], tone: "bad"},
  {layout: "duo", kicker: "结构", title: "成败同一种结构", chips: ["成功", "失败也是结果"]},
  {layout: "flow", kicker: "对账", title: "日志可以对账", chips: ["发出去", "收回来", "对得上"]},
  {layout: "duo", kicker: "边界", title: "不写最终答案", chips: ["又选又做", "只负责选择"], tone: "bad"},
  {layout: "point", kicker: "摘要", title: "不读原始输出", chips: ["摘要", "状态", "原文留给 Worker"]},
  {layout: "banner", kicker: "可见", title: "失败不能藏起来", chips: ["错误留在输入", "避免重选", "下一轮看得见"]},
  {layout: "banner", kicker: "停止", title: "必须允许停下", chips: ["不必硬答", "可以停", "人来收"]},
  {layout: "loop", kicker: "状态机", title: "一轮写成状态机", chips: ["计划", "执行", "观察", "决策"]},
  {layout: "flow", kicker: "计划", title: "只产生下一步", chips: ["想下一步", "先不改世界", "再交给执行"]},
  {layout: "loop", kicker: "观察", title: "读取回执", chips: ["文件", "测试", "状态", "前进"]},
  {layout: "meter", kicker: "停", title: "没有前进就停下", chips: ["记下原因", "重试或停止"], tone: "bad"},
  {layout: "chart", kicker: "实测", title: "重试在消耗预算", chips: ["同一份报错", "再跑也不会好"], tone: "bad"},
  {layout: "flow", kicker: "预算", title: "每一轮写上预算", chips: ["重试次数", "工具调用", "墙钟时间"]},
  {layout: "meter", kicker: "终态", title: "预算耗尽即失败", chips: ["失败终态", "不再要乐观的话"], tone: "bad"},
  {layout: "point", kicker: "封顶", title: "变成可解释的停止", chips: ["无限循环", "一次停止", "说得清"]},
  {layout: "cast", kicker: "升级", title: "三类情况交给人", chips: ["不确定", "没权限", "证据矛盾"]},
  {layout: "handoff", kicker: "上下文", title: "升级要带上上下文", chips: ["目标路径错误", "请人决定", "写回"]},
  {layout: "flow", kicker: "写回", title: "决定写回状态", chips: ["人做决定", "写入状态", "Router 看见"]},
  {layout: "duo", kicker: "升级", title: "升级不是失败", chips: ["继续采样", "该停就停"], tone: "bad"},
  {layout: "point", kicker: "轨迹", title: "先看轨迹", chips: ["路由输入", "Worker 产出", "工具回执"]},
  {layout: "flow", kicker: "三线", title: "顺着三条线读", chips: ["当时输入", "交回产出", "工具回执"]},
  {layout: "duo", kicker: "断点", title: "修法完全不同", chips: ["缺了字段", "工具超时"], tone: "bad"},
  {layout: "point", kicker: "契约", title: "结果无法验证", chips: ["没按契约", "没有证据", "不能过"], tone: "bad"},
  {layout: "banner", kicker: "案例", title: "修复失败的测试", chips: ["测试是红的", "派给 Worker", "去改代码"]},
  {layout: "meter", kicker: "案例", title: "状态没有前进", chips: ["文件改了", "测试仍是红"], tone: "bad"},
  {layout: "point", kicker: "升级", title: "同一份报错", chips: ["不要碰运气", "升级给人", "留下轨迹"], tone: "bad"},
  {layout: "handoff", kicker: "新证据", title: "新证据才能再派", chips: ["人改断言", "写回状态", "Router"]},
  {layout: "flow", kicker: "回滚", title: "自动执行要能撤回", chips: ["改过的文件", "发出的请求", "回到上一步"]},
  {layout: "duo", kicker: "权限", title: "没有回滚点不给写", chips: ["只读可以大胆", "写入必须小步"]},
  {layout: "point", kicker: "检查点", title: "写入对应检查点", chips: ["可撤销", "小步提交", "否则别连续"]},
  {layout: "cast", kicker: "三件", title: "缺一就不算数", chips: ["可追溯", "可验收", "可回滚"]},
  {layout: "browser", kicker: "落地", title: "先写一张 Worker 表", chips: ["有哪些 Worker", "输入和输出", "失败码"]},
  {layout: "loop", kicker: "状态机", title: "哪些边允许重试", chips: ["重试", "升级", "停止", "继续"]},
  {layout: "meter", kicker: "只读", title: "没有检查点先只读", chips: ["写操作", "先补检查点"], tone: "ask"},
  {layout: "flow", kicker: "最后", title: "最后才接模型", chips: ["先写表", "再写状态机", "后接模型"]},
  {layout: "duo", kicker: "收束", title: "不要先加 Agent", chips: ["先加 Agent", "先写契约"], tone: "bad"},
  {layout: "flow", kicker: "三样", title: "慢的时候先补这三样", chips: ["加上预算", "留下轨迹", "留下回滚点"]},
  {layout: "cast", kicker: "才算", title: "三件齐了才算", chips: ["解释选择", "核对证据", "安全停下"]},
  {layout: "flow", kicker: "流水线", title: "可以被检查和叫停", chips: ["路由", "交付", "叫停"]},
];
