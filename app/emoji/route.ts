import { NextRequest } from "next/server";
import {
  ICONS,
  DEFAULT_ICON,
  COLORS,
  DEFAULT_COLOR,
  SIZES,
  DEFAULT_SIZE,
} from "@/lib/emoji-data";

function buildSvg(pxSize: number, viewBox: string, paths: string[], hex: string) {
  const body = paths.map((d) => `<path d="${d}" />`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pxSize}" height="${pxSize}" viewBox="${viewBox}" fill="${hex}">${body}</svg>`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // size param, e.g. ?size=lg
  const sizeKey = searchParams.get("size") ?? DEFAULT_SIZE;
  const pxSize = SIZES[sizeKey] ?? SIZES[DEFAULT_SIZE];

  // find the first non-"size" param -> that's the icon=color pair
  // e.g. ?github=yellow -> name="github", color="yellow"
  let name: string | null = null;
  let colorParam: string | null = null;

  for (const [key, value] of searchParams.entries()) {
    if (key === "size") continue;
    name = key.toLowerCase();
    colorParam = value.toLowerCase();
    break; // only take the first icon param
  }

  const iconDef = (name && ICONS[name]) || DEFAULT_ICON;
  const hex = (colorParam && COLORS[colorParam]) || COLORS[DEFAULT_COLOR];

  const svg = buildSvg(pxSize, iconDef.viewBox, iconDef.paths, hex);

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      // cache aggressively since output is deterministic per URL — tune as you like
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
