import {useEffect, useState} from "react";
import {continueRender, delayRender, staticFile} from "remotion";

export const PIXEL_FONT = "VibePixel";

const HANS = staticFile("fonts/fusion-pixel-12px-zh_hans.woff2");
const LATIN = staticFile("fonts/fusion-pixel-12px-latin.woff2");

/**
 * Fusion Pixel 12px (OFL). Integer font sizes (24/36/48) keep the bitmap crisp.
 */
export const usePixelFont = () => {
  const [handle] = useState(() => delayRender("VibePixel"));

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      continueRender(handle);
    };

    const hans = new FontFace(PIXEL_FONT, `url(${HANS})`);
    const latin = new FontFace(PIXEL_FONT, `url(${LATIN})`, {
      unicodeRange: "U+0000-00FF",
    });

    Promise.all([hans.load(), latin.load()])
      .then((faces) => {
        for (const face of faces) {
          document.fonts.add(face);
        }
        finish();
      })
      .catch(() => finish());

    return () => finish();
  }, [handle]);
};
