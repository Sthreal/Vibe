import type {StoryboardDraft, TtsManifest} from "./types";

export interface TtsOptions {
  voice?: string;
}

/**
 * TTS 占位：只输出字幕驱动的配音时间表，不生成音频文件。
 * 接入具体 TTS 时保持 CaptionCue.from/durationInFrames 为唯一时间源。
 */
export const createTtsManifest = (
  storyboard: StoryboardDraft,
  {voice = "zh-CN-female-debug"}: TtsOptions = {},
): TtsManifest => {
  return {
    engine: "stub",
    voice,
    status: "not-generated",
    segments: storyboard.captions.map((caption, index) => ({
      id: `tts-${index + 1}`,
      from: caption.from,
      durationInFrames: caption.durationInFrames,
      text: caption.text,
    })),
    bgm: "disabled",
    note: "字幕与 TTS 共用同一组时间轴；真实音频生成接口待接入。",
  };
};
