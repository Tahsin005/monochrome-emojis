import CopyButton from "./copy-button";

export default function CodeBlock({ code }: { code: string }) {
    return (
        <div className="relative rounded-md border border-border bg-muted/50 px-4 py-3 my-3">
            <CopyButton text={code} />
            <pre className="text-sm text-foreground overflow-x-auto pr-14 font-mono">
                <code>{code}</code>
            </pre>
        </div>
    );
}