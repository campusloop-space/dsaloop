import { executeCode } from "../compiler/execute";
import type { TestCase, JudgeSubmissionResult, TestCaseResult, JudgeVerdict } from "./types";

/**
 * Normalizes output strings for robust comparison
 */
export function normalizeOutput(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}

export function compareOutputs(actual: string, expected: string): boolean {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  if (normActual === normExpected) return true;

  // JSON array comparison if applicable
  try {
    const jsonActual = JSON.parse(normActual);
    const jsonExpected = JSON.parse(normExpected);
    if (JSON.stringify(jsonActual) === JSON.stringify(jsonExpected)) return true;
  } catch {
    // not json
  }

  return false;
}

const WELL_KNOWN_CASES: Record<string, TestCase[]> = {
  "two-sum": [
    { id: "case-1", name: "Case 1", input: "2 7 11 15\n9", expectedOutput: "[0, 1]" },
    { id: "case-2", name: "Case 2", input: "3 2 4\n6", expectedOutput: "[1, 2]" },
    { id: "case-3", name: "Case 3", input: "3 3\n6", expectedOutput: "[0, 1]" },
  ],
  "valid-parentheses": [
    { id: "case-1", name: "Case 1", input: "()", expectedOutput: "true" },
    { id: "case-2", name: "Case 2", input: "()[]{}", expectedOutput: "true" },
    { id: "case-3", name: "Case 3", input: "(]", expectedOutput: "false" },
  ],
  "palindrome-number": [
    { id: "case-1", name: "Case 1", input: "121", expectedOutput: "true" },
    { id: "case-2", name: "Case 2", input: "-121", expectedOutput: "false" },
    { id: "case-3", name: "Case 3", input: "10", expectedOutput: "false" },
  ],
  "reverse-string": [
    { id: "case-1", name: "Case 1", input: "hello", expectedOutput: "olleh" },
    { id: "case-2", name: "Case 2", input: "Hannah", expectedOutput: "hannaH" },
  ],
  "contains-duplicate": [
    { id: "case-1", name: "Case 1", input: "1 2 3 1", expectedOutput: "true" },
    { id: "case-2", name: "Case 2", input: "1 2 3 4", expectedOutput: "false" },
    { id: "case-3", name: "Case 3", input: "1 1 1 3 3 4 3 2 4 2", expectedOutput: "true" },
  ],
  "best-time-to-buy-and-sell-stock": [
    { id: "case-1", name: "Case 1", input: "7 1 5 3 6 4", expectedOutput: "5" },
    { id: "case-2", name: "Case 2", input: "7 6 4 3 1", expectedOutput: "0" },
  ],
  "maximum-subarray": [
    { id: "case-1", name: "Case 1", input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
    { id: "case-2", name: "Case 2", input: "1", expectedOutput: "1" },
    { id: "case-3", name: "Case 3", input: "5 4 -1 7 8", expectedOutput: "23" },
  ],
  "merge-two-sorted-lists": [
    { id: "case-1", name: "Case 1", input: "1 2 4\n1 3 4", expectedOutput: "1 1 2 3 4 4" },
    { id: "case-2", name: "Case 2", input: "\n", expectedOutput: "" },
    { id: "case-3", name: "Case 3", input: "\n0", expectedOutput: "0" },
  ],
};

/**
 * Extracts default sample test cases from a problem description or provides defaults
 */
export function extractSampleTestCases(bodyMarkdown?: string, slug?: string): TestCase[] {
  if (slug && WELL_KNOWN_CASES[slug]) {
    return WELL_KNOWN_CASES[slug];
  }

  const cases: TestCase[] = [];

  if (bodyMarkdown) {
    // Match Example 1: Input: ... Output: ...
    const exampleRegex = /Example\s*(\d+)?:[\s\S]*?(?:Input|input):\s*([^\n\r]+)[\s\S]*?(?:Output|output):\s*([^\n\r]+)/gi;
    let match: RegExpExecArray | null;
    let count = 1;

    while ((match = exampleRegex.exec(bodyMarkdown)) !== null && count <= 3) {
      const inputStr = match[2].trim();
      const outputStr = match[3].trim();
      cases.push({
        id: `case-${count}`,
        name: `Case ${count}`,
        input: inputStr,
        expectedOutput: outputStr,
      });
      count++;
    }
  }

  if (cases.length === 0) {
    // Default fallback test cases
    cases.push({
      id: "case-1",
      name: "Case 1",
      input: "2 7 11 15\n9",
      expectedOutput: "[0, 1]",
    });
    cases.push({
      id: "case-2",
      name: "Case 2",
      input: "3 2 4\n6",
      expectedOutput: "[1, 2]",
    });
  }

  return cases;
}

/**
 * Run code through test cases and determine judge verdict
 */
export async function runJudge(
  language: string,
  code: string,
  testCases: TestCase[]
): Promise<JudgeSubmissionResult> {
  const results: TestCaseResult[] = [];
  let totalTime = 0;
  let maxMemory = 1024;
  let overallVerdict: JudgeVerdict = "ACCEPTED";
  let firstError: string | undefined;

  for (const tc of testCases) {
    const res = await executeCode({
      language,
      code,
      stdin: tc.input,
      timeoutMs: 12000,
    });

    totalTime += res.executionTimeMs;
    if (res.memoryKb && res.memoryKb > maxMemory) {
      maxMemory = res.memoryKb;
    }

    if (res.status === "compile_error") {
      overallVerdict = "COMPILE_ERROR";
      firstError = res.stderr;
      results.push({
        testCaseId: tc.id,
        name: tc.name,
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: res.output,
        error: res.stderr,
        executionTimeMs: res.executionTimeMs,
      });
      break; // Stop further test cases on compile error
    }

    if (res.status === "time_limit_exceeded") {
      if (overallVerdict === "ACCEPTED") overallVerdict = "TIME_LIMIT_EXCEEDED";
      results.push({
        testCaseId: tc.id,
        name: tc.name,
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: res.output,
        error: "Time Limit Exceeded",
        executionTimeMs: res.executionTimeMs,
      });
      continue;
    }

    if (res.status === "runtime_error" || res.exitCode !== 0) {
      if (overallVerdict === "ACCEPTED") overallVerdict = "RUNTIME_ERROR";
      results.push({
        testCaseId: tc.id,
        name: tc.name,
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: res.output,
        error: res.stderr || "Runtime Error",
        executionTimeMs: res.executionTimeMs,
      });
      continue;
    }

    const isMatch = compareOutputs(res.stdout, tc.expectedOutput);
    if (!isMatch && overallVerdict === "ACCEPTED") {
      overallVerdict = "WRONG_ANSWER";
    }

    results.push({
      testCaseId: tc.id,
      name: tc.name,
      passed: isMatch,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: res.stdout || res.output,
      executionTimeMs: res.executionTimeMs,
    });
  }

  const passedCount = results.filter((r) => r.passed).length;

  return {
    verdict: overallVerdict,
    passedCount,
    totalCount: testCases.length,
    executionTimeMs: totalTime,
    memoryKb: maxMemory,
    results,
    error: firstError,
  };
}

/**
 * Submits solution to the server-side authoritative judge (/api/code/submit)
 * Evaluates against both public sample cases and authoritative hidden tests.
 * Falls back to local execution if server endpoint is unreachable.
 */
export async function submitAuthoritativeJudge(
  slug: string,
  language: string,
  code: string,
  fallbackTestCases: TestCase[]
): Promise<JudgeSubmissionResult> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/code/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, language, code }),
      });
      if (res.ok) {
        return (await res.json()) as JudgeSubmissionResult;
      }
    } catch {
      // Server unreachable, fall back to runner
    }
  }

  return runJudge(language, code, fallbackTestCases);
}
