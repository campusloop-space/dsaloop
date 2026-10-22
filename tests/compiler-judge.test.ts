import { SUPPORTED_LANGUAGES, getLanguageById } from "../src/lib/compiler/languages";
import { normalizeOutput, compareOutputs } from "../src/lib/judge/runner";
import { hasExecutableMain, wrapWithHarness } from "../src/lib/judge/harness";
import {
  AUTHORITATIVE_TEST_REGISTRY,
  getAuthoritativeTestCases,
  sanitizeTestCaseResult,
} from "../src/lib/judge/authoritative-tests";
import { RunCodeSchema, SubmitCodeSchema } from "../src/lib/api/code-handlers";
import { JUDGE0_LANGUAGE_IDS } from "../src/lib/compiler/providers/judge0";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failedCount++;
  }
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("🚀 DSALoop Online Compiler & Judge — Automated Test Suite");
  console.log("=======================================================\n");

  // 1. Language Registry Tests
  console.log("1. Testing Language Registry & Metadata:");
  assert(SUPPORTED_LANGUAGES.length >= 8, "Registry contains at least 8 core languages");
  const python = getLanguageById("python");
  assert(Boolean(python && python.id === "python" && (python.route === "/online-compiler/python" || python.route === "/online-python-compiler")), "Python definition is valid");
  const cpp = getLanguageById("cpp");
  assert(Boolean(cpp && cpp.wandboxCompiler && (cpp.route === "/online-compiler/cpp" || cpp.route === "/online-cpp-compiler")), "C++ definition is valid");
  const java = getLanguageById("java");
  assert(Boolean(java && java.extension === ".java"), "Java definition is valid");
  const rust = getLanguageById("rust");
  assert(Boolean(rust && rust.slug === "online-rust-compiler"), "Rust definition is valid");

  // Verify Judge0 language ID mappings
  console.log("\n2. Testing Judge0 Language IDs:");
  assert(JUDGE0_LANGUAGE_IDS["python"] === 71, "Python maps to Judge0 ID 71");
  assert(JUDGE0_LANGUAGE_IDS["cpp"] === 54, "C++ maps to Judge0 ID 54");
  assert(JUDGE0_LANGUAGE_IDS["c"] === 50, "C maps to Judge0 ID 50");
  assert(JUDGE0_LANGUAGE_IDS["java"] === 62, "Java maps to Judge0 ID 62");
  assert(JUDGE0_LANGUAGE_IDS["javascript"] === 63, "JavaScript maps to Judge0 ID 63");
  assert(JUDGE0_LANGUAGE_IDS["rust"] === 73, "Rust maps to Judge0 ID 73");

  // 3. Schema & Validation Tests
  console.log("\n3. Testing Request Validation Schemas (Zod):");
  const validRun = RunCodeSchema.safeParse({
    language: "python",
    code: "print('hello')",
    stdin: "test",
  });
  assert(validRun.success, "Valid RunCode payload passes validation");

  const invalidRun = RunCodeSchema.safeParse({
    language: "python",
    code: "", // Empty code not allowed
  });
  assert(!invalidRun.success, "Empty code payload is rejected");

  const oversizedCode = RunCodeSchema.safeParse({
    language: "python",
    code: "x".repeat(70000), // Exceeds 64KB
  });
  assert(!oversizedCode.success, "Code exceeding 64KB is safely rejected");

  const validSubmit = SubmitCodeSchema.safeParse({
    slug: "two-sum",
    language: "python",
    code: "class Solution: pass",
  });
  assert(validSubmit.success, "Valid SubmitCode payload passes validation");

  // 4. Output Comparison & Normalization Tests
  console.log("\n4. Testing Output Comparison & Normalization:");
  assert(compareOutputs("42\n", "42"), "Trailing newline is normalized");
  assert(compareOutputs("  hello \r\n", "hello"), "CRLF and surrounding whitespace normalized");
  assert(compareOutputs("[0, 1]\n", "[0, 1]"), "Array string output compared accurately");
  assert(compareOutputs("[ 0, 1 ]", "[0,1]"), "JSON array whitespace variations match");
  assert(!compareOutputs("[0, 2]", "[0, 1]"), "Different outputs do not match");

  // 5. Mode B Function-based Test Harness Tests
  console.log("\n5. Testing Test Harness Generation:");
  const completeMainCode = `
#include <iostream>
int main() {
    std::cout << 42 << std::endl;
    return 0;
}
  `;
  assert(hasExecutableMain("cpp", completeMainCode), "hasExecutableMain correctly detects C++ main");

  const solutionOnlyCode = `
class Solution:
    def twoSum(self, nums, target):
        return [0, 1]
  `;
  assert(!hasExecutableMain("python", solutionOnlyCode), "hasExecutableMain correctly detects function-based code lacking main");

  const wrappedPython = wrapWithHarness("two-sum", "python", solutionOnlyCode);
  assert(wrappedPython.includes('if __name__ == "__main__":'), "Harness adds main runner for Python Solution class");
  assert(wrappedPython.includes("sys.stdin.read"), "Harness adds stdin reader");

  // 6. Authoritative Hidden Test Cases & Sanitization Tests
  console.log("\n6. Testing Authoritative Tests & Security Sanitization:");
  const twoSumCases = getAuthoritativeTestCases("two-sum");
  assert(twoSumCases.length >= 3, "Authoritative test suite contains multiple cases");
  const hiddenCase = twoSumCases.find((c) => c.visibility === "hidden");
  assert(Boolean(hiddenCase), "Test suite contains hidden test cases");

  if (hiddenCase) {
    const rawResult = {
      testCaseId: hiddenCase.id,
      name: hiddenCase.name,
      passed: true,
      input: hiddenCase.input,
      expectedOutput: hiddenCase.expectedOutput,
      actualOutput: "[0, 1]",
      executionTimeMs: 12,
    };
    const sanitized = sanitizeTestCaseResult(rawResult, "hidden");
    assert(sanitized.input === "[Hidden Test Input]", "Hidden test input is obscured from client");
    assert(sanitized.expectedOutput === "[Hidden]", "Hidden test expected output is protected from client");
    assert(sanitized.passed === true, "Verdict status is preserved");
  }

  // Final Summary
  console.log("\n=======================================================");
  console.log(`Test Results: ${passedCount} passed, ${failedCount} failed`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
