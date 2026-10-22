import type { Problem } from "@/lib/schema/types";

export interface MethodSignature {
  name: string;
  pyArgs: string;
  docstring?: string;
  cppRet: string;
  cppArgs: string;
}

/**
 * Extracts method signature (name, arguments, return type) from the problem's solution code.
 */
export function extractMethodSignature(problem: Problem): MethodSignature {
  const pyCode = problem.solutions?.python?.code || "";
  const cppCode = problem.solutions?.cpp?.code || "";

  let name = "";
  let pyArgs = "self";
  let docstring = "";
  let cppRet = "void";
  let cppArgs = "";

  // 1. Python solution extraction
  if (pyCode) {
    const classIdx = pyCode.indexOf("class Solution");
    if (classIdx !== -1) {
      const fromClass = pyCode.slice(classIdx);
      const matches = [...fromClass.matchAll(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):([\s\S]*?)(?=\n    def\s|\nclass\s|$)/g)];
      for (const m of matches) {
        if (m[1] !== "__init__") {
          name = m[1];
          pyArgs = m[2].trim();
          const docM = m[3].match(/(\s*"""[\s\S]*?""")/);
          if (docM) docstring = docM[1].trim();
          break;
        }
      }
    }
  }

  // 2. C++ solution extraction
  if (cppCode) {
    const classIdx = cppCode.indexOf("class Solution");
    if (classIdx !== -1) {
      const fromClass = cppCode.slice(classIdx);
      const matches = [...fromClass.matchAll(/(?:public:\s*)?([a-zA-Z0-9_<>,: *&]+)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g)];
      for (const m of matches) {
        if (m[2] !== "Solution") {
          if (!name) name = m[2].trim();
          cppRet = m[1].trim().replace(/^public:\s*/, "");
          cppArgs = m[3].trim();
          break;
        }
      }
    }
  }

  // 3. Fallback based on slug if not parsed from code
  if (!name) {
    name = problem.slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    pyArgs = "self";
    cppRet = "void";
    cppArgs = "";
  }

  return { name, pyArgs, docstring, cppRet, cppArgs };
}

/**
 * Generates clean starter template containing only the function signature,
 * NOT the full solution implementation.
 */
export function getProblemStarterTemplate(problem: Problem, langId: string): string {
  const norm = langId.toLowerCase();
  const sig = extractMethodSignature(problem);

  if (norm.includes("python") || norm === "py") {
    const doc = sig.docstring ? `\n        ${sig.docstring.split("\n").join("\n        ")}\n` : "\n";
    return `class Solution:\n    def ${sig.name}(${sig.pyArgs}):${doc}        # Write your code here\n        pass\n`;
  }

  if (norm === "c") {
    return `/**\n * Solution for ${problem.title}\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* ${sig.name}(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 0;\n    // Write your C solution here\n    return NULL;\n}\n`;
  }

  if (norm.includes("cpp") || norm.includes("c++")) {
    const helperClasses = sig.cppArgs.includes("ListNode") || sig.cppRet.includes("ListNode")
      ? `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\n\n`
      : sig.cppArgs.includes("TreeNode") || sig.cppRet.includes("TreeNode")
      ? `/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}\n * };\n */\n\n`
      : "";

    return `${helperClasses}class Solution {\npublic:\n    ${sig.cppRet} ${sig.name}(${sig.cppArgs}) {\n        // Write your solution here\n        \n    }\n};\n`;
  }

  if (norm.includes("java")) {
    const helperClasses = sig.cppArgs.includes("ListNode") || sig.cppRet.includes("ListNode")
      ? `/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; }\n * }\n */\n\n`
      : "";

    // Map cppRet to Java type approximation
    let javaRet = sig.cppRet.replace("vector<int>", "int[]").replace("vector<string>", "String[]").replace("string", "String").replace("bool", "boolean");
    if (javaRet === "void") javaRet = "int[]";

    let javaArgs = sig.cppArgs
      .replace(/vector<int>&?/g, "int[]")
      .replace(/vector<string>&?/g, "String[]")
      .replace(/string&?/g, "String")
      .replace(/bool&?/g, "boolean")
      .replace(/&/g, "");

    return `${helperClasses}class Solution {\n    public ${javaRet} ${sig.name}(${javaArgs || ""}) {\n        // Write your solution here\n        \n    }\n}\n`;
  }

  if (norm.includes("javascript") || norm === "js") {
    const cleanArgs = sig.pyArgs
      .split(",")
      .map((a) => a.trim().split(":")[0].trim())
      .filter((a) => a && a !== "self")
      .join(", ");

    return `/**\n * @param {any} input\n * @return {any}\n */\nvar ${sig.name} = function(${cleanArgs}) {\n    // Write your solution here\n};\n`;
  }

  if (norm.includes("typescript") || norm === "ts") {
    const cleanArgs = sig.pyArgs
      .split(",")
      .map((a) => a.trim().split(":")[0].trim())
      .filter((a) => a && a !== "self")
      .map((a) => `${a}: any`)
      .join(", ");

    return `function ${sig.name}(${cleanArgs}): any {\n    // Write your solution here\n}\n`;
  }

  if (norm.includes("go")) {
    return `package main\n\nfunc ${sig.name}() {\n    // Write your solution here\n}\n`;
  }

  if (norm.includes("rust") || norm === "rs") {
    // snake_case
    const rustName = sig.name.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
    return `impl Solution {\n    pub fn ${rustName}() {\n        // Write your solution here\n    }\n}\n`;
  }

  return `// Starter code for ${problem.title}\n`;
}
