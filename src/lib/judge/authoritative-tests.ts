import type { TestCase, TestCaseResult } from "./types";

export interface AuthoritativeTestCase extends TestCase {
  visibility: "public" | "hidden";
}

export const AUTHORITATIVE_TEST_REGISTRY: Record<string, AuthoritativeTestCase[]> = {
  "two-sum": [
    {
      id: "case-1",
      name: "Sample Case 1",
      input: "2 7 11 15\n9",
      expectedOutput: "[0, 1]",
      visibility: "public",
    },
    {
      id: "case-2",
      name: "Sample Case 2",
      input: "3 2 4\n6",
      expectedOutput: "[1, 2]",
      visibility: "public",
    },
    {
      id: "case-3",
      name: "Hidden Case 1 (Duplicate numbers)",
      input: "3 3\n6",
      expectedOutput: "[0, 1]",
      visibility: "hidden",
    },
    {
      id: "case-4",
      name: "Hidden Case 2 (Negative values)",
      input: "-3 4 3 90\n0",
      expectedOutput: "[0, 2]",
      visibility: "hidden",
    },
    {
      id: "case-5",
      name: "Hidden Case 3 (Large array ends)",
      input: "1 5 8 12 19 25 31 40\n41",
      expectedOutput: "[0, 7]",
      visibility: "hidden",
    },
  ],
  "valid-parentheses": [
    {
      id: "case-1",
      name: "Sample Case 1",
      input: "()",
      expectedOutput: "true",
      visibility: "public",
    },
    {
      id: "case-2",
      name: "Sample Case 2",
      input: "()[]{}",
      expectedOutput: "true",
      visibility: "public",
    },
    {
      id: "case-3",
      name: "Hidden Case 1 (Mismatched tags)",
      input: "(]",
      expectedOutput: "false",
      visibility: "hidden",
    },
    {
      id: "case-4",
      name: "Hidden Case 2 (Nested correctly)",
      input: "{[()]}",
      expectedOutput: "true",
      visibility: "hidden",
    },
    {
      id: "case-5",
      name: "Hidden Case 3 (Premature closing)",
      input: "([)]",
      expectedOutput: "false",
      visibility: "hidden",
    },
  ],
  "palindrome-number": [
    {
      id: "case-1",
      name: "Sample Case 1",
      input: "121",
      expectedOutput: "true",
      visibility: "public",
    },
    {
      id: "case-2",
      name: "Sample Case 2",
      input: "-121",
      expectedOutput: "false",
      visibility: "public",
    },
    {
      id: "case-3",
      name: "Hidden Case 1 (Trailing zero)",
      input: "10",
      expectedOutput: "false",
      visibility: "hidden",
    },
    {
      id: "case-4",
      name: "Hidden Case 2 (Single digit zero)",
      input: "0",
      expectedOutput: "true",
      visibility: "hidden",
    },
  ],
  "contains-duplicate": [
    {
      id: "case-1",
      name: "Sample Case 1",
      input: "1 2 3 1",
      expectedOutput: "true",
      visibility: "public",
    },
    {
      id: "case-2",
      name: "Sample Case 2",
      input: "1 2 3 4",
      expectedOutput: "false",
      visibility: "public",
    },
    {
      id: "case-3",
      name: "Hidden Case 1 (All distinct large)",
      input: "10 20 30 40 50",
      expectedOutput: "false",
      visibility: "hidden",
    },
    {
      id: "case-4",
      name: "Hidden Case 2 (Multiple duplicates)",
      input: "1 1 1 3 3 4 3 2 4 2",
      expectedOutput: "true",
      visibility: "hidden",
    },
  ],
};

/**
 * Retrieves authoritative test suite for a problem
 */
export function getAuthoritativeTestCases(slug: string): AuthoritativeTestCase[] {
  if (AUTHORITATIVE_TEST_REGISTRY[slug]) {
    return AUTHORITATIVE_TEST_REGISTRY[slug];
  }

  // Fallback generic test suite
  return [
    {
      id: "case-1",
      name: "Sample Case 1",
      input: "2 7 11 15\n9",
      expectedOutput: "[0, 1]",
      visibility: "public",
    },
    {
      id: "case-2",
      name: "Sample Case 2",
      input: "3 2 4\n6",
      expectedOutput: "[1, 2]",
      visibility: "public",
    },
    {
      id: "case-3",
      name: "Hidden Case 1",
      input: "3 3\n6",
      expectedOutput: "[0, 1]",
      visibility: "hidden",
    },
  ];
}

/**
 * Strips private test case data before sending to client
 */
export function sanitizeTestCaseResult(
  result: TestCaseResult,
  visibility: "public" | "hidden"
): TestCaseResult {
  if (visibility === "hidden") {
    return {
      testCaseId: result.testCaseId,
      name: result.name,
      passed: result.passed,
      input: "[Hidden Test Input]",
      expectedOutput: "[Hidden]",
      actualOutput: result.passed ? "[Hidden Output Match]" : "[Output Mismatch]",
      error: result.error,
      executionTimeMs: result.executionTimeMs,
    };
  }
  return result;
}
