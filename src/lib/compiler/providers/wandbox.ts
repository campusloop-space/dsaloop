import type {
  ExecutionProvider,
  CodeExecutionRequest,
  CodeExecutionResponse,
  ProviderLanguageInfo,
} from "./types";

const WANDBOX_COMPILERS: Record<string, string> = {
  python: "cpython-3.12.7",
  py: "cpython-3.12.7",
  cpp: "gcc-13.2.0",
  "c++": "gcc-13.2.0",
  c: "gcc-13.2.0-c",
  java: "openjdk-jdk-21+35",
  javascript: "nodejs-20.17.0",
  js: "nodejs-20.17.0",
  node: "nodejs-20.17.0",
  typescript: "typescript-5.6.2",
  ts: "typescript-5.6.2",
  go: "go-1.23.2",
  golang: "go-1.23.2",
  rust: "rust-1.82.0",
  rs: "rust-1.82.0",
};

export class WandboxProvider implements ExecutionProvider {
  name = "Wandbox";
  private apiUrl = "https://wandbox.org/api/compile.json";

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch("https://wandbox.org/api/list.json");
      return res.ok;
    } catch {
      return false;
    }
  }

  async getLanguages(): Promise<ProviderLanguageInfo[]> {
    return [
      { id: "python", name: "Python 3.12", version: "3.12.7", available: true },
      { id: "cpp", name: "C++ (GCC 13.2)", version: "13.2.0", available: true },
      { id: "c", name: "C (GCC 13.2)", version: "13.2.0", available: true },
      { id: "java", name: "Java 21 (OpenJDK)", version: "21", available: true },
      { id: "javascript", name: "JavaScript (Node.js 20)", version: "20.17.0", available: true },
      { id: "typescript", name: "TypeScript 5.6", version: "5.6.2", available: true },
      { id: "go", name: "Go 1.23", version: "1.23.1", available: true },
      { id: "rust", name: "Rust 1.82", version: "1.82.0", available: true },
    ];
  }

  async execute(req: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const normLang = req.language.toLowerCase().trim();
    const compiler = WANDBOX_COMPILERS[normLang];

    if (!compiler) {
      return {
        status: "error",
        stdout: "",
        stderr: `Language "${req.language}" is not mapped for Wandbox.`,
        output: `Language "${req.language}" is not mapped for Wandbox.`,
        exitCode: 1,
        executionTimeMs: 0,
        provider: "Wandbox",
      };
    }

    let codeToSend = req.code;
    if (normLang === "java") {
      codeToSend = codeToSend.replace(/public\s+class\s+Main\b/g, "class Main");
    }

    const payload: Record<string, unknown> = {
      compiler,
      code: codeToSend,
      stdin: req.stdin || "",
    };

    if (normLang.includes("cpp") || normLang.includes("c++")) {
      payload.options = "c++20,warning";
    }

    const startTime = Date.now();

    try {
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const elapsed = Date.now() - startTime;

      if (!res.ok) {
        throw new Error(`Wandbox execution failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      const exitCode = typeof data.status === "number" ? data.status : 0;
      const stdout = data.program_output || "";
      const stderr = [data.compiler_error, data.program_error]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (data.compiler_error) {
        return {
          status: "compile_error",
          stdout: "",
          stderr: data.compiler_error,
          output: data.compiler_error,
          exitCode: exitCode || 1,
          executionTimeMs: elapsed,
          memoryKb: 1024,
          provider: "Wandbox",
        };
      }

      if (exitCode !== 0) {
        return {
          status: "runtime_error",
          stdout,
          stderr: stderr || `Process exited with code ${exitCode}`,
          output: stdout ? `${stdout}\n${stderr}` : stderr,
          exitCode,
          executionTimeMs: elapsed,
          memoryKb: 1024,
          provider: "Wandbox",
        };
      }

      return {
        status: "success",
        stdout,
        stderr,
        output: stdout || (stderr ? `Warnings:\n${stderr}` : "Program executed with no output."),
        exitCode: 0,
        executionTimeMs: elapsed,
        memoryKb: 1024,
        provider: "Wandbox",
      };
    } catch (err: unknown) {
      return {
        status: "error",
        stdout: "",
        stderr: err instanceof Error ? err.message : "Execution failed",
        output: `Error: ${err instanceof Error ? err.message : "Execution failed"}`,
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        provider: "Wandbox",
      };
    }
  }
}
