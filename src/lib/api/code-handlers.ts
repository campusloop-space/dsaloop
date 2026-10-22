import { z } from "zod";
import { getExecutionProvider } from "../compiler/providers";
import { SUPPORTED_LANGUAGES, getLanguageById } from "../compiler/languages";
import {
  getAuthoritativeTestCases,
  sanitizeTestCaseResult,
} from "../judge/authoritative-tests";
import { wrapWithHarness } from "../judge/harness";
import { compareOutputs } from "../judge/runner";
import type { JudgeVerdict, JudgeSubmissionResult, TestCaseResult } from "../judge/types";

// Validation schemas
export const RunCodeSchema = z.object({
  language: z.string().min(1).max(32),
  code: z.string().min(1, "Code cannot be empty").max(65536, "Code exceeds 64KB limit"),
  stdin: z.string().max(32768, "Stdin exceeds 32KB limit").optional().default(""),
  timeoutMs: z.number().int().min(500).max(15000).optional().default(10000),
  slug: z.string().max(128).optional(),
});

export const SubmitCodeSchema = z.object({
  slug: z.string().min(1).max(128),
  language: z.string().min(1).max(32),
  code: z.string().min(1, "Code cannot be empty").max(65536, "Code exceeds 64KB limit"),
});

// Simple in-memory IP Rate Limiter (Sliding Window)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW =
  typeof process !== "undefined" && process.env?.RATE_LIMIT_PER_MINUTE
    ? parseInt(process.env.RATE_LIMIT_PER_MINUTE, 10) || 20
    : 20;

function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientIp) || [];
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(clientIp, recent);
    return { allowed: false, remaining: 0 };
  }

  recent.push(now);
  rateLimitMap.set(clientIp, recent);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - recent.length };
}

/**
 * Server handler for POST /api/code/run
 */
export async function handleRunCode(rawBody: unknown, clientIp: string = "anonymous") {
  const rate = checkRateLimit(clientIp);
  if (!rate.allowed) {
    return {
      status: 429,
      body: {
        error: "Rate limit exceeded. Please wait a minute before running more code.",
        retryAfterSeconds: 60,
      },
    };
  }

  const parseRes = RunCodeSchema.safeParse(rawBody);
  if (!parseRes.success) {
    return {
      status: 400,
      body: {
        error: "Invalid request payload",
        details: parseRes.error.format(),
      },
    };
  }

  const { language, code, stdin, timeoutMs, slug } = parseRes.data;
  const langDef = getLanguageById(language);
  if (!langDef) {
    return {
      status: 400,
      body: {
        error: `Unsupported language "${language}".`,
      },
    };
  }

  try {
    const codeToRun = slug
      ? wrapWithHarness(slug, language, code)
      : code;

    const provider = getExecutionProvider();
    const result = await provider.execute({
      language,
      code: codeToRun,
      stdin,
      timeoutMs,
    });

    return {
      status: 200,
      body: result,
    };
  } catch (err: unknown) {
    return {
      status: 500,
      body: {
        error: "Execution provider failed",
        message: err instanceof Error ? err.message : "Internal error",
      },
    };
  }
}

/**
 * Server handler for POST /api/code/submit
 */
export async function handleSubmitCode(rawBody: unknown, clientIp: string = "anonymous") {
  const rate = checkRateLimit(clientIp);
  if (!rate.allowed) {
    return {
      status: 429,
      body: {
        error: "Rate limit exceeded. Please wait a minute before submitting again.",
        retryAfterSeconds: 60,
      },
    };
  }

  const parseRes = SubmitCodeSchema.safeParse(rawBody);
  if (!parseRes.success) {
    return {
      status: 400,
      body: {
        error: "Invalid submission payload",
        details: parseRes.error.format(),
      },
    };
  }

  const { slug, language, code } = parseRes.data;
  const langDef = getLanguageById(language);
  if (!langDef) {
    return {
      status: 400,
      body: {
        error: `Unsupported language "${language}".`,
      },
    };
  }

  const testCases = getAuthoritativeTestCases(slug);
  const codeToRun = wrapWithHarness(slug, language, code);
  const provider = getExecutionProvider();

  const results: TestCaseResult[] = [];
  let totalTime = 0;
  let maxMemory = 1024;
  let overallVerdict: JudgeVerdict = "ACCEPTED";
  let firstError: string | undefined;

  for (const tc of testCases) {
    const execRes = await provider.execute({
      language,
      code: codeToRun,
      stdin: tc.input,
      timeoutMs: 12000,
    });

    totalTime += execRes.executionTimeMs;
    if (execRes.memoryKb && execRes.memoryKb > maxMemory) {
      maxMemory = execRes.memoryKb;
    }

    if (execRes.status === "compile_error") {
      overallVerdict = "COMPILE_ERROR";
      firstError = execRes.stderr;
      results.push(
        sanitizeTestCaseResult(
          {
            testCaseId: tc.id,
            name: tc.name,
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: execRes.output,
            error: execRes.stderr,
            executionTimeMs: execRes.executionTimeMs,
          },
          tc.visibility
        )
      );
      break; // Stop remaining tests on compile error
    }

    if (execRes.status === "time_limit_exceeded") {
      if (overallVerdict === "ACCEPTED") overallVerdict = "TIME_LIMIT_EXCEEDED";
      results.push(
        sanitizeTestCaseResult(
          {
            testCaseId: tc.id,
            name: tc.name,
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: execRes.output,
            error: "Time Limit Exceeded",
            executionTimeMs: execRes.executionTimeMs,
          },
          tc.visibility
        )
      );
      continue;
    }

    if (execRes.status === "runtime_error" || execRes.exitCode !== 0) {
      if (overallVerdict === "ACCEPTED") overallVerdict = "RUNTIME_ERROR";
      results.push(
        sanitizeTestCaseResult(
          {
            testCaseId: tc.id,
            name: tc.name,
            passed: false,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: execRes.output,
            error: execRes.stderr || "Runtime Error",
            executionTimeMs: execRes.executionTimeMs,
          },
          tc.visibility
        )
      );
      continue;
    }

    const isMatch = compareOutputs(execRes.stdout, tc.expectedOutput);
    if (!isMatch && overallVerdict === "ACCEPTED") {
      overallVerdict = "WRONG_ANSWER";
    }

    results.push(
      sanitizeTestCaseResult(
        {
          testCaseId: tc.id,
          name: tc.name,
          passed: isMatch,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: execRes.stdout || execRes.output,
          executionTimeMs: execRes.executionTimeMs,
        },
        tc.visibility
      )
    );
  }

  const passedCount = results.filter((r) => r.passed).length;

  const judgeResult: JudgeSubmissionResult = {
    verdict: overallVerdict,
    passedCount,
    totalCount: testCases.length,
    executionTimeMs: totalTime,
    memoryKb: maxMemory,
    results,
    error: firstError,
  };

  return {
    status: 200,
    body: judgeResult,
  };
}

/**
 * Server handler for GET /api/code/languages
 */
export async function handleGetLanguages() {
  const provider = getExecutionProvider();
  const available = await provider.isAvailable();

  return {
    status: 200,
    body: {
      provider: provider.name,
      available,
      languages: SUPPORTED_LANGUAGES.map((l) => ({
        id: l.id,
        name: l.name,
        version: l.version,
        route: l.route,
      })),
    },
  };
}
