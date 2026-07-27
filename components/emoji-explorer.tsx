"use client";

import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ICONS, COLORS, SIZES, DEFAULT_COLOR, DEFAULT_SIZE } from "@/lib/emoji-data";
import ThemeToggle from "./theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ArrowRight, Search } from "lucide-react";

const ICON_NAMES = Object.keys(ICONS);
const COLOR_NAMES = Object.keys(COLORS);
const SIZE_NAMES = Object.keys(SIZES) as (keyof typeof SIZES)[];

export default function EmojiExplorer() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(ICON_NAMES[0]);
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [size, setSize] = useState(DEFAULT_SIZE);
    const [origin, setOrigin] = useState("https://monochrome-emojis.vercel.app");
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const filtered = useMemo(
        () => ICON_NAMES.filter((n) => n.includes(query.trim().toLowerCase())),
        [query]
    );

    const params = new URLSearchParams();
    params.set(selected, color);
    if (size !== DEFAULT_SIZE) params.set("size", size);
    const path = `/emoji?${params.toString()}`;
    const fullUrl = `${origin}${path}`;
    const markdown = `![${selected}](${fullUrl})`;

    const accent = COLORS[color] ?? COLORS[DEFAULT_COLOR];
    const copyBtnTextColor = resolvedTheme === "dark" ? "#EDEDEE" : "#0A0A0B";

    function copy() {
        navigator.clipboard.writeText(markdown);
        toast.success("Markdown copied!", {
            style: {
                background: "var(--card)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
            },
            iconTheme: {
                primary: accent,
                secondary: "var(--background)",
            },
        });
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-mono">
            <div className="mx-auto max-w-3xl px-6 py-16">
                {/* ---------- header ---------- */}
                <header className="mb-14">
                    <div className="flex items-start justify-between mb-3">
                        <p className="text-xs tracking-[0.2em] text-muted-foreground">
                            svg icon service
                        </p>
                        <ThemeToggle />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 font-sans">
                        monochrome-emojis
                    </h1>
                    <p className="font-sans leading-relaxed max-w-xl text-muted-foreground">
                        One flat-color SVG per request, sized and colored by the query string —
                        built for dropping icons straight into a GitHub{" "}
                        <code className="text-foreground font-mono">README.md</code>. No build step, no asset
                        folder. Just a URL.
                    </p>
                </header>

                {/* ---------- live request line ---------- */}
                <section
                    className="rounded-lg border mb-4 overflow-hidden transition-colors duration-300"
                    style={{ borderColor: accent + "55" }}
                >
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
                        <span className="text-xs text-muted-foreground">GET</span>
                        <span className="text-xs text-muted-foreground">/emoji</span>
                    </div>
                    <div className="flex items-center gap-4 px-4 py-5 bg-muted/30">
                        <img
                            src={path}
                            alt={selected}
                            width={48}
                            height={48}
                            className="shrink-0"
                            style={{ imageRendering: "auto" }}
                        />
                        <code className="text-sm sm:text-base break-all text-foreground font-mono">
                            {fullUrl}
                        </code>
                    </div>
                </section>

                <Button
                    onClick={copy}
                    className="w-full sm:w-auto mb-14 font-medium"
                >
                    copy markdown
                </Button>

                {/* ---------- search ---------- */}
                <section className="mb-8">
                    <label className="block text-xs tracking-[0.15em] mb-3 text-muted-foreground flex items-center gap-2">
                        Find an icon <Search size={13} />
                    </label>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="search icons…"
                        className="font-mono"
                    />
                </section>

                {/* ---------- icon grid ---------- */}
                <section className="mb-12">
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {filtered.length === 0 && (
                            <p className="col-span-full text-sm font-sans text-muted-foreground">
                                No icons match &quot;{query}&quot;.
                            </p>
                        )}
                        {filtered.map((name) => {
                            const isActive = name === selected;
                            return (
                                <button
                                    key={name}
                                    onClick={() => setSelected(name)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 rounded-md border py-4 transition-colors duration-150",
                                        isActive
                                            ? "bg-muted"
                                            : "bg-transparent hover:bg-muted/40"
                                    )}
                                    style={{
                                        borderColor: isActive ? accent : undefined,
                                    }}
                                >
                                    <img
                                        src={`/emoji?${name}=${color}`}
                                        alt={name}
                                        width={22}
                                        height={22}
                                    />
                                    <span className="text-[11px] text-muted-foreground">
                                        {name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* ---------- color picker ---------- */}
                <section className="mb-10">
                    <label className="block text-xs tracking-[0.15em] uppercase mb-3 text-muted-foreground">
                        color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COLOR_NAMES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                aria-label={c}
                                className="w-9 h-9 rounded-full border-2 transition-transform duration-150"
                                style={{
                                    backgroundColor: COLORS[c],
                                    borderColor: c === color ? "var(--foreground)" : "var(--border)",
                                    transform: c === color ? "scale(1.08)" : "scale(1)",
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* ---------- size picker ---------- */}
                <section className="mb-6">
                    <label className="block text-xs tracking-[0.15em] uppercase mb-3 text-muted-foreground">
                        size
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {SIZE_NAMES.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className="px-3.5 py-1.5 rounded-md text-xs border transition-colors duration-150"
                                style={{
                                    borderColor: s === size ? accent : "var(--border)",
                                    color: s === size ? accent : "var(--muted-foreground)",
                                    backgroundColor: s === size ? accent + "14" : "transparent",
                                }}
                            >
                                {s} · {SIZES[s]}px
                            </button>
                        ))}
                    </div>
                </section>

                <footer className="mt-16 pt-6 border-t border-border text-xs font-sans flex items-center justify-between text-muted-foreground">
                    <span>Unknown icon names return a default fallback SVG — embeds never break.</span>
                    <a
                        href="/contribute"
                        className="underline flex items-center gap-1 shrink-0 ml-4 hover:text-foreground transition-colors"
                    >
                        contribute an icon <ArrowRight size={13} />
                    </a>
                </footer>
            </div>
        </div>
    );
}