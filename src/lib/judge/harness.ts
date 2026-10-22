/**
 * Mode B: Function-based DSA Test Harness Generator
 * Wraps LeetCode-style Solution classes/functions with stdin runners.
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
    return code.includes("readline") || code.includes("process.stdin") || code.includes("console.log(");
  }
  if (norm.includes("go")) {
    return /func\s+main\s*\(/.test(code);
  }
  if (norm.includes("rust") || norm === "rs") {
    return /fn\s+main\s*\(/.test(code);
  }
  return false;
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
    if not raw_input:
        sys.exit(0)
    
    sol = Solution() if 'Solution' in globals() else None
    
    # Try calling available method on Solution
    if sol:
        # Find non-dunder method
        methods = [m for m in dir(sol) if not m.startswith('_') and callable(getattr(sol, m))]
        if methods:
            target_method = getattr(sol, methods[0])
            lines = [l.strip() for l in raw_input.splitlines() if l.strip()]
            
            args = []
            for line in lines:
                try:
                    args.append(json.loads(line))
                except Exception:
                    # Parse space-separated numbers or strings
                    parts = line.split()
                    try:
                        args.append([int(p) for p in parts] if len(parts) > 1 else int(parts[0]))
                    except Exception:
                        args.append(line)
            
            try:
                res = target_method(*args)
                if isinstance(res, (dict, list)):
                    print(json.dumps(res))
                elif isinstance(res, bool):
                    print(str(res).lower())
                else:
                    print(res)
            except TypeError:
                # Fallback: pass raw single argument or list
                try:
                    res = target_method(args[0] if len(args) == 1 else args)
                    print(res)
                except Exception as e:
                    sys.stderr.write(f"Runner invocation error: {e}\\n")
                    sys.exit(1)
`;
  }

  // C++ Harness
  if (norm.includes("cpp") || norm.includes("c++")) {
    return `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <unordered_map>
#include <algorithm>

using namespace std;

${userCode}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    Solution solver;
    // Reads input lines from stdin
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        vector<int> nums;
        int val;
        while (ss >> val) nums.push_back(val);
        
        int target = 0;
        if (cin >> target) {
            // Two sum style invocation
            vector<int> res = solver.twoSum(nums, target);
            cout << "[" << (res.size() > 0 ? res[0] : 0) << ", " << (res.size() > 1 ? res[1] : 0) << "]" << endl;
            return 0;
        }
    }
    return 0;
}
`;
  }

  // JavaScript / Node Harness
  if (norm.includes("javascript") || norm.includes("typescript") || norm === "js" || norm === "ts") {
    return `${userCode}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const lines = input.split('\\n').filter(Boolean);
    const nums = lines[0].split(/\\s+/).map(Number);
    const target = lines[1] ? Number(lines[1]) : undefined;
    
    if (typeof twoSum === 'function') {
        console.log(JSON.stringify(twoSum(nums, target)));
    } else if (typeof Solution === 'function') {
        const s = new Solution();
        const fn = Object.getOwnPropertyNames(Solution.prototype).find(p => p !== 'constructor');
        if (fn && typeof s[fn] === 'function') {
            console.log(JSON.stringify(s[fn](nums, target)));
        }
    }
}
`;
  }

  return userCode;
}
