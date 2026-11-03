import mockEpisodeJson from "../episodes/router-worker.mock.json";
import type {Episode} from "../src/types";
import {validateEpisode} from "../src/validate-episode";
import {selectTopic} from "./01-topic";
import {draftScript} from "./02-script";
import {applyFactGate} from "./03-fact-gate";
import {buildStoryboard} from "./04-storyboard";
import {createTtsManifest} from "./05-tts";
import {createRenderPlan} from "./06-render";
import {applyPreviewGate} from "./07-preview-gate";
import {createExportManifest} from "./08-export";

const episode = mockEpisodeJson as unknown as Episode;
validateEpisode(episode);

const topic = selectTopic({
  id: "router-worker-super-agent-001",
  topic: episode.topic,
});
const script = draftScript(topic);
const factGate = applyFactGate(script);
const storyboard = buildStoryboard(script, {
  fps: 30,
  durationSec: 45,
  themeId: "pixel-dark",
});
const tts = createTtsManifest(storyboard);
const renderPlan = createRenderPlan(episode, {
  propsPath: "episodes/router-worker.mock.json",
});
const previewGate = applyPreviewGate(storyboard);
const exportManifest = createExportManifest({
  episodeId: episode.id,
  renderPlan,
  gates: [factGate.result, previewGate],
});

console.log(
  JSON.stringify(
    {
      mockEpisode: {
        id: episode.id,
        themeId: episode.themeId,
        durationSec: episode.durationSec,
        scenes: episode.scenes.length,
        captions: episode.captions.length,
      },
      pipeline: {
        topic: topic.topic,
        scriptStatus: script.editorialStatus,
        facts: factGate.result,
        storyboardFrames: storyboard.durationInFrames,
        tts,
        renderPlan,
        preview: previewGate,
        exportManifest,
      },
    },
    null,
    2,
  ),
);
