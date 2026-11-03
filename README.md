# Vibe

Vibe 是一个**Remotion 工作流优先**的 Super-agent 技术短视频项目。它只负责把选题、文稿、事实检查、分镜时间轴、TTS、Remotion 合成、预览检查与导出串成可替换的管线，不包含产品壳、带货流程，也不接入 Seedance 或可灵。

首集压测主题是 **Router/Worker Super-agent**。首版使用 `pixel-dark` 风格，Composition 为竖屏 `1080×1920`、30fps，使用 EdgeTTS 真实口播驱动 mock 时长，用来验证字幕、口播时间轴和视觉节奏；正式成片的目标时长是 5–8 分钟。

## 快速开始

环境要求：Node.js 20 或更高版本。

```bash
npm install
npm run studio
```

打开 Remotion Studio 后选择 `VibeEpisode`。Studio 默认加载仓库内的 mock episode。

直接使用 mock props 打开预览：

```bash
npm run preview:mock
```

试听或检查当前真实口播版本时也使用该命令。mock 默认引用整轨 `public/voiceover/router-worker.mp3`。

渲染 mock 成片：

```bash
npm run render:mock
```

输出位置为 `out/vibe-router-worker.mp4`。首次渲染时 Remotion 可能下载浏览器；此过程与项目本身的后端无关。

## EdgeTTS 真实口播

mock 口播使用 EdgeTTS 的 `zh-CN-YunyangNeural` 声线，无需 API Key。项目依赖系统提供 `ffmpeg` 与 `ffprobe`；EdgeTTS CLI 安装在本地 Python venv 中：

```bash
python3 -m venv .venv
.venv/bin/pip install edge-tts
npm run tts:mock
npm run preview:mock
```

`npm run tts:mock` 会逐句生成 `public/voiceover/router-worker/01.mp3` 至 `08.mp3`，用 `ffprobe` 探测每条时长，按 30fps 重排 caption 与 scene 时间轴，并写入 `episodes/router-worker.mock.json`。最后通过 ffmpeg concat 生成 Studio 实际引用的整轨 `public/voiceover/router-worker.mp3`。网络偶发失败时，每条句子在首次失败后最多重试 3 次。

`.venv/` 已被 Git 忽略，不应提交。EdgeTTS 命令只按固定声线合成；管线不调用 `--list-voices`。

## 风格包

`styles/` 中提供三套视觉包：

| Theme ID | 视觉方向 | 首集状态 |
| --- | --- | --- |
| `pixel-dark` | 深色终端、像素网格、轨迹面板 | 首集压测 |
| `vector-minimal` | 明亮留白、几何卡片、矢量关系 | 可用 |
| `history-flat` | 纸张纹理、印章、案卷式排版 | 可用 |

字幕与 TTS 共用一个 `captions` 时间轴，由 `styles/shared/NarrationLayer.tsx` 统一渲染。切换风格只需要改 episode JSON 中的 `themeId`；`styles/index.ts` 会同时切换 theme token 与场景视觉组件，而底栏橙高亮字幕保持不变。

首集 mock 位于：

```text
episodes/router-worker.mock.json
```

## 管线步骤

`pipeline/` 里每一步都是可替换的 TypeScript 模块。管线主体仍使用文稿与 TTS stub 来演示完整流程；`npm run tts:mock` 则单独生成 mock 的真实口播与时间轴。

```text
选题 → 文稿 → 事实闸 → 分镜+字幕时间轴 → TTS → Remotion 合成 → 预览闸 → 导出
```

| 文件 | 职责 |
| --- | --- |
| `pipeline/01-topic.ts` | 选择主题、角度、受众和时长目标 |
| `pipeline/02-script.ts` | 生成文稿与 claim 列表 |
| `pipeline/03-fact-gate.ts` | 调用事实闸 |
| `pipeline/04-storyboard.ts` | 生成 scene、字幕和帧级时间轴 |
| `pipeline/05-tts.ts` | 管线中的 TTS manifest stub |
| `pipeline/06-render.ts` | 生成 Remotion 渲染计划 |
| `pipeline/07-preview-gate.ts` | 调用预览闸 |
| `pipeline/08-export.ts` | 汇总闸口结果和导出 manifest |

运行整条 mock 管线：

```bash
npm run pipeline:mock
```

生成 mock 真实口播并回写时间轴：

```bash
npm run tts:mock
```

## 闸口 stub

事实闸位于 `pipeline/gates/fact-gate.stub.ts`，预览闸位于 `pipeline/gates/preview-gate.stub.ts`。两者当前都返回 `pass: true` 和可读的 `notes`，不会声称已经完成真实事实核验或自动视频质检。

事实闸直接用法：

```ts
import {runFactGateStub} from "./pipeline/gates/fact-gate.stub";

const factResult = runFactGateStub({
  claims: [
    "Router 负责选择下一步。",
    "Worker 需要交回可验证证据。",
  ],
});

// {gate: "facts", pass: true, notes: [...]}
```

预览闸直接用法：

```ts
import {runPreviewGateStub} from "./pipeline/gates/preview-gate.stub";

const previewResult = runPreviewGateStub({
  compositionId: "VibeEpisode",
  durationInFrames: 1350,
  captionCount: 8,
});

// {gate: "preview", pass: true, notes: [...]}
```

接入真实能力时，建议保持返回结构不变，只替换检索、关键帧抽检、静音检测、字幕越界检测等实现。发布前仍必须人工完整观看一次。

## 目录骨架

```text
Vibe/
├── episodes/
│   └── router-worker.mock.json
├── pipeline/
│   ├── gates/
│   │   ├── fact-gate.stub.ts
│   │   └── preview-gate.stub.ts
│   ├── 01-topic.ts
│   ├── 02-script.ts
│   ├── 03-fact-gate.ts
│   ├── 04-storyboard.ts
│   ├── 05-tts.ts
│   ├── 06-render.ts
│   ├── 07-preview-gate.ts
│   ├── 08-export.ts
│   ├── run-mock.ts
│   └── types.ts
├── src/
│   ├── Episode.tsx
│   ├── Root.tsx
│   ├── index.ts
│   ├── types.ts
│   └── validate-episode.ts
├── styles/
│   ├── shared/
│   │   ├── NarrationLayer.tsx
│   │   └── OrangeCaption.tsx
│   ├── pixel-dark/index.tsx
│   ├── vector-minimal/index.tsx
│   ├── history-flat/index.tsx
│   ├── index.ts
│   └── types.ts
├── package.json
├── remotion.config.ts
├── tsconfig.json
└── README.md
```

## 音频约束

- TTS 只作为时间轴驱动的配音轨，字幕文本就是口播文本。
- mock 默认 `bgm.enabled: false`。
- 若未来启用 BGM，数据模型默认 `volumeDb: -26`，保持极弱，并在预览闸中增加人声/BGM 电平检查。
- `pipeline/05-tts.ts` 仍是不生成文件的管线 stub；mock 的真实口播由 `pipeline/tts/generate-edge.ts` 生成。
- mock 的 `voiceover.audioSrc` 指向 `public/voiceover/router-worker.mp3`，Studio 只加载这条整轨。
- 逐句音频保存在 `public/voiceover/router-worker/`，用于时长探测与整轨拼接。

## 常用校验

```bash
npm run typecheck
npm run pipeline:mock
npm run check
```

`validate-episode.ts` 会检查 schema 版本、主题 ID、场景时长，以及 scene 总帧数与 `durationSec × fps` 是否一致。
