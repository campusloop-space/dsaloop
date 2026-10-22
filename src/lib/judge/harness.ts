/**
 * Mode B: Function-based DSA Test Harness Generator
 * Wraps LeetCode-style Solution classes/functions with stdin runners dynamically.
 */

export function hasExecutableMain(language: string, code: string): boolean {
  const norm = language.toLowerCase();
  if (norm.includes("python") || norm === "py") {
    return code.includes('if __name__ == "__main__"') || code.includes("sys.stdin");
  }
  if (norm.includes("cpp") || norm.includes("c++") || norm === "c") {
    return /int\s+main\s*\(/.test(code);
  }
  if (norm.includes("java")) {
    return /public\s+static\s+void\s+main\s*\(/.test(code);
  }
  if (norm.includes("javascript") || norm.includes("typescript") || norm === "js" || norm === "ts") {
    return code.includes("readline") || code.includes("process.stdin");
  }
  if (norm.includes("go")) {
    return /func\s+main\s*\(/.test(code);
  }
  if (norm.includes("rust") || norm === "rs") {
    return /fn\s+main\s*\(/.test(code);
  }
  return false;
}

function parseCppMethod(code: string): { ret: string; name: string; args: string } | null {
  const classIdx = code.indexOf("class Solution");
  if (classIdx === -1) return null;
  const fromClass = code.slice(classIdx);
  const m = fromClass.match(/(?:public:\s*)?([a-zA-Z0-9_<>,: *&]+)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/);
  if (!m || m[2] === "Solution") return null;
  return {
    ret: m[1].trim().replace(/^public:\s*/, ""),
    name: m[2].trim(),
    args: m[3].trim(),
  };
}

export function wrapWithHarness(
  slug: string,
  language: string,
  userCode: string
): string {
  // If user code already has stdin/main runner, don't modify it
  if (hasExecutableMain(language, userCode)) {
    return userCode;
  }

  const norm = language.toLowerCase();

  // Python Harness
  if (norm.includes("python") || norm === "py") {
    return `${userCode}

import sys, json

if __name__ == "__main__":
    raw_input = sys.stdin.read().strip()
    sol = Solution() if 'Solution' in globals() else None
    
    if sol:
        # Find all public methods
        methods = [m for m in dir(sol) if not m.startswith('_') and callable(getattr(sol, m))]
        if methods:
            # Prefer method that matches problem slug or first defined method
            slug_clean = "${slug}".replace("-", "").lower()
            target_name = next((m for m in methods if m.lower() == slug_clean or m.lower() in slug_clean or slug_clean in m.lower()), methods[0])
            target_method = getattr(sol, target_name)
            
            lines = [l.strip() for l in raw_input.splitlines() if l.strip()]
            args = []
            for line in lines:
                try:
                    args.append(json.loads(line))
                except Exception:
                    parts = line.split()
                    try:
                        args.append([int(p) for p in parts] if len(parts) > 1 else int(parts[0]))
                    except Exception:
                        args.append(line)
            
            try:
                if len(args) == 0:
                    res = target_method()
                else:
                    try:
                        res = target_method(*args)
                    except TypeError:
                        res = target_method(args[0] if len(args) == 1 else args)
                
                if res is not None:
                    if isinstance(res, (dict, list)):
                        print(json.dumps(res))
                    elif isinstance(res, bool):
                        print(str(res).lower())
                    else:
                        print(res)
                elif len(args) > 0 and isinstance(args[0], list):
                    # In-place array modification
                    print(json.dumps(args[0]))
            except Exception as e:
                sys.stderr.write(f"Runner invocation error: {e}\\n")
                sys.exit(1)
`;
  }

  // C++ Harness
  if (norm.includes("cpp") || norm.includes("c++")) {
    const parsed = parseCppMethod(userCode);
    const methodName = parsed?.name || "solve";
    const retType = parsed?.ret || "void";
    const args = parsed?.args || "";

    const hasVectorArg = args.includes("vector<int>");
    const hasIntArg = args.includes("int ") || args.endsWith("int");
    const hasStringArg = args.includes("string");
    const isMultiArg = args.includes(",");

    let readLogic = "";
    let callExpr = "";
    let printLogic = "";

    if (hasVectorArg && isMultiArg && hasIntArg) {
      // Like twoSum(nums, target)
      readLogic = `
    string line;
    vector<int> nums;
    if (getline(cin, line)) {
        stringstream ss(line);
        int val;
        while (ss >> val) nums.push_back(val);
    }
    int target = 0;
    cin >> target;
      `;
      callExpr = `solver.${methodName}(nums, target)`;
    } else if (hasVectorArg) {
      readLogic = `
    string line;
    vector<int> nums;
    if (getline(cin, line)) {
        stringstream ss(line);
        int val;
        while (ss >> val) nums.push_back(val);
    }
      `;
      callExpr = `solver.${methodName}(nums)`;
    } else if (hasStringArg) {
      readLogic = `
    string s;
    getline(cin, s);
      `;
      callExpr = `solver.${methodName}(s)`;
    } else if (hasIntArg) {
      readLogic = `
    long long x = 0;
    cin >> x;
      `;
      callExpr = `solver.${methodName}(x)`;
    } else {
      callExpr = `solver.${methodName}()`;
    }

    if (retType.includes("vector")) {
      printLogic = `
    cout << "[";
    for (size_t i = 0; i < res.size(); ++i) {
        if (i > 0) cout << ", ";
        cout << res[i];
    }
    cout << "]" << endl;
      `;
    } else if (retType === "bool") {
      printLogic = `cout << (res ? "true" : "false") << endl;`;
    } else if (retType !== "void") {
      printLogic = `cout << res << endl;`;
    }

    return `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <queue>
#include <stack>
#include <cmath>

using namespace std;

${userCode}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    Solution solver;
    ${readLogic}
    ${retType !== "void" ? `auto res = ${callExpr};` : `${callExpr};`}
    ${printLogic}
    return 0;
}
`;
  }

  // C Harness
  if (norm === "c") {
    const cMatch = userCode.match(/([a-zA-Z0-9_*]+)\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/);
    const cMethod = cMatch ? cMatch[2] : "twoSum";

    return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${userCode}

int main() {
    int nums[2048];
    int n = 0;
    char line[4096];
    if (fgets(line, sizeof(line), stdin)) {
        char *token = strtok(line, " \\t\\r\\n[],");
        while (token && n < 2048) {
            nums[n++] = atoi(token);
            token = strtok(NULL, " \\t\\r\\n[],");
        }
    }
    int target = 0;
    if (scanf("%d", &target) == 1) {
        int returnSize = 0;
        int* res = ${cMethod}(nums, n, target, &returnSize);
        if (res && returnSize > 0) {
            printf("[");
            for (int i = 0; i < returnSize; i++) {
                if (i > 0) printf(", ");
                printf("%d", res[i]);
            }
            printf("]\\n");
            free(res);
        }
    }
    return 0;
}
`;
  }

  // JavaScript / Node Harness
  if (norm.includes("javascript") || norm.includes("typescript") || norm === "js" || norm === "ts") {
    const fnMatch = userCode.match(/(?:function|var|let|const)\s+([a-zA-Z0-9_]+)/);
    const targetFn = fnMatch ? fnMatch[1] : "";

    return `${userCode}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const lines = input.split('\\n').filter(Boolean);
    const args = [];
    for (const line of lines) {
        try {
            args.push(JSON.parse(line));
        } catch {
            const parts = line.split(/\\s+/);
            const nums = parts.map(Number);
            args.push(nums.some(isNaN) ? line : (nums.length > 1 ? nums : nums[0]));
        }
    }
    
    if (typeof Solution === 'function') {
        const s = new Solution();
        const fnNames = Object.getOwnPropertyNames(Solution.prototype).filter(p => p !== 'constructor' && typeof s[p] === 'function');
        if (fnNames.length > 0) {
            const res = s[fnNames[0]](...args);
            if (res !== undefined) console.log(JSON.stringify(res));
        }
    } else {
        let fnToCall = null;
        try {
            if ("${targetFn}" && typeof eval("${targetFn}") === 'function') {
                fnToCall = eval("${targetFn}");
            }
        } catch {}

        if (fnToCall) {
            const res = fnToCall(...args);
            if (res !== undefined) console.log(JSON.stringify(res));
        }
    }
}
`;
  }

  return userCode;
}
