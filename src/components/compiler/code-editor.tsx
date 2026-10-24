"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { EditorView } from "@codemirror/view";
import { useTheme } from "next-themes";
import { Maximize2, Minimize2, Copy, Check, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
  onRun?: () => void;
  onReset?: () => void;
  storageKey?: string;
  className?: string;
}

// CampusLoop Light & Dark Themes for CodeMirror 6
const campusLoopLightTheme = EditorView.theme(
  {
    "&": {
      color: "#221E1B",
      backgroundColor: "#FFFFFF",
      fontSize: "13.5px",
      lineHeight: "1.65",
      fontFamily: "var(--font-mono-custom, monospace)",
    },
    ".cm-content": {
      caretColor: "#BD4B2A",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#BD4B2A",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#FEC7BE55",
    },
    ".cm-gutters": {
      backgroundColor: "#FAF4EC",
      color: "#8C8376",
      borderRight: "1px solid #E8DCD0",
    },
    ".cm-activeLine": {
      backgroundColor: "#FDF6EE",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#F4ECE2",
      color: "#BD4B2A",
      fontWeight: "bold",
    },
  },
  { dark: false }
);

const campusLoopDarkTheme = EditorView.theme(
  {
    "&": {
      color: "#F6EFE6",
      backgroundColor: "#161312",
      fontSize: "13.5px",
      lineHeight: "1.65",
      fontFamily: "var(--font-mono-custom, monospace)",
    },
    ".cm-content": {
      caretColor: "#FF804E",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#FF804E",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#42282277",
    },
    ".cm-gutters": {
      backgroundColor: "#1A1715",
      color: "#857A6E",
      borderRight: "1px solid #2F2825",
    },
    ".cm-activeLine": {
      backgroundColor: "#201B19",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#27211E",
      color: "#FF804E",
      fontWeight: "bold",
    },
  },
  { dark: true }
);

function getLanguageExtension(lang: string): Extension {
  const norm = lang.toLowerCase();
  if (norm.includes("python") || norm === "py") return python();
  if (norm.includes("cpp") || norm.includes("c++") || norm === "c") return cpp();
  if (norm.includes("java")) return java();
  if (norm.includes("typescript") || norm === "ts") return javascript({ typescript: true });
  if (norm.includes("javascript") || norm === "js" || norm === "node") return javascript();
  if (norm.includes("rust") || norm === "rs") return rust();
  if (norm.includes("go")) return cpp(); // clean fallback C-like syntax
  return python();
}

export function CodeEditor({
  value,
  onChange,
  language,
  height = "420px",
  readOnly = false,
  onRun,
  onReset,
  storageKey,
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"12px" | "13px" | "14px" | "16px">("13px");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Restore draft from localStorage on initial mount if available
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && saved.trim() && saved !== value) {
        onChange(saved);
      }
    } catch {
      // storage unavailable
    }
  }, [storageKey]);

  // Persist draft to localStorage on change
  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
      if (storageKey && typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, val);
        } catch {
          // ignore
        }
      }
    },
    [onChange, storageKey]
  );

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [value]);

  const clearCode = useCallback(() => {
    handleChange("");
  }, [handleChange]);

  const extensions = useMemo(() => {
    const exts: Extension[] = [getLanguageExtension(language)];

    // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Run
    if (onRun) {
      exts.push(
        EditorView.domEventHandlers({
          keydown: (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              onRun();
              return true;
            }
            return false;
          },
        })
      );
    }

    // Font size extension
    exts.push(
      EditorView.theme({
        "&": { fontSize },
      })
    );

    return exts;
  }, [language, onRun, fontSize]);

  const activeTheme = resolvedTheme === "dark" ? campusLoopDarkTheme : campusLoopLightTheme;

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-2xl border border-border/80 bg-card/60 p-4 font-mono text-xs text-muted-foreground animate-pulse flex items-center justify-center"
      >
        <span>Loading CodeMirror editor...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border/80 bg-card/80 overflow-hidden shadow-2xs transition-all",
        isFullScreen && "fixed inset-0 z-50 rounded-none border-none bg-background",
        className
      )}
    >
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 border-b border-border/60 bg-muted/30 text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-foreground text-xs uppercase tracking-wider">
            {language}
          </span>
          {onRun && (
            <span className="hidden sm:inline-block text-[10px] text-muted-foreground/70 font-mono">
              (Ctrl+Enter to run)
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1">
          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as any)}
            className="h-7 rounded-lg bg-card border border-border/60 px-1.5 text-[11px] font-mono text-muted-foreground focus:outline-none"
            aria-label="Editor Font Size"
          >
            <option value="12px">12px</option>
            <option value="13px">13px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
          </select>

          {/* Copy Button */}
          <button
            type="button"
            onClick={copyCode}
            className="flex items-center gap-1 h-7 px-2 rounded-lg bg-card hover:bg-muted text-[11px] font-semibold text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>

          {/* Reset Button */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 h-7 px-2 rounded-lg bg-card hover:bg-muted text-[11px] font-semibold text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
              title="Reset code to starter template"
            >
              <RotateCcw className="size-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Clear Button */}
          <button
            type="button"
            onClick={clearCode}
            className="flex items-center gap-1 h-7 px-2 rounded-lg bg-card hover:bg-muted text-[11px] font-semibold text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
            title="Clear editor"
          >
            <Trash2 className="size-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Full Screen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center justify-center size-7 rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullScreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* CodeMirror Surface */}
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={value}
          height={isFullScreen ? "calc(100vh - 44px)" : height}
          extensions={extensions}
          theme={activeTheme}
          onChange={handleChange}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            foldGutter: true,
            indentOnInput: true,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}
