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
  ChevronLeft,
  FileText,
  Layers,
  Plus,
  Trash2,
  Code2,
  Maximize2,
  Minimize2,
  ExternalLink,
  History,
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
  submitAuthoritativeJudge,
  compareOutputs,
} from "@/lib/judge/runner";
import type { TestCase, JudgeSubmissionResult } from "@/lib/judge/types";
import type { Problem, SolutionFile } from "@/lib/schema/types";
import { DifficultyBadge, Badge } from "@/components/ui/badge";
import { CodeTabs } from "@/components/problem/code-tabs";
import { MarkdownBody } from "@/components/markdown-body";
import { Watermark } from "@/components/ui/watermark";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils/cn";

interface LeetCodeWorkspaceProps {
  problem: Problem;
  sectionsHtml: { id: string; title: string; html: string }[];
}

export function LeetCodeWorkspace({
  problem,
  sectionsHtml,
}: LeetCodeWorkspaceProps) {
  const { slug, title, solutions } = problem;

  // Navigation tab for left panel
  const [leftTab, setLeftTab] = useState<"description" | "editorial" | "solutions" | "submissions">("description");

  // Mobile navigation tab
  const [mobileTab, setMobileTab] = useState<"problem" | "code" | "console">("code");

  // Available languages
  const availableLangIds = useMemo(() => {
    const fromSolutions = Object.keys(solutions);
    const defaults = ["python", "cpp", "java", "javascript", "typescript", "go", "rust", "c"];
    return Array.from(new Set([...fromSolutions, ...defaults]));
  }, [solutions]);

  // Initial language selection
  const initialLang = useMemo(() => {
    if (solutions["python"]) return "python";
    const keys = Object.keys(solutions);
    return keys.length > 0 ? keys[0] : "python";
  }, [solutions]);

  const [selectedLang, setSelectedLang] = useState<string>(initialLang);

  // Starter code resolution
  const getInitialCode = useCallback(
    (langId: string) => {
      if (typeof window !== "undefined") {
        try {
          const draft = localStorage.getItem(`dsaloop:draft:${slug}:${langId}`);
          if (draft && draft.trim()) return draft;
        } catch {
          // ignore
        }
      }

      const sol = solutions[langId] || solutions[langId.toLowerCase()];
      if (sol?.code) return sol.code;

      const def = getLanguageById(langId);
      if (def?.dsaStarterTemplate) {
        return def.dsaStarterTemplate(slug, "solve");
      }

      return `# DSALoop — ${title}\n# Write your solution below:\n`;
    },
    [slug, title, solutions]
  );

  const [code, setCode] = useState<string>(() => getInitialCode(initialLang));

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setSelectedLang(newLang);
      setCode(getInitialCode(newLang));
    },
    [getInitialCode]
  );

  // Test cases
  const initialCases = useMemo(() => {
    return extractSampleTestCases(undefined, slug);
  }, [slug]);

  const [testCases, setTestCases] = useState<TestCase[]>(initialCases);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCases[0]?.id || "case-1"
  );
  const [consoleTab, setConsoleTab] = useState<"cases" | "run_result" | "judge_result">("cases");

  // Run Code state
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<{
    testCase: TestCase;
    exec: ExecutionResult;
    passed: boolean;
  } | null>(null);

  // Judge Submission state
  const [isJudging, setIsJudging] = useState(false);
  const [judgeResult, setJudgeResult] = useState<JudgeSubmissionResult | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<
    { date: string; verdict: string; timeMs: number; memoryKb: number }[]
  >([]);

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

  const addCustomTestCase = useCallback(() => {
    const newId = `custom-${Date.now()}`;
    const newCase: TestCase = {
      id: newId,
      name: `Case ${testCases.length + 1}`,
      input: "",
      expectedOutput: "",
      isCustom: true,
    };
    setTestCases((prev) => [...prev, newCase]);
    setSelectedCaseId(newId);
    setConsoleTab("cases");
  }, [testCases.length]);

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

  // Run code against active test case
  const handleRun = useCallback(async () => {
    if (isRunning || isJudging) return;
    setIsRunning(true);
    setConsoleTab("run_result");
    setMobileTab("console");

    try {
      const exec = await executeCode({
        language: selectedLang,
        code,
        stdin: activeTestCase.input,
        timeoutMs: 10000,
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

  // Submit code to judge
  const handleSubmit = useCallback(async () => {
    if (isRunning || isJudging) return;
    setIsJudging(true);
    setConsoleTab("judge_result");
    setMobileTab("console");

    try {
      const res = await submitAuthoritativeJudge(slug, selectedLang, code, testCases);
      setJudgeResult(res);

      // Record in local submission history
      setSubmissionHistory((prev) => [
        {
          date: new Date().toLocaleTimeString(),
          verdict: res.verdict,
          timeMs: res.executionTimeMs,
          memoryKb: res.memoryKb,
        },
        ...prev.slice(0, 9),
      ]);
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
  }, [isRunning, isJudging, slug, selectedLang, code, testCases]);

  const hasReference = Boolean(
    solutions[selectedLang] || solutions[selectedLang.toLowerCase()]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground select-none">
      {/* Top LeetCode Workspace Navigation Bar */}
      <header className="h-12 border-b border-border/70 bg-card/70 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 backdrop-blur-md">
        {/* Left: Back Link & Problem Title */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={`/problems/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Notes</span>
          </Link>

          <span className="text-muted-foreground/40 hidden sm:inline">|</span>

          <span className="text-xs font-mono text-muted-foreground tabular-nums shrink-0">
            #{problem.number}
          </span>
          <h1 className="font-heading font-bold text-xs sm:text-sm tracking-tight text-foreground truncate max-w-[140px] sm:max-w-[280px]">
            {title}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} />

          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider shrink-0">
            Beta
          </span>
        </div>

        {/* Center: Action Buttons (Run Code & Submit) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || isJudging}
            className="h-7.5 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 active:scale-95 cursor-pointer"
            title="Run code against active testcase (Ctrl+Enter)"
          >
            <Play className={cn("w-3 h-3 text-emerald-500 fill-emerald-500", isRunning && "animate-spin")} />
            <span className="hidden sm:inline">{isRunning ? "Running..." : "Run"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isJudging}
            className="h-7.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            title="Submit solution to online judge"
          >
            <Send className={cn("w-3 h-3", isJudging && "animate-pulse")} />
            <span>{isJudging ? "Judging..." : "Submit"}</span>
          </button>
        </div>

        {/* Right: Theme Toggle & Watermark */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <div className="hidden lg:block">
            <Watermark variant="pill" />
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-border/60 bg-muted/30 px-2 py-1 text-xs">
        <button
          onClick={() => setMobileTab("problem")}
          className={cn(
            "flex-1 py-1.5 text-center font-semibold rounded-lg transition-all",
            mobileTab === "problem" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
          )}
        >
          Description
        </button>
        <button
          onClick={() => setMobileTab("code")}
          className={cn(
            "flex-1 py-1.5 text-center font-semibold rounded-lg transition-all",
            mobileTab === "code" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
          )}
        >
          Code
        </button>
        <button
          onClick={() => setMobileTab("console")}
          className={cn(
            "flex-1 py-1.5 text-center font-semibold rounded-lg transition-all",
            mobileTab === "console" ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground"
          )}
        >
          Console
        </button>
      </div>

      {/* Main Split Layout: Left Problem Details & Right Editor / Console */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/70 overflow-hidden">
        {/* Left Column: Problem Tabs (Description, Solutions, Submissions) */}
        <div
          className={cn(
            "flex flex-col h-[calc(100vh-48px)] overflow-hidden bg-card/30",
            mobileTab !== "problem" && "hidden md:flex"
          )}
        >
          {/* Left Panel Tabs Bar */}
          <div className="flex items-center border-b border-border/60 bg-muted/20 px-3 py-1.5 text-xs gap-1 shrink-0">
            <button
              onClick={() => setLeftTab("description")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5",
                leftTab === "description"
                  ? "bg-card text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setLeftTab("solutions")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5",
                leftTab === "solutions"
                  ? "bg-card text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Solutions</span>
            </button>

            <button
              onClick={() => setLeftTab("submissions")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5",
                leftTab === "submissions"
                  ? "bg-card text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="w-3.5 h-3.5" />
              <span>Submissions</span>
            </button>
          </div>

          {/* Left Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 select-text text-sm leading-relaxed">
            {leftTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    <span className="text-xs text-muted-foreground">
                      Time: <strong className="text-foreground">{problem.timeComplexity}</strong>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Space: <strong className="text-foreground">{problem.spaceComplexity}</strong>
                    </span>
                  </div>
                </div>

                {/* Beginner Explanation & Problem Body */}
                <div className="space-y-4">
                  {sectionsHtml.slice(0, 3).map((sec) => (
                    <div key={sec.id} className="space-y-2">
                      <h3 className="font-heading font-semibold text-foreground text-sm border-b border-border/40 pb-1">
                        {sec.title}
                      </h3>
                      <MarkdownBody html={sec.html} />
                    </div>
                  ))}
                </div>

                {/* Topics & Patterns Tags */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <span className="text-xs font-semibold text-muted-foreground block">
                    Tags &amp; Patterns
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.topics.map((t) => (
                      <Badge key={t} variant="default">
                        {t.replace(/-/g, " ")}
                      </Badge>
                    ))}
                    {problem.patterns.map((p) => (
                      <Badge key={p} variant="outline">
                        {p.replace(/-/g, " ")}
                      </Badge>
                    ))}
                    {problem.companies.map((c) => (
                      <Badge key={c} variant="muted">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* LeetCode official statement link */}
                <div className="pt-2">
                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>View original statement on LeetCode</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {leftTab === "solutions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Official Reference Solutions
                  </h3>
                  {hasReference && (
                    <button
                      onClick={loadReferenceSolution}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Load into Editor →
                    </button>
                  )}
                </div>
                <CodeTabs solutions={problem.solutions} />
              </div>
            )}

            {leftTab === "submissions" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Session Submissions
                </h3>
                {submissionHistory.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">
                    No submissions yet. Click <strong>Submit</strong> to evaluate your solution.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {submissionHistory.map((sub, i) => (
                      <div
                        key={i}
                        className={cn(
                          "p-3 rounded-xl border text-xs flex items-center justify-between",
                          sub.verdict === "ACCEPTED"
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                            : "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-300"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {sub.verdict === "ACCEPTED" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                          <span className="font-bold">{sub.verdict}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                          <span>{sub.timeMs}ms</span>
                          <span>{sub.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: CodeMirror 6 Editor & Console Drawer */}
        <div
          className={cn(
            "flex flex-col h-[calc(100vh-48px)] overflow-hidden bg-background",
            mobileTab === "problem" && "hidden md:flex"
          )}
        >
          {/* Editor Header Bar (Language, Template, Reset) */}
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-3 py-1.5 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="h-7 rounded-lg bg-card border border-border/80 px-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
                aria-label="Editor Language"
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

              {hasReference && (
                <button
                  onClick={loadReferenceSolution}
                  className="h-7 px-2 rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-all"
                  title="Load reference solution into editor"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Reference</span>
                </button>
              )}

              <button
                onClick={resetToTemplate}
                className="h-7 px-2 rounded-lg border border-border/60 bg-muted/40 hover:bg-muted text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-all"
                title="Reset to starter scaffold template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
              Ctrl+Enter to run
            </span>
          </div>

          {/* CodeMirror 6 Editor Body */}
          <div className={cn("flex-1 overflow-hidden", mobileTab === "console" && "hidden md:flex")}>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={selectedLang}
              height="100%"
              onRun={handleRun}
              storageKey={`dsaloop:draft:${slug}:${selectedLang}`}
              className="h-full rounded-none border-none shadow-none"
            />
          </div>

          {/* Bottom Console Drawer */}
          <div className="h-64 sm:h-72 border-t border-border/70 bg-card/90 flex flex-col shrink-0 overflow-hidden">
            {/* Console Drawer Navigation */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5 text-xs shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setConsoleTab("cases")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1",
                    consoleTab === "cases"
                      ? "bg-card text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Layers className="w-3 h-3" />
                  <span>Test Cases ({testCases.length})</span>
                </button>

                <button
                  onClick={() => setConsoleTab("run_result")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1",
                    consoleTab === "run_result"
                      ? "bg-card text-foreground font-semibold shadow-2xs"
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
                  onClick={() => setConsoleTab("judge_result")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1",
                    consoleTab === "judge_result"
                      ? "bg-card text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span>Judge Verdict</span>
                  {judgeResult && (
                    <span
                      className={cn(
                        "px-1 py-0.2 rounded text-[10px] font-bold",
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

              <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                Self-Hosted Execution
              </span>
            </div>

            {/* Console Content Area */}
            <div className="flex-1 overflow-y-auto p-3 text-xs">
              {/* Tab 1: Test Cases */}
              {consoleTab === "cases" && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {testCases.map((tc) => (
                      <div key={tc.id} className="inline-flex items-center">
                        <button
                          onClick={() => setSelectedCaseId(tc.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                            selectedCaseId === tc.id
                              ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                              : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {tc.name}
                        </button>
                        {tc.isCustom && testCases.length > 1 && (
                          <button
                            onClick={() => deleteTestCase(tc.id)}
                            className="ml-1 p-0.5 text-muted-foreground hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addCustomTestCase}
                      className="px-2 py-1 rounded-lg text-xs border border-dashed border-border/80 text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Case</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Input
                      </label>
                      <textarea
                        value={activeTestCase.input}
                        onChange={(e) => updateActiveTestCase("input", e.target.value)}
                        placeholder="Stdin inputs..."
                        rows={3}
                        className="w-full rounded-lg border border-border/80 bg-background/80 p-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Expected Output
                      </label>
                      <textarea
                        value={activeTestCase.expectedOutput}
                        onChange={(e) => updateActiveTestCase("expectedOutput", e.target.value)}
                        placeholder="Expected stdout..."
                        rows={3}
                        className="w-full rounded-lg border border-border/80 bg-background/80 p-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Run Result */}
              {consoleTab === "run_result" && (
                <div className="space-y-2">
                  {isRunning ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-muted-foreground animate-pulse">
                      <Play className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-xs font-mono">Running code on self-hosted sandbox...</span>
                    </div>
                  ) : runResult ? (
                    <div className="space-y-2">
                      <div
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg border text-xs",
                          runResult.passed
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                        )}
                      >
                        <div className="flex items-center gap-1.5 font-bold">
                          {runResult.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                          <span>{runResult.passed ? "Passed" : "Wrong Answer"}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span>{runResult.exec.executionTimeMs}ms</span>
                          <span className="text-muted-foreground/60">{runResult.exec.provider}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">YOUR OUTPUT</span>
                          <pre className="p-2 rounded bg-background/80 border border-border/60 overflow-x-auto min-h-[45px]">
                            {runResult.exec.stdout || "(empty)"}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">EXPECTED OUTPUT</span>
                          <pre className="p-2 rounded bg-background/80 border border-border/60 overflow-x-auto min-h-[45px]">
                            {runResult.testCase.expectedOutput || "(not set)"}
                          </pre>
                        </div>
                      </div>

                      {runResult.exec.stderr && (
                        <div className="text-rose-500 font-mono text-[11px] p-2 rounded bg-rose-500/10">
                          {runResult.exec.stderr}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-6">
                      Click <strong>Run</strong> or press <strong>Ctrl+Enter</strong> to execute against the active test case.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 3: Judge Submission */}
              {consoleTab === "judge_result" && (
                <div className="space-y-2">
                  {isJudging ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-muted-foreground animate-pulse">
                      <Send className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-xs font-mono">Judging against all authoritative test cases...</span>
                    </div>
                  ) : judgeResult ? (
                    <div className="space-y-3">
                      <div
                        className={cn(
                          "p-2.5 rounded-xl border flex items-center justify-between",
                          judgeResult.verdict === "ACCEPTED"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {judgeResult.verdict === "ACCEPTED" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                          <div>
                            <span className="font-bold text-sm block">
                              {judgeResult.verdict === "ACCEPTED" ? "Accepted" : judgeResult.verdict}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Passed {judgeResult.passedCount} / {judgeResult.totalCount} test cases
                            </span>
                          </div>
                        </div>

                        <div className="font-mono text-xs">
                          <span>{judgeResult.executionTimeMs} ms</span>
                        </div>
                      </div>

                      {/* Tests list */}
                      <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
                        {judgeResult.results.map((tr) => (
                          <div
                            key={tr.testCaseId}
                            className={cn(
                              "p-2 rounded-lg border flex items-center justify-between",
                              tr.passed
                                ? "border-emerald-500/20 bg-emerald-500/5"
                                : "border-rose-500/20 bg-rose-500/5"
                            )}
                          >
                            <span className="flex items-center gap-1.5 font-sans font-semibold">
                              {tr.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              )}
                              {tr.name}
                            </span>
                            <span className="text-muted-foreground">{tr.executionTimeMs}ms</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-6">
                      Click <strong>Submit</strong> to evaluate your solution against the full test suite.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
