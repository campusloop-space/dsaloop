"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Cpu,
  Send,
  BookOpen,
  Sparkles,
  Terminal,
  FileCode,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { CodeEditor } from "@/components/compiler/code-editor";
import {
  SUPPORTED_LANGUAGES,
  getLanguageById,
  type LanguageDefinition,
} from "@/lib/compiler/languages";
import { executeCode, type ExecutionResult } from "@/lib/compiler/execute";
import {
  extractSampleTestCases,
  runJudge,
  submitAuthoritativeJudge,
  compareOutputs,
} from "@/lib/judge/runner";
import type { TestCase, JudgeSubmissionResult } from "@/lib/judge/types";
import type { SolutionFile } from "@/lib/schema/types";
import { Watermark } from "@/components/ui/watermark";
import { cn } from "@/lib/utils/cn";

interface ProblemWorkspaceProps {
  slug: string;
  title: string;
  solutions: Record<string, SolutionFile>;
}

export function ProblemWorkspace({
  slug,
  title,
  solutions,
}: ProblemWorkspaceProps) {
  // Available languages from solutions or general registry
  const availableLangIds = useMemo(() => {
    const fromSolutions = Object.keys(solutions);
    const defaults = ["python", "cpp", "java", "javascript", "typescript", "go", "rust", "c"];
    const set = new Set([...fromSolutions, ...defaults]);
    return Array.from(set);
  }, [solutions]);

  // Initial language: python if available, else first solution language, else cpp
  const initialLang = useMemo(() => {
    if (solutions["python"]) return "python";
    const keys = Object.keys(solutions);
    if (keys.length > 0) return keys[0];
    return "python";
  }, [solutions]);

  const [selectedLang, setSelectedLang] = useState<string>(initialLang);

  // Initialize starter template for a language
  const getInitialCode = useCallback(
    (langId: string) => {
      // 1. Check local storage
      if (typeof window !== "undefined") {
        try {
          const draft = localStorage.getItem(`dsaloop:draft:${slug}:${langId}`);
          if (draft && draft.trim()) return draft;
        } catch {
          // ignore
        }
      }

      // 2. Check problem.solutions
      const sol = solutions[langId] || solutions[langId.toLowerCase()];
      if (sol?.code) {
        return sol.code;
      }

      // 3. Fallback to registry starter
      const def = getLanguageById(langId);
      if (def?.dsaStarterTemplate) {
        return def.dsaStarterTemplate(slug, "solve");
      }

      return `# DSALoop — ${title}\n# Write your solution below:\n`;
    },
    [slug, title, solutions]
  );

  const [code, setCode] = useState<string>(() => getInitialCode(initialLang));

  // Update code when changing language
  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setSelectedLang(newLang);
      setCode(getInitialCode(newLang));
    },
    [getInitialCode]
  );

  // Test cases state
  const initialCases = useMemo(() => {
    return extractSampleTestCases(undefined, slug);
  }, [slug]);

  const [testCases, setTestCases] = useState<TestCase[]>(initialCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCases[0]?.id || "case-1"
  );
  const [activeConsoleTab, setActiveConsoleTab] = useState<
    "cases" | "run_result" | "judge_result"
  >("cases");

  // Single test case execution state
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<{
    testCase: TestCase;
    exec: ExecutionResult;
    passed: boolean;
  } | null>(null);

  // Judge submission state
  const [isJudging, setIsJudging] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeSubmissionResult | null>(null);

  const activeTestCase = useMemo(() => {
    return (
      testCases.find((tc) => tc.id === selectedCaseId) ||
      testCases[0] || {
        id: "custom",
        name: "Custom",
        input: "",
        expectedOutput: "",
      }
    );
  }, [testCases, selectedCaseId]);

  // Update active testcase fields
  const updateActiveTestCase = useCallback(
    (field: "input" | "expectedOutput", val: string) => {
      setTestCases((prev) =>
        prev.map((tc) =>
          tc.id === activeTestCase.id ? { ...tc, [field]: val } : tc
        )
      );
    },
    [activeTestCase.id]
  );

  // Add new custom testcase
  const addCustomTestCase = useCallback(() => {
    const newId = `custom-${Date.now()}`;
    const newCase: TestCase = {
      id: newId,
      name: `Case ${testCases.length + 1} (Custom)`,
      input: "",
      expectedOutput: "",
      isCustom: true,
    };
    setTestCases((prev) => [...prev, newCase]);
    setSelectedCaseId(newId);
    setActiveConsoleTab("cases");
  }, [testCases.length]);

  // Delete custom testcase
  const deleteTestCase = useCallback(
    (id: string) => {
      if (testCases.length <= 1) return;
      setTestCases((prev) => prev.filter((tc) => tc.id !== id));
      if (selectedCaseId === id) {
        setSelectedCaseId(testCases[0].id);
      }
    },
    [testCases, selectedCaseId]
  );

  // Load reference solution
  const loadReferenceSolution = useCallback(() => {
    const sol = solutions[selectedLang] || solutions[selectedLang.toLowerCase()];
    if (sol?.code) {
      setCode(sol.code);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`dsaloop:draft:${slug}:${selectedLang}`, sol.code);
        } catch {
          // ignore
        }
      }
    }
  }, [solutions, selectedLang, slug]);

  // Reset to starter template
  const resetToTemplate = useCallback(() => {
    const def = getLanguageById(selectedLang);
    const template = def?.dsaStarterTemplate
      ? def.dsaStarterTemplate(slug, "solve")
      : `# Starter code for ${title}\n`;
    setCode(template);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`dsaloop:draft:${slug}:${selectedLang}`, template);
      } catch {
        // ignore
      }
    }
  }, [selectedLang, slug, title]);

  // Run Code against single selected test case
  const handleRun = useCallback(async () => {
    if (isRunning || isJudging) return;
    setIsRunning(true);
    setActiveConsoleTab("run_result");

    try {
      const exec = await executeCode({
        language: selectedLang,
        code,
        stdin: activeTestCase.input,
        timeoutMs: 12000,
      });

      const passed =
        exec.status === "success" &&
        compareOutputs(exec.stdout, activeTestCase.expectedOutput);

      setRunResult({
        testCase: activeTestCase,
        exec,
        passed,
      });
    } catch (err: unknown) {
      setRunResult({
        testCase: activeTestCase,
        exec: {
          status: "error",
          stdout: "",
          stderr: err instanceof Error ? err.message : "Run failed",
          output: `Error: ${err instanceof Error ? err.message : "Run failed"}`,
          exitCode: 1,
          executionTimeMs: 0,
          provider: "error",
        },
        passed: false,
      });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, isJudging, selectedLang, code, activeTestCase]);

  // Submit to judge: run across all test cases
  const handleSubmit = useCallback(async () => {
    if (isRunning || isJudging) return;
    setIsJudging(true);
    setActiveConsoleTab("judge_result");

    try {
      const res = await submitAuthoritativeJudge(slug, selectedLang, code, testCases);
      setJudgeResult(res);
    } catch (err: unknown) {
      setJudgeResult({
        verdict: "INTERNAL_ERROR",
        passedCount: 0,
        totalCount: testCases.length,
        executionTimeMs: 0,
        memoryKb: 0,
        results: [],
        error: err instanceof Error ? err.message : "Judge execution failed",
      });
    } finally {
      setIsJudging(false);
    }
  }, [isRunning, isJudging, selectedLang, code, testCases]);

  const hasReferenceSolution = Boolean(
    solutions[selectedLang] || solutions[selectedLang.toLowerCase()]
  );

  return (
    <div
      id="workspace"
      className="scroll-mt-20 rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-2xs backdrop-blur-sm space-y-4"
    >
      {/* Header bar: Title, Language Selector, and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary">
              <Terminal className="w-3.5 h-3.5" />
            </span>
            <h3 className="font-heading font-bold text-lg tracking-tight text-foreground">
              Code Workspace & Online Judge
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-2.5 h-2.5" />
              Interactive
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Write, test with stdin, and evaluate against test cases right in your browser.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-8 rounded-xl bg-card border border-border/80 px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition-all cursor-pointer"
              aria-label="Coding Language"
            >
              {availableLangIds.map((lid) => {
                const def = getLanguageById(lid);
                return (
                  <option key={lid} value={lid}>
                    {def?.name || lid}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Reference Solution Button */}
          {hasReferenceSolution && (
            <button
              onClick={loadReferenceSolution}
              className="h-8 px-2.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-all shadow-2xs"
              title="Load the verified reference solution into the editor"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reference</span>
            </button>
          )}

          {/* Reset Template Button */}
          <button
            onClick={resetToTemplate}
            className="h-8 px-2.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-all shadow-2xs"
            title="Reset to starter scaffold template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRun}
            disabled={isRunning || isJudging}
            className="h-8 px-3 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
            title="Run code against active test case (Ctrl+Enter)"
          >
            <Play className={cn("w-3.5 h-3.5 text-emerald-500 fill-emerald-500", isRunning && "animate-spin")} />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>

          {/* Submit to Judge Button */}
          <button
            onClick={handleSubmit}
            disabled={isRunning || isJudging}
            className="h-8 px-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50"
            title="Submit code to online judge for full evaluation"
          >
            <Send className={cn("w-3.5 h-3.5", isJudging && "animate-pulse")} />
            <span>{isJudging ? "Judging..." : "Submit"}</span>
          </button>
        </div>
      </div>

      {/* CodeMirror 6 Editor */}
      <div className="relative">
        <CodeEditor
          value={code}
          onChange={setCode}
          language={selectedLang}
          height="380px"
          onRun={handleRun}
          storageKey={`dsaloop:draft:${slug}:${selectedLang}`}
        />
      </div>

      {/* Bottom Console / Output / Judge Drawer */}
      <div className="rounded-2xl border border-border/80 bg-card/90 overflow-hidden shadow-2xs">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveConsoleTab("cases")}
              className={cn(
                "px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5",
                activeConsoleTab === "cases"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Test Cases ({testCases.length})</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab("run_result")}
              className={cn(
                "px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5",
                activeConsoleTab === "run_result"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Play className="w-3 h-3 text-emerald-500" />
              <span>Run Result</span>
              {runResult && (
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    runResult.passed ? "bg-emerald-500" : "bg-rose-500"
                  )}
                />
              )}
            </button>

            <button
              onClick={() => setActiveConsoleTab("judge_result")}
              className={cn(
                "px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5",
                activeConsoleTab === "judge_result"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Judge Submission</span>
              {judgeResult && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded text-[10px] font-bold",
                    judgeResult.verdict === "ACCEPTED"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  )}
                >
                  {judgeResult.verdict}
                </span>
              )}
            </button>
          </div>

          <span className="text-[11px] font-mono text-muted-foreground/80 hidden sm:inline-block">
            DSALoop Judge v1.0
          </span>
        </div>

        {/* Tab 1: Test Cases Tab */}
        {activeConsoleTab === "cases" && (
          <div className="p-4 space-y-3">
            {/* Case selector pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {testCases.map((tc) => (
                <div key={tc.id} className="inline-flex items-center">
                  <button
                    onClick={() => setSelectedCaseId(tc.id)}
                    className={cn(
                      "px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5",
                      selectedCaseId === tc.id
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{tc.name}</span>
                  </button>
                  {tc.isCustom && testCases.length > 1 && (
                    <button
                      onClick={() => deleteTestCase(tc.id)}
                      className="ml-1 p-1 text-muted-foreground hover:text-rose-500 transition-colors"
                      title="Delete custom testcase"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addCustomTestCase}
                className="px-2.5 py-1 rounded-xl text-xs font-medium border border-dashed border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all inline-flex items-center gap-1"
                title="Add a custom test case with custom stdin"
              >
                <Plus className="w-3 h-3" />
                <span>Add Case</span>
              </button>
            </div>

            {/* Test Case Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Input (stdin)
                </label>
                <textarea
                  value={activeTestCase.input}
                  onChange={(e) => updateActiveTestCase("input", e.target.value)}
                  placeholder="Enter inputs (space or newline delimited)..."
                  rows={3}
                  className="w-full rounded-xl border border-border/80 bg-background/80 p-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Expected Output
                </label>
                <textarea
                  value={activeTestCase.expectedOutput}
                  onChange={(e) =>
                    updateActiveTestCase("expectedOutput", e.target.value)
                  }
                  placeholder="Expected stdout..."
                  rows={3}
                  className="w-full rounded-xl border border-border/80 bg-background/80 p-2.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Run Result Tab */}
        {activeConsoleTab === "run_result" && (
          <div className="p-4 space-y-3">
            {isRunning ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground animate-pulse">
                <Play className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs font-mono">Running code on Wandbox execution engine...</span>
              </div>
            ) : runResult ? (
              <div className="space-y-3">
                {/* Result Status Banner */}
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border text-xs",
                    runResult.passed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                      : runResult.exec.status === "compile_error"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {runResult.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="font-bold">
                      {runResult.passed
                        ? `Passed (${runResult.testCase.name})`
                        : runResult.exec.status === "compile_error"
                        ? "Compilation Error"
                        : "Output Mismatch"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {runResult.exec.executionTimeMs}ms
                    </span>
                    {runResult.exec.memoryKb ? (
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        {(runResult.exec.memoryKb / 1024).toFixed(1)} MB
                      </span>
                    ) : null}
                    <span className="text-muted-foreground/70">{runResult.exec.provider}</span>
                  </div>
                </div>

                {/* Stdout / Stderr output display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Your Output
                    </span>
                    <pre className="rounded-xl border border-border/80 bg-background/80 p-2.5 font-mono text-xs text-foreground overflow-x-auto min-h-[60px] whitespace-pre-wrap">
                      {runResult.exec.stdout || runResult.exec.output || "(empty stdout)"}
                    </pre>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Expected Output
                    </span>
                    <pre className="rounded-xl border border-border/80 bg-background/80 p-2.5 font-mono text-xs text-muted-foreground overflow-x-auto min-h-[60px] whitespace-pre-wrap">
                      {runResult.testCase.expectedOutput || "(not set)"}
                    </pre>
                  </div>
                </div>

                {runResult.exec.stderr && (
                  <div>
                    <span className="block text-[11px] font-semibold text-rose-500 uppercase tracking-wider mb-1">
                      Compiler / Runtime Error Details
                    </span>
                    <pre className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-2.5 font-mono text-xs text-rose-600 dark:text-rose-400 overflow-x-auto whitespace-pre-wrap">
                      {runResult.exec.stderr}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Click <strong>"Run Code"</strong> above or press <strong>Ctrl+Enter</strong> to run against the selected test case.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Judge Submission Tab */}
        {activeConsoleTab === "judge_result" && (
          <div className="p-4 space-y-3">
            {isJudging ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground animate-pulse">
                <Send className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs font-mono">Evaluating solution against all test cases...</span>
              </div>
            ) : judgeResult ? (
              <div className="space-y-4">
                {/* Big Verdict Header */}
                <div
                  className={cn(
                    "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                    judgeResult.verdict === "ACCEPTED"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                      : judgeResult.verdict === "COMPILE_ERROR"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {judgeResult.verdict === "ACCEPTED" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                      <h4 className="font-heading font-bold text-base tracking-tight">
                        {judgeResult.verdict === "ACCEPTED"
                          ? "Accepted — All Tests Passed!"
                          : judgeResult.verdict === "WRONG_ANSWER"
                          ? "Wrong Answer"
                          : judgeResult.verdict === "COMPILE_ERROR"
                          ? "Compile Error"
                          : judgeResult.verdict === "TIME_LIMIT_EXCEEDED"
                          ? "Time Limit Exceeded"
                          : "Runtime Error"}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Passed {judgeResult.passedCount} / {judgeResult.totalCount} test cases
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                    <div className="px-2.5 py-1 rounded-lg bg-card/80 border border-border/60">
                      <span className="text-muted-foreground text-[10px] block">RUNTIME</span>
                      <span className="font-bold text-foreground">{judgeResult.executionTimeMs} ms</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-card/80 border border-border/60">
                      <span className="text-muted-foreground text-[10px] block">MEMORY</span>
                      <span className="font-bold text-foreground">
                        {(judgeResult.memoryKb / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Individual Test Cases Result List */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Test Results Breakdown
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {judgeResult.results.map((tr) => (
                      <div
                        key={tr.testCaseId}
                        className={cn(
                          "p-3 rounded-xl border text-xs flex flex-col gap-1.5 transition-all",
                          tr.passed
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-rose-500/20 bg-rose-500/5"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            {tr.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                            {tr.name}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {tr.executionTimeMs}ms
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">INPUT</span>
                            <div className="bg-background/80 rounded p-1.5 truncate border border-border/40">
                              {tr.input || "(empty)"}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">OUTPUT</span>
                            <div className="bg-background/80 rounded p-1.5 truncate border border-border/40">
                              {tr.actualOutput || "(empty)"}
                            </div>
                          </div>
                        </div>

                        {tr.error && (
                          <div className="text-[11px] text-rose-500 font-mono pt-1">
                            {tr.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Click <strong>"Submit"</strong> to run your solution against the full test suite and receive a judge verdict.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compiler Hub Link & Watermark */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Need a standalone sandbox?</span>
          <Link
            href="/online-compiler"
            className="text-primary hover:underline font-semibold"
          >
            Open DSALoop Online Compiler →
          </Link>
        </div>
        <Watermark variant="inline" />
      </div>
    </div>
  );
}
