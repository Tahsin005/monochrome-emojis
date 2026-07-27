"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors duration-200"
        aria-label="Toggle theme"
      >
        {mounted ? (
          isDark ? <Moon size={14} /> : <Sun size={14} />
        ) : (
          <Sun size={14} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex gap-1 p-1 w-auto">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-center w-8 h-8 p-0"
          aria-label="Light"
        >
          <Sun size={13} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-center w-8 h-8 p-0"
          aria-label="Dark"
        >
          <Moon size={13} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-center w-8 h-8 p-0"
          aria-label="System"
        >
          <Monitor size={13} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}