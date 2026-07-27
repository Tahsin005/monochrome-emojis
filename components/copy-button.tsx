"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    function copy() {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
    }

    return (
        <Button
            onClick={copy}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
        >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "copied" : "copy"}
        </Button>
    );
}