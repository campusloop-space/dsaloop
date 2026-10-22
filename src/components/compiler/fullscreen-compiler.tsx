"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileText,
  Clock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Sparkles,
  ChevronLeft,
  Trash2,
  Maximize2,
  Minimize2,
  Code2,
} from "lucide-react";
import { CodeEditor } from "./code-editor";
import {
  SUPPORTED_LANGUAGES,
  getLanguageById,
  type LanguageDefinition,
} from "@/lib/compiler/languages";
import { executeCode, type ExecutionResult } from "@/lib/compiler/execute";
import { Watermark } from "@/components/ui/watermark";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils/cn";

interface FullscreenCompilerProps {
  initialLanguageId?: string;
}

export function FullscreenCompiler({
  initialLanguageId = "python",
}: FullscreenCompilerProps) {
  const router = useRouter();

  const currentLang = useMemo(() => {
    return getLanguageById(initialLanguageId) ?? SUPPORTED_LANGUAGES[0];
  }, [initialLanguageId]);

  const [selectedLang, setSelectedLang] = useState<LanguageDefinition>(currentLang);

  // Restore draft or initial starter code
  const getInitialCode = useCallback((lang: LanguageDefinition) => {
    if (typeof window !== "undefined") {
      try {
        const draft = localStorage.getItem(`dsaloop:compiler:draft:${lang.id}`);
        if (draft && draft.trim()) return draft;
      } catch {
        // ignore
      }
    }
    return lang.starterCode;
  }, []);

  const [code, setCode] = useState<string>(() => getInitialCode(currentLang));
  const [stdin, setStdin] = useState<string>(currentLang.sampleStdin);
  const [activeRightTab, setActiveRightTab] = useState<"output" | "stdin">("output");
  const [mobileTab, setMobileTab] = useState<"code" | "console" | "stdin">("code");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync if initialLanguageId prop changes
  useEffect(() => {
    const lang = getLanguageById(initialLanguageId);
    if (lang && lang.id !== selectedLang.id) {
      setSelectedLang(lang);
      setCode(getInitialCode(lang));
      setStdin(lang.sampleStdin);
      setResult(null);
    }
  }, [initialLanguageId, selectedLang.id, getInitialCode]);

  // Handle language switch
  const handleLanguageChange = useCallback(
    (newId: string) => {
      const lang = getLanguageById(newId);
      if (!lang) return;
      setSelectedLang(lang);
      setCode(getInitialCode(lang));
      setStdin(lang.sampleStdin);
      setResult(null);
      // Update URL route smoothly
      router.push(`/online-compiler/${lang.id}`);
    },
    [router, getInitialCode]
  );

  const handleCodeChange = useCallback(
    (newVal: string) => {
      setCode(newVal);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`dsaloop:compiler:draft:${selectedLang.id}`, newVal);
        } catch {
          // ignore
        }
      }
    },
    [selectedLang.id]
  );

  // Execute Code
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveRightTab("output");
    setMobileTab("console");

    try {
      const res = await executeCode({
        language: selectedLang.id,
        code,
        stdin,
        timeoutMs: 15000,
      });
      setResult(res);
    } catch (err: unknown) {
      setResult({
        status: "error",
        stdout: "",
        stderr: err instanceof Error ? err.message : "Execution failed",
        output: `Error: ${err instanceof Error ? err.message : "Execution failed"}`,
        exitCode: 1,
        executionTimeMs: 0,
        provider: "error",
      });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, selectedLang.id, code, stdin]);

  const handleReset = useCallback(() => {
    setCode(selectedLang.starterCode);
    setStdin(selectedLang.sampleStdin);
    setResult(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`dsaloop:compiler:draft:${selectedLang.id}`);
      } catch {
        // ignore
      }
    }
  }, [selectedLang]);

  const handleClear = useCallback(() => {
    setCode("");
    setResult(null);
  }, []);

  const copyOutput = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 1500);
    } catch {
      setCopiedOutput(false);
    }
  }, [result]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    } catch {
      setCopiedCode(false);
    }
  }, [code]);

  const copyShareUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1500);
    } catch {
      setCopiedShare(false);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground select-none overflow-hidden">
      {/* Top Navbar */}
      <header className="h-12 border-b border-border/70 bg-card/80 px-3 sm:px-4 flex items-center justify-between gap-2.5 shrink-0 backdrop-blur-md z-20">
        {/* Left: Brand & Language Picker */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/"
            className="group flex items-center gap-1.5 shrink-0"
            title="DSALoop Home"
          >
            <div className="size-6.5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-all group-hover:scale-105">
              <Sparkles className="size-3 text-primary" />
            </div>
            <span className="font-heading font-black text-sm tracking-tight text-foreground hidden sm:inline">
              DSA<span className="text-primary font-black">Loop</span>
            </span>
          </Link>

          <span className="text-muted-foreground/40 hidden sm:inline">|</span>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLang.id}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-7.5 pl-2.5 pr-7 rounded-lg border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all shadow-2xs appearance-none"
              aria-label="Select Programming Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.version})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground text-[10px]">
              ▼
            </div>
          </div>

          <Link
            href="/problems"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Code2 className="size-3" />
            <span>Problems</span>
          </Link>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="h-7.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            title="Run code (Ctrl+Enter)"
          >
            <Play className={cn("size-3 fill-current", isRunning && "animate-spin")} />
            <span>{isRunning ? "Running..." : "Run"}</span>
            <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-black/20 text-white/80 font-mono">
              Ctrl+↵
            </kbd>
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            className="h-7.5 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
            title="Reset to starter boilerplate"
          >
            <RotateCcw className="size-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleClear}
            disabled={isRunning}
            className="h-7.5 px-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-all shadow-2xs cursor-pointer hidden sm:inline-flex items-center gap-1"
            title="Clear editor code"
          >
            <Trash2 className="size-3" />
          </button>
        </div>

        {/* Right: Tools & Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={copyCode}
            className="h-7.5 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shadow-2xs cursor-pointer hidden md:inline-flex items-center gap-1"
            title="Copy source code"
          >
            {copiedCode ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
            <span className="text-[11px]">{copiedCode ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={copyShareUrl}
            className="h-7.5 px-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shadow-2xs cursor-pointer hidden lg:inline-flex items-center gap-1"
            title="Share compiler URL"
          >
            {copiedShare ? <Check className="size-3 text-emerald-500" /> : <Share2 className="size-3" />}
            <span className="text-[11px]">{copiedShare ? "Copied" : "Share"}</span>
          </button>

          <ThemeToggle />

          <div className="hidden xl:block">
            <Watermark variant="pill" />
          </div>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="flex md:hidden border-b border-border/60 bg-muted/30 px-2 py-1 text-xs shrink-0">
        <button
          onClick={() => setMobileTab("code")}
          className={cn(
            "flex-1 py-1.5 text-center font-semibold rounded-lg transition-all",
            mobileTab === "code" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
          )}
        >
          Code Editor
        </button>
        <button
          onClick={() => setMobileTab("console")}
          className={cn(
            "flex-1 py-1.5 text-center font-semibold rounded-lg transition-all flex items-center justify-center gap-1",
            mobileTab === "console" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
          )}
        >
          <span>Output</span>
          {result && (
            <span
              className={cn(
                "size-1.5 rounded-full",
                result.status === "success" ? "bg-emerald-500" : "bg-red-500"
              )}
            />
          )}
        </button>
        <button
          onClick={() => setMobileTab("stdin")}
          className={cn(
            "flex-1 py-1.5 text-center font-semibold rounded-lg transition-all",
            mobileTab === "stdin" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
          )}
        >
          Stdin
        </button>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/70 overflow-hidden">
        {/* Left: CodeMirror Editor */}
        <div
          className={cn(
            "flex flex-col h-[calc(100vh-48px)] overflow-hidden bg-card/20",
            mobileTab !== "code" && "hidden md:flex"
          )}
        >
          {/* Editor Sub-header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-foreground">
                main{selectedLang.extension}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                {selectedLang.name}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/80 hidden sm:inline">
              Autosaved locally
            </span>
          </div>

          {/* Editor Container */}
          <div className="flex-1 overflow-hidden relative">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={selectedLang.id}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Right: Terminal & Stdin Panel */}
        <div
          className={cn(
            "flex flex-col h-[calc(100vh-48px)] overflow-hidden bg-card/40",
            mobileTab === "code" && "hidden md:flex"
          )}
        >
          {/* Panel Tabs Header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-3 py-1.5 text-xs shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setActiveRightTab("output");
                  setMobileTab("console");
                }}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                  activeRightTab === "output"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="size-3.5" />
                <span>Output</span>
                {result && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      result.status === "success" ? "bg-emerald-500" : "bg-red-500"
                    )}
                  />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveRightTab("stdin");
                  setMobileTab("stdin");
                }}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                  activeRightTab === "stdin"
                    ? "bg-card text-foreground font-semibold shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="size-3.5" />
                <span>Standard Input (stdin)</span>
                {stdin.trim() && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
              </button>
            </div>

            {activeRightTab === "output" && result && (
              <button
                onClick={copyOutput}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                title="Copy terminal output"
              >
                {copiedOutput ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
                <span>{copiedOutput ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-auto p-3 sm:p-4 font-mono text-xs">
            {activeRightTab === "output" ? (
              <div className="h-full flex flex-col space-y-3">
                {/* Benchmark Metrics Bar */}
                {result && (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-card border border-border/70 text-[11px]">
                    <div className="flex items-center gap-2">
                      {result.status === "success" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="size-3.5" />
                          <span>Exit 0 • Finished</span>
                        </span>
                      ) : result.status === "compile_error" ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                          <AlertTriangle className="size-3.5" />
                          <span>Compile Error</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 font-bold">
                          <XCircle className="size-3.5" />
                          <span>Runtime Error</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{result.executionTimeMs} ms</span>
                      </span>
                      {result.memoryKb && (
                        <span className="inline-flex items-center gap-1">
                          <Cpu className="size-3" />
                          <span>{(result.memoryKb / 1024).toFixed(1)} MB</span>
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                        {result.provider}
                      </span>
                    </div>
                  </div>
                )}

                {/* Terminal Screen */}
                <div className="flex-1 min-h-[220px] rounded-xl bg-zinc-950 text-zinc-100 p-3.5 font-mono text-xs overflow-auto border border-zinc-800 shadow-inner">
                  {isRunning ? (
                    <div className="flex items-center gap-2 text-zinc-400 py-4">
                      <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Compiling and executing code...</span>
                    </div>
                  ) : result ? (
                    <div className="space-y-2 whitespace-pre-wrap leading-relaxed">
                      {result.stdout && (
                        <div className="text-zinc-100">{result.stdout}</div>
                      )}
                      {result.stderr && (
                        <div className="text-red-400">{result.stderr}</div>
                      )}
                      {!result.stdout && !result.stderr && (
                        <div className="text-zinc-500 italic">
                          (Process completed with no output)
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-zinc-500 space-y-1.5 py-6 text-center sm:text-left">
                      <p className="font-semibold text-zinc-400">
                        Ready to run {selectedLang.name}.
                      </p>
                      <p className="text-[11px]">
                        Click <strong>Run</strong> or press <strong>Ctrl+Enter</strong> to execute your code.
                      </p>
                      <p className="text-[11px] text-zinc-600">
                        DSALoop sub-50ms self-hosted execution sandbox with Wandbox fallback.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Standard Input (stdin) passed to program:</span>
                  <button
                    onClick={() => setStdin(selectedLang.sampleStdin)}
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    Load Sample Input
                  </button>
                </div>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Enter input here (each line will be fed to stdin)..."
                  className="flex-1 w-full min-h-[200px] p-3 rounded-xl border border-border bg-card font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none shadow-inner"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
