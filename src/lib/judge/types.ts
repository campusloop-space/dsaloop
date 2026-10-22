export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  isCustom?: boolean;
}

export type JudgeVerdict =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILE_ERROR"
  | "INTERNAL_ERROR";

export interface TestCaseResult {
  testCaseId: string;
  name: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  executionTimeMs: number;
}

export interface JudgeSubmissionResult {
  verdict: JudgeVerdict;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  memoryKb: number;
  results: TestCaseResult[];
  rawOutput?: string;
  error?: string;
}
