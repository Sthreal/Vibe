import {createContext} from "react";
import type {CaptionCue} from "../../src/types";

/** Active episode captions, so the stage can cut on each spoken line. */
export const EpisodeClockContext = createContext<CaptionCue[]>([]);
