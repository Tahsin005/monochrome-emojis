import Link from "next/link";
import CodeBlock from "@/components/code-block";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Contribute - monochrome-emojis",
    description: "How to add a new icon to monochrome-emojis and open a PR.",
};

const steps = [
    {
        n: "01",
        title: "Fork and clone",
        body: "Fork the repo on GitHub, then clone your fork locally.",
        code: `git clone https://github.com/<your-username>/monochrome-emojis.git\ncd monochrome-emojis\nnpm install`,
    },
    {
        n: "02",
        title: "Find your icon's path data",
        body: "Grab a single-color SVG for the brand/icon you want to add — Simple Icons (simpleicons.org) is the easiest source since every icon there is already a flat, monochrome path.",
    },
    {
        n: "03",
        title: "Register it in lib/emoji-data.ts",
        body: "Add a new entry to the ICONS map. The key is the name used in the URL (e.g. ?slack=blue), so keep it lowercase, no spaces - match the brand's common slug.",
        code: `export const ICONS: Record<string, IconDef> = {\n  github: { ... },\n  discord: { ... },\n  slack: {\n    viewBox: "0 0 24 24",\n    paths: [\n      "M5.04 15.16a2.52 2.52 0 1 1 0-5.04h2.52v2.52a2.52 2.52 0 0 1-2.52 2.52Zm...",\n    ],\n  },\n};`,
    },
    {
        n: "04",
        title: "Follow the path rules",
        body: 'Keep paths as raw <path d="..."> data only - no fill, stroke, or style attributes inside them. Color is injected globally via the fill on the outer <svg>, so a hardcoded fill on a path will silently override it. Use a square viewBox (e.g. 0 0 24 24) so sizing stays consistent across icons.',
    },
    {
        n: "05",
        title: "Test it locally",
        body: "Run the dev server and check your icon two ways: search for it on the homepage picker, and hit the raw route directly.",
        code: `npm run dev\n\n# then visit:\nhttp://localhost:3000/            # search "slack" in the picker\nhttp://localhost:3000/emoji?slack=blue&size=lg`,
    },
    {
        n: "06",
        title: "Open a pull request",
        body: "Commit with a conventional message, push to your fork, and open a PR against main. One icon per PR keeps reviews fast.",
        code: `git checkout -b add-slack-icon\ngit add lib/emoji-data.ts\ngit commit -m "feat: add slack icon"\ngit push origin add-slack-icon`,
    },
];

export default function ContributePage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-mono">
            <div className="mx-auto max-w-2xl px-6 py-16">
                <Link
                    href="/"
                    className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={13} /> back
                </Link>

                <header className="mt-8 mb-14">
                    <p className="text-xs tracking-[0.2em] text-muted-foreground mb-3">
                        Contributing
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight mb-4 font-sans">
                        Add an icon
                    </h1>
                    <p className="text-muted-foreground font-sans leading-relaxed">
                        Every icon lives as one entry in a single file. No build config,
                        no asset pipeline - add the entry, test it, open a PR.
                    </p>
                </header>

                <ol className="space-y-10">
                    {steps.map((s) => (
                        <li key={s.n} className="border-l border-border pl-6 relative">
                            <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] text-muted-foreground">
                                {s.n}
                            </span>
                            <h2 className="text-base font-semibold mb-2 font-sans text-foreground">
                                {s.title}
                            </h2>
                            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                                {s.body}
                            </p>
                            {s.code && <CodeBlock code={s.code} />}
                        </li>
                    ))}
                </ol>

                <Separator className="mt-16" />
                <footer className="pt-6 text-xs text-muted-foreground font-sans">
                    Questions or unsure an icon fits? Open an issue first -{" "}
                    <a
                        href="https://github.com/Tahsin005/monochrome-emojis/issues"
                        className="text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                        github.com/Tahsin005/monochrome-emojis/issues
                    </a>
                </footer>
            </div>
        </div>
    );
}