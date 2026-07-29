import { NextRequest } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { COLORS, DEFAULT_COLOR, SIZES, DEFAULT_SIZE } from "@/lib/emoji-data";

const ICONS_DIR = path.join(process.cwd(), "node_modules/lucide-static/icons");

const DEFAULT_LUCID = {
    viewBox: "0 0 24 24",
    content: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
};

const cache = new Map<string, { viewBox: string; content: string }>();

function getLucideIcon(name: string) {
    if (cache.has(name)) return cache.get(name)!;

    const filePath = path.join(ICONS_DIR, `${name}.svg`);
    if (!existsSync(filePath)) return null;

    const raw = readFileSync(filePath, "utf-8")
        .replace(/<!--[\s\S]*?-->/g, "") // strip license comment(s) first
        .trim();

    const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 24 24";
    const content = raw
        .replace(/^<svg[^>]*>/, "")
        .replace(/<\/svg>\s*$/, "")
        .trim()
        .replace(/\sstroke="[^"]*"/g, "")
        .replace(/\sfill="[^"]*"/g, "");

    const parsed = { viewBox, content };
    cache.set(name, parsed);
    return parsed;
}

function buildSvg(pxSize: number, viewBox: string, content: string, hex: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${pxSize}" height="${pxSize}" viewBox="${viewBox}" fill="none" stroke="${hex}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const sizeKey = searchParams.get("size") ?? DEFAULT_SIZE;
    const pxSize = SIZES[sizeKey] ?? SIZES[DEFAULT_SIZE];

    let rawName: string | null = null;
    let colorParam: string | null = null;

    for (const [key, value] of searchParams.entries()) {
        if (key === "size") continue;
        rawName = key.toLowerCase();
        colorParam = value.toLowerCase();
        break;
    }

    // whitelist: lowercase letters, digits, hyphens only — blocks path traversal
    const name = rawName && /^[a-z0-9-]+$/.test(rawName) ? rawName : null;

    const icon = (name && getLucideIcon(name)) || DEFAULT_LUCID;
    const hex = (colorParam && COLORS[colorParam]) || COLORS[DEFAULT_COLOR];

    const svg = buildSvg(pxSize, icon.viewBox, icon.content, hex);

    return new Response(svg, {
        status: 200,
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400, immutable",
        },
    });
}