import type {Episode} from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

/**
 * Remotion merges defaultProps with --props before calculateMetadata.
 * The episode JSON is the flat document, so a second episode arrives as
 * `{episode: mock, ...ep1}`. Prefer that flat document when it is present.
 */
const isFlatEpisode = (value: unknown): value is Episode => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaVersion === 1 &&
    typeof value.id === "string" &&
    Array.isArray(value.scenes) &&
    Array.isArray(value.captions)
  );
};

export const resolveEpisode = (props: unknown): Episode => {
  if (isFlatEpisode(props)) {
    const {episode: _nested, ...episode} = props as Episode & {
      episode?: Episode;
    };
    return episode;
  }

  if (isRecord(props) && isFlatEpisode(props.episode)) {
    return props.episode;
  }

  throw new Error("[episode] 无法从 props 解析 episode");
};
