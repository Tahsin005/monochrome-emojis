"use client";

import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, ArrowRight, Search, Smile, Layers } from "lucide-react";
import { ICONS, COLORS, SIZES, DEFAULT_COLOR, DEFAULT_SIZE } from "@/lib/emoji-data";
import { LUCIDE_ICONS } from "@/lib/lucide-icons";
import ThemeToggle from "./theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type Mode = "emoji" | "lucide";

const EMOJI_NAMES  = Object.keys(ICONS);
const LUCIDE_NAMES = Object.keys(LUCIDE_ICONS);
const COLOR_NAMES  = Object.keys(COLORS);
const SIZE_NAMES   = Object.keys(SIZES) as (keyof typeof SIZES)[];
const PAGE_SIZE    = 60;

export default function EmojiExplorer() {
    const [mode, setMode]         = useState<Mode>("emoji");
    const [query, setQuery]       = useState("");
    const [page, setPage]         = useState(0);
    const [selected, setSelected] = useState(EMOJI_NAMES[0]);
    const [color, setColor]       = useState(DEFAULT_COLOR);
    const [size, setSize]         = useState(DEFAULT_SIZE);
    const [origin, setOrigin]     = useState("https://monochrome-emojis.vercel.app");
    const { resolvedTheme }       = useTheme();

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    // switch selected icon when toggling modes so preview never breaks
    useEffect(() => {
        if (mode === "emoji")  setSelected(EMOJI_NAMES[0]);
        if (mode === "lucide") setSelected(LUCIDE_NAMES[0]);
        setQuery("");
        setPage(0);
    }, [mode]);

    const iconNames = mode === "emoji" ? EMOJI_NAMES : LUCIDE_NAMES;
    const apiRoute  = mode === "emoji" ? "/emoji"    : "/lucid";

    const filtered = useMemo(
        () => iconNames.filter((n) => n.includes(query.trim().toLowerCase())),
        [query, iconNames]
    );

    // Reset page whenever query changes
    useEffect(() => { setPage(0); }, [query]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const pageIcons  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const params = new URLSearchParams();
    params.set(selected, color);
    if (size !== DEFAULT_SIZE) params.set("size", size);
    const path    = `${apiRoute}?${params.toString()}`;
    const fullUrl = `${origin}${path}`;
    const markdown = `![${selected}](${fullUrl})`;

    const accent = COLORS[color] ?? COLORS[DEFAULT_COLOR];

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
                        <span className="text-xs text-muted-foreground">{apiRoute}</span>
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

                {/* ---------- mode toggle + search ---------- */}
                <section className="mb-4">
                    {/* Toggle */}
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={() => setMode("emoji")}
                            className={cn(
                                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs border transition-colors duration-150",
                                mode === "emoji"
                                    ? "border-foreground text-foreground bg-foreground/8"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                            )}
                            style={mode === "emoji" ? { borderColor: accent, color: accent, backgroundColor: accent + "14" } : {}}
                        >
                            <Smile size={12} />
                            emoji
                        </button>
                        <button
                            onClick={() => setMode("lucide")}
                            className={cn(
                                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs border transition-colors duration-150",
                                mode === "lucide"
                                    ? "border-foreground text-foreground bg-foreground/8"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                            )}
                            style={mode === "lucide" ? { borderColor: accent, color: accent, backgroundColor: accent + "14" } : {}}
                        >
                            <Layers size={12} />
                            lucide icons
                            <span className="ml-1 text-[10px] opacity-60">{LUCIDE_NAMES.length}</span>
                        </button>
                    </div>

                    {/* Search */}
                    <label className="block text-xs tracking-[0.15em] mb-3 text-muted-foreground flex items-center gap-2">
                        Find an icon <Search size={13} />
                    </label>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={mode === "emoji" ? "search emoji icons…" : "search lucide icons…"}
                        className="font-mono"
                    />
                </section>

                {/* ---------- color + size (compact row above grid) ---------- */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6 py-3 px-4 rounded-lg border border-border bg-muted/30">
                    {/* Color */}
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground shrink-0">color</span>
                        <div className="flex flex-wrap gap-1.5">
                            {COLOR_NAMES.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    aria-label={c}
                                    title={c}
                                    className="w-5 h-5 rounded-full border transition-transform duration-150"
                                    style={{
                                        backgroundColor: COLORS[c],
                                        borderColor: c === color ? "var(--foreground)" : "var(--border)",
                                        transform: c === color ? "scale(1.2)" : "scale(1)",
                                        boxShadow: c === color ? `0 0 0 1px ${COLORS[c]}44` : undefined,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-px bg-border shrink-0" />
                    <div className="sm:hidden h-px bg-border" />

                    {/* Size */}
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground shrink-0">size</span>
                        <div className="flex flex-wrap gap-1.5">
                            {SIZE_NAMES.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className="px-2 py-0.5 rounded text-[11px] border transition-colors duration-150"
                                    style={{
                                        borderColor: s === size ? accent : "var(--border)",
                                        color: s === size ? accent : "var(--muted-foreground)",
                                        backgroundColor: s === size ? accent + "14" : "transparent",
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---------- icon grid ---------- */}
                <section className="mb-4">
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {filtered.length === 0 && (
                            <p className="col-span-full text-sm font-sans text-muted-foreground">
                                No icons match &quot;{query}&quot;.
                            </p>
                        )}
                        {pageIcons.map((name) => {
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
                                        src={`${apiRoute}?${name}=${color}`}
                                        alt={name}
                                        width={22}
                                        height={22}
                                    />
                                    <span className="text-[11px] text-muted-foreground leading-tight text-center px-1 break-all">
                                        {name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* ---------- pagination ---------- */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mb-12">
                        <span className="text-xs text-muted-foreground">
                            {filtered.length} icons &nbsp;·&nbsp; page {page + 1} / {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={14} />
                            </button>

                            {/* page number pills — show up to 5 around current */}
                            {Array.from({ length: totalPages }, (_, i) => i)
                                .filter((i) => Math.abs(i - page) <= 2)
                                .map((i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className="min-w-[28px] h-7 px-1.5 rounded border text-[11px] transition-colors"
                                        style={{
                                            borderColor: i === page ? accent : "var(--border)",
                                            color: i === page ? accent : "var(--muted-foreground)",
                                            backgroundColor: i === page ? accent + "14" : "transparent",
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))
                            }

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page === totalPages - 1}
                                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Next page"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}


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