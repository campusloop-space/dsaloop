export interface LanguageDefinition {
  id: string;
  name: string;
  shortName: string;
  version: string;
  slug: string;
  route: string;
  extension: string;
  wandboxCompiler: string;
  mode: "c" | "cpp" | "python" | "java" | "javascript" | "typescript" | "go" | "rust";
  sampleStdin: string;
  starterCode: string;
  dsaStarterTemplate: (problemSlug: string, functionName?: string) => string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  faq: { question: string; answer: string }[];
  features: string[];
}

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  {
    id: "python",
    name: "Python 3",
    shortName: "Python",
    version: "3.12",
    slug: "online-python-compiler",
    route: "/online-compiler/python",
    extension: ".py",
    wandboxCompiler: "cpython-3.12.7",
    mode: "python",
    sampleStdin: "CampusLoop\n42",
    starterCode: `import sys

def main():
    # Read all lines from standard input (stdin)
    input_data = sys.stdin.read().split()
    if input_data:
        name = input_data[0]
        number = int(input_data[1]) if len(input_data) > 1 else 0
        print(f"Hello, {name}!")
        print(f"Square of {number} is {number * number}")
    else:
        print("Hello from DSALoop Online Python Compiler!")
        print("Tip: Provide input in the Standard Input tab to test stdin.")

if __name__ == "__main__":
    main()
`,
    dsaStarterTemplate: (slug: string, functionName: string = "solve") => `class Solution:
    def ${functionName}(self, *args):
        # Write your solution below:
        pass

# Test your solution:
if __name__ == "__main__":
    s = Solution()
    print("Testing solution for ${slug}...")
`,
    description:
      "Write, run, and debug Python 3 programs online in a fast, interactive editor with standard input support, real-time output, and execution metrics.",
    seoTitle: "Online Python Compiler & Runner — DSALoop by CampusLoop",
    seoDescription:
      "Run Python 3.12 code online instantly with standard input, execution time, and error diagnostics. Free, minimal, and open-source by https://campusloop.space/",
    keywords: [
      "online python compiler",
      "run python online",
      "python 3 interpreter",
      "compile python in browser",
      "python ide online",
      "dsaloop python runner",
      "campusloop",
    ],
    features: [
      "Python 3.12 with full standard library support",
      "Standard input (stdin) processing via sys.stdin or input()",
      "Execution time and memory metrics",
      "Clean syntax highlighting and error traceback display",
    ],
    faq: [
      {
        question: "How do I read standard input in the online Python compiler?",
        answer:
          "Enter your test input in the 'Standard Input' tab. In Python, read it using `sys.stdin.read()`, `sys.stdin.readline()`, or standard `input()` calls.",
      },
      {
        question: "Is this Python compiler free to use?",
        answer:
          "Yes, DSALoop's online Python compiler is 100% free and open-source, maintained by https://campusloop.space/ without requiring sign-ups.",
      },
    ],
  },
  {
    id: "cpp",
    name: "C++ (GCC)",
    shortName: "C++",
    version: "13.2",
    slug: "online-cpp-compiler",
    route: "/online-compiler/cpp",
    extension: ".cpp",
    wandboxCompiler: "gcc-13.2.0",
    mode: "cpp",
    sampleStdin: "CampusLoop 100",
    starterCode: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string name;
    int value = 0;

    if (cin >> name >> value) {
        cout << "Hello, " << name << "!" << endl;
        cout << "Double of " << value << " is " << (value * 2) << endl;
    } else {
        cout << "Hello from DSALoop Online C++ Compiler (GCC 13.2)!" << endl;
        cout << "Add input in the Standard Input tab to test cin reading." << endl;
    }

    return 0;
}
`,
    dsaStarterTemplate: (slug: string, functionName: string = "solve") => `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    void ${functionName}() {
        // Implement your solution here
    }
};

int main() {
    Solution s;
    cout << "Testing ${slug}..." << endl;
    return 0;
}
`,
    description:
      "Compile and execute modern C++ (C++20/C++23) code using GCC with instant diagnostics, stdin support, and runtime profiling.",
    seoTitle: "Online C++ Compiler (GCC 13.2) — DSALoop by CampusLoop",
    seoDescription:
      "Compile and run C++ code online with standard library support, stdin, and compiler diagnostics. Free by https://campusloop.space/",
    keywords: [
      "online cpp compiler",
      "online c++ compiler",
      "run cpp online",
      "gcc online compiler",
      "c++ ide in browser",
      "dsaloop c++ runner",
      "campusloop",
    ],
    features: [
      "Modern GCC 13.2 with C++20 and STL support",
      "Fast compilation and stdin / cin stream handling",
      "Clear compiler error diagnostics with line numbers",
      "Memory and execution speed benchmarking",
    ],
    faq: [
      {
        question: "Which version of C++ does this compiler support?",
        answer:
          "This compiler uses GCC 13.2 with support for C++17, C++20, and modern standard library algorithms.",
      },
      {
        question: "Can I use competitive programming fast I/O in this compiler?",
        answer:
          "Yes, `ios_base::sync_with_stdio(false); cin.tie(NULL);` works seamlessly with the standard input stream.",
      },
    ],
  },
  {
    id: "c",
    name: "C (GCC)",
    shortName: "C",
    version: "13.2",
    slug: "online-c-compiler",
    route: "/online-compiler/c",
    extension: ".c",
    wandboxCompiler: "gcc-13.2.0-c",
    mode: "c",
    sampleStdin: "CampusLoop 25",
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    char name[64];
    int age = 0;

    if (scanf("%63s %d", name, &age) == 2) {
        printf("Hello, %s!\n", name);
        printf("In 5 years, you will be %d years old.\n", age + 5);
    } else {
        printf("Hello from DSALoop Online C Compiler (GCC 13.2)!\n");
        printf("Provide input in the Standard Input tab to test scanf.\n");
    }

    return 0;
}
`,
    dsaStarterTemplate: (slug: string, functionName: string = "solve") => `#include <stdio.h>
#include <stdlib.h>

void ${functionName}() {
    // Write your C solution here
}

int main() {
    printf("Testing C solution for ${slug}...\n");
    return 0;
}
`,
    description:
      "Online C compiler powered by GCC. Write, compile, and debug standard C programs with pointer safety, stdin streams, and clear compile messages.",
    seoTitle: "Online C Compiler (GCC 13.2) — DSALoop by CampusLoop",
    seoDescription:
      "Compile and execute standard C code online with GCC. Test with stdin, view compiler errors, and check runtime performance. By https://campusloop.space/",
    keywords: [
      "online c compiler",
      "run c code online",
      "compile c in browser",
      "gcc c compiler online",
      "c programming playground",
      "dsaloop c compiler",
      "campusloop",
    ],
    features: [
      "Standard GCC 13.2 C compiler with C11/C17 support",
      "Full standard library support (stdio.h, stdlib.h, string.h, math.h)",
      "Standard input with scanf and fgets",
      "Zero setup required, runs directly in browser",
    ],
    faq: [
      {
        question: "How do I pass inputs to scanf in this online C compiler?",
        answer:
          "Type your input lines in the 'Standard Input' box beside or below the editor before clicking 'Run Code'.",
      },
      {
        question: "Does this C compiler report compiler warnings and errors?",
        answer:
          "Yes, GCC compilation warnings, syntax errors, and linker errors are displayed in the Output panel with exact line numbers.",
      },
    ],
  },
  {
    id: "java",
    name: "Java (OpenJDK 21)",
    shortName: "Java",
    version: "21",
    slug: "online-java-compiler",
    route: "/online-compiler/java",
    extension: ".java",
    wandboxCompiler: "openjdk-jdk-21+35",
    mode: "java",
    sampleStdin: "CampusLoop 15",
    starterCode: `import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        if (scanner.hasNext()) {
            String name = scanner.next();
            int n = scanner.hasNextInt() ? scanner.nextInt() : 10;
            System.out.println("Hello, " + name + "!");
            System.out.println("Sum of first " + n + " integers is: " + (n * (n + 1) / 2));
        } else {
            System.out.println("Hello from DSALoop Online Java Compiler (OpenJDK 21)!");
            System.out.println("Add input in the Standard Input tab to test Scanner.");
        }

        scanner.close();
    }
}
`,
    dsaStarterTemplate: (slug: string, functionName: string = "solve") => `import java.util.*;

class Solution {
    public void ${functionName}() {
        // Implement your solution here
    }
}

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println("Testing ${slug}...");
    }
}
`,
    description:
      "Write, compile, and run modern Java programs using OpenJDK 21 LTS with standard input, collection frameworks, and clear diagnostics.",
    seoTitle: "Online Java Compiler (OpenJDK 21) — DSALoop by CampusLoop",
    seoDescription:
      "Compile and execute Java 21 code online with standard input, collections, and instant output. Free & open-source by https://campusloop.space/",
    keywords: [
      "online java compiler",
      "run java online",
      "java 21 compiler",
      "openjdk online",
      "java playground browser",
      "dsaloop java runner",
      "campusloop",
    ],
    features: [
      "OpenJDK 21 LTS runtime with modern Java syntax",
      "Support for Java Collections, Streams, and standard libraries",
      "Scanner and BufferedReader stdin stream handling",
      "Clean stack trace output for runtime exceptions",
    ],
    faq: [
      {
        question: "Can I use 'public class Main' in this compiler?",
        answer:
          "Yes, either `class Main` or `public class Main` is automatically supported.",
      },
      {
        question: "Are Java Collections and Streams supported?",
        answer:
          "Yes, full `java.util.*`, `java.io.*`, and `java.util.stream.*` packages are supported.",
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript (Node 20)",
    shortName: "JavaScript",
    version: "20.x",
    slug: "online-javascript-compiler",
    route: "/online-compiler/javascript",
    extension: ".js",
    wandboxCompiler: "nodejs-20.17.0",
    mode: "javascript",
    sampleStdin: "CampusLoop\n123",
    starterCode: `const fs = require("fs");

function main() {
    try {
        const input = fs.readFileSync(0, "utf-8").trim();
        if (input) {
            const lines = input.split(/\\r?\\n/);
            console.log("Input received:", lines);
            console.log("Processed:", lines.map((l, i) => \`Line \${i + 1}: \${l.toUpperCase()}\`));
        } else {
            console.log("Hello from DSALoop Online JavaScript Compiler (Node 20)!");
            console.log("Tip: Run code directly or test standard input.");
        }
    } catch {
        console.log("Hello from DSALoop Online JavaScript Compiler!");
    }
}

main();
`,
    dsaStarterTemplate: (slug: string, functionName: string = "solve") => `/**
 * @param {...any} args
 * @return {any}
 */
var ${functionName} = function(...args) {
    // Implement your solution here
};

// Test:
console.log("Testing ${slug}...");
`,
    description:
      "Fast online JavaScript execution using Node.js 20 with ES6+ features, standard input reading, and formatted console logging.",
    seoTitle: "Online JavaScript Compiler (Node 20) — DSALoop by CampusLoop",
    seoDescription:
      "Run modern JavaScript (ES6+ / Node 20) online in browser with console output, stdin, and error stack traces. Free by https://campusloop.space/",
    keywords: [
      "online javascript compiler",
      "run js online",
      "node js online compiler",
      "javascript playground",
      "es6 online runner",
      "dsaloop js runner",
      "campusloop",
    ],
    features: [
      "Node.js 20 runtime with modern ES2024 features",
      "Instant execution with console.log, console.error, and tables",
      "Standard input support via fs.readFileSync(0)",
      "Detailed syntax error and call-stack diagnostics",
    ],
    faq: [
      {
        question: "Can I use modern async/await and promises in this compiler?",
        answer:
          "Yes, modern ES2024 syntax including async/await, optional chaining, and arrow functions are supported natively.",
      },
      {
        question: "How do I read input in Node.js on this compiler?",
        answer:
          "Use `const fs = require('fs'); const input = fs.readFileSync(0, 'utf-8');` to read the stdin buffer.",
      },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript (5.6)",
    shortName: "TypeScript",
    version: "5.6",
    slug: "online-typescript-compiler",
    route: "/online-compiler/typescript",
    extension: ".ts",
    wandboxCompiler: "typescript-5.6.2",
    mode: "typescript",
    sampleStdin: "CampusLoop",
    starterCode: `interface Student {
    name: string;
    role: string;
    score: number;
}

function greet(student: Student): string {
    return \`Hello \${student.name}! Role: \${student.role}, Score: \${student.score}\`;
}

const user: Student = {
    name: "CampusLoop Engineer",
    role: "DSA Practitioner",
    score: 100,
};

console.log(greet(user));
console.log("TypeScript 5.6 compiled and executed successfully!");
`,
    dsaStarterTemplate: (slug: string, functionName: string = "solve") => `function ${functionName}(...args: any[]): any {
    // Implement your TypeScript solution
}

console.log("Testing ${slug}...");
`,
    description:
      "Type-checked TypeScript playground running version 5.6. Write interfaces, generics, and modern TS code with instant compilation.",
    seoTitle: "Online TypeScript Compiler (TS 5.6) — DSALoop by CampusLoop",
    seoDescription:
      "Compile and execute TypeScript 5.6 online with type checking, ES6 features, and instant output. Free by https://campusloop.space/",
    keywords: [
      "online typescript compiler",
      "run typescript online",
      "typescript playground",
      "ts compiler in browser",
      "dsaloop typescript",
      "campusloop",
    ],
    features: [
      "TypeScript 5.6 with strict type checking",
      "Full support for interfaces, types, enums, and generics",
      "Clear compiler error messages with line and column positions",
      "Seamless execution via Node.js runtime",
    ],
    faq: [
      {
        question: "Does this compiler check TypeScript types before execution?",
        answer:
          "Yes, the TypeScript compiler verifies all types and reports type errors before running the code.",
      },
      {
        question: "Can I use standard ES module imports or interfaces?",
        answer:
          "Yes, interfaces, type aliases, and standard libraries are fully supported.",
      },
    ],
  },
  {
    id: "go",
    name: "Go (1.23)",
    shortName: "Go",
    version: "1.23",
    slug: "online-go-compiler",
    route: "/online-compiler/go",
    extension: ".go",
    wandboxCompiler: "go-1.23.2",
    mode: "go",
    sampleStdin: "CampusLoop 7",
    starterCode: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	if scanner.Scan() {
		parts := strings.Fields(scanner.Text())
		if len(parts) >= 2 {
			name := parts[0]
			n, _ := strconv.Atoi(parts[1])
			fmt.Printf("Hello, %s!\n", name)
			fmt.Printf("Fibonacci(%d) test...\n", n)
		} else {
			fmt.Println("Hello,", scanner.Text())
		}
	} else {
		fmt.Println("Hello from DSALoop Online Go Compiler (Go 1.23)!")
		fmt.Println("Add input in the Standard Input tab to test bufio.Scanner.")
	}
}
`,
    dsaStarterTemplate: (slug: string, functionName: string = "Solve") => `package main

import "fmt"

func ${functionName}() {
    // Implement your Go solution
}

func main() {
    fmt.Println("Testing ${slug}...")
}
`,
    description:
      "Compile and run Go programs online using Go 1.23 with goroutines, slices, maps, standard I/O, and fast execution times.",
    seoTitle: "Online Go Compiler (Go 1.23) — DSALoop by CampusLoop",
    seoDescription:
      "Run Golang code online with Go 1.23 compiler, standard library, and stdin support. Free by https://campusloop.space/",
    keywords: [
      "online go compiler",
      "golang online compiler",
      "run go online",
      "go playground browser",
      "dsaloop go runner",
      "campusloop",
    ],
    features: [
      "Official Go 1.23 release with generics and modern runtime",
      "Standard library support including fmt, strings, sort, and bufio",
      "Instant compilation and fast binary execution",
      "Formatted compiler output and panic stack traces",
    ],
    faq: [
      {
        question: "Can I use goroutines in this online Go compiler?",
        answer:
          "Yes, goroutines and channels are supported for concurrent algorithms.",
      },
      {
        question: "How do I format inputs for Go programs?",
        answer:
          "Use the Standard Input tab and read with `bufio.NewScanner(os.Stdin)` or `fmt.Scanf`.",
      },
    ],
  },
  {
    id: "rust",
    name: "Rust (1.82)",
    shortName: "Rust",
    version: "1.82",
    slug: "online-rust-compiler",
    route: "/online-compiler/rust",
    extension: ".rs",
    wandboxCompiler: "rust-1.82.0",
    mode: "rust",
    sampleStdin: "CampusLoop",
    starterCode: `use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    if io::stdin().read_to_string(&mut input).is_ok() && !input.trim().is_empty() {
        let name = input.trim();
        println!("Hello, {}!", name);
        println!("Welcome to safe, zero-cost abstractions with Rust!");
    } else {
        println!("Hello from DSALoop Online Rust Compiler (Rust 1.82)!");
        println!("Provide input in the Standard Input tab to test stdin.");
    }
}
`,
    dsaStarterTemplate: (slug: string, functionName: string = "solve") => `struct Solution;

impl Solution {
    pub fn ${functionName}() {
        // Implement your Rust solution
    }
}

fn main() {
    println!("Testing ${slug}...");
}
`,
    description:
      "Compile and test Rust 1.82 code online with the official rustc compiler. Memory safety, borrow checker diagnostics, and zero-cost performance.",
    seoTitle: "Online Rust Compiler (Rust 1.82) — DSALoop by CampusLoop",
    seoDescription:
      "Compile and run Rust code online with rustc 1.82, borrow checker diagnostics, and stdin support. Free by https://campusloop.space/",
    keywords: [
      "online rust compiler",
      "run rust online",
      "rustc online playground",
      "rust in browser",
      "dsaloop rust",
      "campusloop",
    ],
    features: [
      "Latest stable Rust 1.82 compiler with 2021 edition",
      "Borrow checker and lifetime compiler diagnostics",
      "Standard library collections (Vec, HashMap, BTreeMap, etc.)",
      "Detailed compiler error explanations and hints",
    ],
    faq: [
      {
        question: "Does this compiler show rustc's helpful compiler suggestions?",
        answer:
          "Yes, full colored compiler messages with hints and suggested fixes are displayed in the Output panel.",
      },
      {
        question: "Can I use standard library data structures?",
        answer:
          "Yes, standard collections like `Vec`, `HashMap`, `HashSet`, and `BinaryHeap` are available out of the box.",
      },
    ],
  },
];

export function getLanguageById(id: string): LanguageDefinition | undefined {
  const norm = id.toLowerCase().trim();
  return SUPPORTED_LANGUAGES.find(
    (l) =>
      l.id === norm ||
      l.shortName.toLowerCase() === norm ||
      l.slug === norm ||
      l.route === norm ||
      `/online-compiler/${l.id}` === norm ||
      `/online-${l.id}-compiler` === norm
  );
}

export function getLanguageBySlug(slug: string): LanguageDefinition | undefined {
  const norm = slug.toLowerCase().trim();
  return SUPPORTED_LANGUAGES.find(
    (l) => l.slug === norm || l.route === norm || l.id === norm || `/online-compiler/${l.id}` === norm
  );
}
