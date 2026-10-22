"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Play, RotateCcw, Copy, Check, Terminal, FileText, Clock, Cpu, CheckCircle2, AlertTriangle, XCircle, Share2, Sparkles, BookOpen } from "lucide-react";
import { CodeEditor } from "./code-editor";
import { SUPPORTED_LANGUAGES, getLanguageById, type LanguageDefinition } from "@/lib/compiler/languages";
import { executeCode, type ExecutionResult } from "@/lib/compiler/execute";
import { Watermark } from "@/components/ui/watermark";

interface OnlineCompilerProps {
  initialLanguageId: string;
}

export function OnlineCompiler({ initialLanguageId }: OnlineCompilerProps) {
  const currentLang = useMemo(() => {
    return getLanguageById(initialLanguageId) ?? SUPPORTED_LANGUAGES[0];
  }, [initialLanguageId]);

  const [selectedLang, setSelectedLang] = useState<LanguageDefinition>(currentLang);
  const [code, setCode] = useState<string>(currentLang.starterCode);
  const [stdin, setStdin] = useState<string>(currentLang.sampleStdin);
  const [activeRightTab, setActiveRightTab] = useState<"output" | "stdin">("output");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // When changing language from selector
  const handleLanguageChange = useCallback((newId: string) => {
    const lang = getLanguageById(newId);
    if (!lang) return;
    setSelectedLang(lang);
    setCode(lang.starterCode);
    setStdin(lang.sampleStdin);
    setResult(null);
  }, []);

  // Run code handler
  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveRightTab("output");

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
  }, [selectedLang]);

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
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/80 bg-card/60 shadow-2xs backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Language:
            </span>
            <select
              value={selectedLang.id}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-9 rounded-xl bg-card border border-border/80 px-3 text-xs font-heading font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer shadow-2xs"
              aria-label="Select Programming Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
            v{selectedLang.version}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyShareUrl}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
            title="Share compiler URL"
          >
            {copiedShare ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
            <span className="hidden md:inline">{copiedShare ? "Copied Link" : "Share"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground border border-border/60 transition-colors cursor-pointer"
            title="Reset code to default boilerplate"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center gap-2 h-9 px-5 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 text-xs font-heading font-black text-primary-foreground shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className={`size-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
            <span className="hidden lg:inline text-[10px] opacity-80 font-mono font-normal">
              (Ctrl+Enter)
            </span>
          </button>
        </div>
      </div>

      {/* Editor & Output Split Layout */}
      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-4 items-start">
        {/* Left: Code Editor */}
        <div className="w-full min-w-0">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={selectedLang.id}
            height="460px"
            onRun={handleRun}
            onReset={handleReset}
            storageKey={`dsaloop:compiler:${selectedLang.id}`}
          />
        </div>

        {/* Right: Output & Stdin Panel */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card/80 overflow-hidden shadow-2xs h-[504px]">
          {/* Tabs bar */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-2 text-xs select-none">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveRightTab("output")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeRightTab === "output"
                    ? "bg-card text-foreground shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                <Terminal className="size-3.5" />
                <span>Console Output</span>
                {result && (
                  <span
                    className={`size-2 rounded-full ${
                      result.status === "success"
                        ? "bg-emerald-500"
                        : result.status === "compile_error"
                        ? "bg-purple-500"
                        : "bg-coral"
                    }`}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("stdin")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeRightTab === "stdin"
                    ? "bg-card text-foreground shadow-2xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
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
                type="button"
                onClick={copyOutput}
                className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Copy output text"
              >
                {copiedOutput ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                <span>{copiedOutput ? "Copied" : "Copy Output"}</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4 flex flex-col justify-between">
            {activeRightTab === "output" ? (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Status & Benchmark Header */}
                  {result && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-border/40 text-xs">
                      <div className="flex items-center gap-1.5">
                        {result.status === "success" && (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            Success (Exit 0)
                          </span>
                        )}
                        {result.status === "compile_error" && (
                          <span className="inline-flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                            <AlertTriangle className="size-3.5" />
                            Compilation Error
                          </span>
                        )}
                        {result.status === "runtime_error" && (
                          <span className="inline-flex items-center gap-1 font-bold text-coral">
                            <XCircle className="size-3.5" />
                            Runtime Error (Exit {result.exitCode})
                          </span>
                        )}
                        {result.status === "time_limit_exceeded" && (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <Clock className="size-3.5" />
                            Time Limit Exceeded
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {result.executionTimeMs}ms
                        </span>
                        {result.memoryKb && (
                          <span className="inline-flex items-center gap-1">
                            <Cpu className="size-3" />
                            {(result.memoryKb / 1024).toFixed(1)}MB
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Output Terminal Stream */}
                  {isRunning ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-2 text-xs text-muted-foreground">
                      <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Compiling and executing {selectedLang.name}...</span>
                    </div>
                  ) : result ? (
                    <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text text-foreground max-h-[320px] overflow-y-auto">
                      {result.output}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-muted-foreground space-y-1">
                      <Terminal className="size-8 text-muted-foreground/40 mb-2" />
                      <p className="font-semibold text-foreground">Program Output Will Appear Here</p>
                      <p className="max-w-xs">
                        Click &ldquo;Run Code&rdquo; or press <kbd className="font-mono px-1 py-0.5 rounded bg-muted border border-border">Ctrl+Enter</kbd> to execute.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>DSALoop Cloud Execution Environment</span>
                  <Watermark variant="inline" />
                </div>
              </div>
            ) : (
              /* Stdin Editor Tab */
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5 flex-1 flex flex-col">
                  <label htmlFor="stdin-textarea" className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>Input arguments / test inputs:</span>
                    <span className="text-[10px] font-normal text-muted-foreground">Passed to stdin stream</span>
                  </label>
                  <textarea
                    id="stdin-textarea"
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input text here (line by line)..."
                    className="flex-1 w-full p-3 rounded-xl border border-border/80 bg-card font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-[300px]"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Programs using <code className="font-mono text-primary font-bold">scanf</code>, <code className="font-mono text-primary font-bold">cin &gt;&gt;</code>, <code className="font-mono text-primary font-bold">input()</code>, or <code className="font-mono text-primary font-bold">Scanner</code> will read from this buffer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Language Guide & SEO / AEO Section */}
      <section className="mt-12 rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
            <BookOpen className="size-3.5" />
            <span>Interactive Guide &amp; Reference</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground">
            How to Use the Online {selectedLang.name} Compiler
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            {selectedLang.description} Write standard programs directly inside your browser without installing local SDKs, setting up compilers, or configuring environment variables.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {selectedLang.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground font-medium">{feat}</span>
            </div>
          ))}
        </div>

        {/* Quick Language Switcher Grid */}
        <div className="pt-4 border-t border-border/40">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Switch to another language compiler:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map((l) => (
              <Link
                key={l.id}
                href={l.route}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  l.id === selectedLang.id
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions (AEO/GEO Optimized) */}
        {selectedLang.faq.length > 0 && (
          <div className="pt-4 border-t border-border/40 space-y-3">
            <h3 className="font-heading text-base font-bold text-foreground">
              Frequently Asked Questions
            </h3>
            <div className="space-y-2.5">
              {selectedLang.faq.map((item, i) => (
                <details
                  key={i}
                  className="rounded-xl border border-border/60 bg-card p-3.5 group"
                >
                  <summary className="font-heading font-bold text-xs cursor-pointer list-none flex justify-between items-center text-foreground">
                    <span>{item.question}</span>
                    <span className="text-muted-foreground group-open:rotate-45 transition-transform text-sm">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Watermark Card */}
      <Watermark variant="card" className="mt-8" />
    </div>
  );
}
