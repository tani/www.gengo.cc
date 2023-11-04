import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

const fetchFonts = async () => {
  // Regular Font
  const fontFileRegular = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf"
  );
  const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();

  // Bold Font
  const fontFileBold = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Bold.ttf"
  );
  const fontBold: ArrayBuffer = await fontFileBold.arrayBuffer();

  const jaFontFileRegular = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/bizudgothic/BIZUDGothic-Regular.ttf"
  );
  const jaFontRegular: ArrayBuffer = await jaFontFileRegular.arrayBuffer();

  const jaFontFileBold = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/bizudgothic/BIZUDGothic-Bold.ttf"
  );
  const jaFontBold: ArrayBuffer = await jaFontFileBold.arrayBuffer();

  return { fontRegular, fontBold, jaFontRegular, jaFontBold };
};

const { fontRegular, fontBold, jaFontRegular, jaFontBold } = await fetchFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "BIZ UDGothic",
      data: jaFontRegular,
      weight: 400,
      style: "normal",
      lang: "ja-JP",
    },
    {
      name: "BIZ UDGothic",
      data: jaFontBold,
      weight: 600,
      style: "normal",
      lang: "ja-JP",
    },
    {
      name: "IBM Plex Mono",
      data: fontRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: fontBold,
      weight: 600,
      style: "normal",
    },
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
