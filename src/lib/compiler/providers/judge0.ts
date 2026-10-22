import type {
  ExecutionProvider,
  CodeExecutionRequest,
  CodeExecutionResponse,
  ProviderLanguageInfo,
} from "./types";

/**
 * Standard Judge0 Language IDs
 * Reference: https://ce.judge0.com/languages
 */
export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python: 71, // Python (3.8.1)
  py: 71,
  cpp: 54, // C++ (GCC 9.2.0)
  "c++": 54,
  c: 50, // C (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
  javascript: 63, // JavaScript (Node.js 12.14.0)
  js: 63,
  node: 63,
  typescript: 74, // TypeScript (3.7.4)
  ts: 74,
  go: 60, // Go (1.13.5)
  golang: 60,
  rust: 73, // Rust (1.40.0)
  rs: 73,
  csharp: 51, // C# (Mono 6.6.0.161)
  "c#": 51,
  ruby: 72, // Ruby (2.7.0)
  php: 68, // PHP (7.4.1)
  bash: 46, // Bash (5.0.0)
  kotlin: 78, // Kotlin (1.3.70)
  swift: 83, // Swift (5.2.3)
};

function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(b64: string | null | undefined): string {
  if (!b64) return "";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64").toString("utf-8");
  }
  return decodeURIComponent(escape(atob(b64)));
}

export class Judge0Provider implements ExecutionProvider {
  name = "Judge0";
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl =
      baseUrl ||
      (typeof process !== "undefined" && process.env?.JUDGE0_API_URL) ||
      "https://ce.judge0.com";
    this.apiKey =
      apiKey ||
      (typeof process !== "undefined" ? process.env?.JUDGE0_API_KEY : undefined);
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.apiKey) {
      // Support both RapidAPI and self-hosted auth headers
      headers["X-RapidAPI-Key"] = this.apiKey;
      headers["X-Auth-Token"] = this.apiKey;
    }

    return headers;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${this.baseUrl}/system_info`, {
        headers: this.getHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timer);
      return res.ok;
    } catch {
      return false;
    }
  }

  async getLanguages(): Promise<ProviderLanguageInfo[]> {
    try {
      const res = await fetch(`${this.baseUrl}/languages`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return [];
      const list = (await res.json()) as { id: number; name: string }[];
      return list.map((l) => ({
        id: String(l.id),
        name: l.name,
        judge0Id: l.id,
        version: l.name,
        available: true,
      }));
    } catch {
      return [];
    }
  }

  async execute(req: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const normLang = req.language.toLowerCase().trim();
    const languageId = JUDGE0_LANGUAGE_IDS[normLang];

    if (!languageId) {
      return {
        status: "error",
        stdout: "",
        stderr: `Language "${req.language}" is not supported by Judge0.`,
        output: `Language "${req.language}" is not supported by Judge0.`,
        exitCode: 1,
        executionTimeMs: 0,
        provider: "Judge0",
      };
    }

    const payload = {
      source_code: toBase64(req.code),
      language_id: languageId,
      stdin: req.stdin ? toBase64(req.stdin) : "",
      cpu_time_limit: Math.max(1, Math.min(15, Math.ceil((req.timeoutMs || 10000) / 1000))),
      wall_time_limit: Math.max(2, Math.min(20, Math.ceil((req.timeoutMs || 10000) / 1000) + 2)),
      memory_limit: req.memoryLimitKb || 256000,
    };

    const startTime = Date.now();

    // 1. Submit to Judge0 with wait=true for synchronous execution
    try {
      const submitRes = await fetch(
        `${this.baseUrl}/submissions?base64_encoded=true&wait=true`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(payload),
        }
      );

      if (!submitRes.ok) {
        const errorText = await submitRes.text();
        throw new Error(`Judge0 API error (${submitRes.status}): ${errorText}`);
      }

      let data = await submitRes.json();

      // If asynchronous (status 1: in queue or 2: processing), poll until completed
      if (data.status && (data.status.id === 1 || data.status.id === 2) && data.token) {
        data = await this.pollSubmission(data.token, req.timeoutMs || 15000);
      }

      const elapsed = Date.now() - startTime;
      return this.mapJudge0Response(data, elapsed);
    } catch (err: unknown) {
      return {
        status: "error",
        stdout: "",
        stderr: err instanceof Error ? err.message : "Judge0 execution request failed",
        output: `Error: ${err instanceof Error ? err.message : "Judge0 execution request failed"}`,
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        provider: "Judge0",
      };
    }
  }

  private async pollSubmission(token: string, maxTimeoutMs: number): Promise<any> {
    const start = Date.now();
    const intervalMs = 600;

    while (Date.now() - start < maxTimeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      const res = await fetch(
        `${this.baseUrl}/submissions/${token}?base64_encoded=true`,
        {
          headers: this.getHeaders(),
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.status.id > 2) {
          return data; // Done (3: Accepted, 4: Wrong Answer, 5: TLE, 6: Compilation Error, 7-12: Runtime Error)
        }
      }
    }

    throw new Error("Execution timed out waiting for Judge0 response.");
  }

  private mapJudge0Response(data: any, fallbackElapsed: number): CodeExecutionResponse {
    const statusId = data.status?.id;
    const statusDesc = data.status?.description || "Unknown status";

    const stdout = fromBase64(data.stdout);
    const stderr = fromBase64(data.stderr);
    const compileOutput = fromBase64(data.compile_output);
    const message = fromBase64(data.message);

    const execTime = data.time ? parseFloat(data.time) * 1000 : fallbackElapsed;
    const memory = data.memory || 1024;
    const exitCode = data.exit_code ?? (statusId === 3 ? 0 : 1);

    // Compilation error
    if (statusId === 6 || compileOutput) {
      return {
        status: "compile_error",
        stdout: "",
        stderr: compileOutput || stderr || "Compilation error",
        output: compileOutput || stderr || "Compilation error",
        exitCode: exitCode || 1,
        executionTimeMs: Math.round(execTime),
        memoryKb: memory,
        provider: "Judge0",
        rawStatusDescription: statusDesc,
      };
    }

    // Time limit exceeded
    if (statusId === 5) {
      return {
        status: "time_limit_exceeded",
        stdout,
        stderr: "Time Limit Exceeded",
        output: stdout ? `${stdout}\nTime Limit Exceeded` : "Time Limit Exceeded",
        exitCode: 124,
        executionTimeMs: Math.round(execTime),
        memoryKb: memory,
        provider: "Judge0",
        rawStatusDescription: statusDesc,
      };
    }

    // Runtime errors (7 to 12)
    if (statusId >= 7 && statusId <= 12) {
      const errDetails = [stderr, message, statusDesc].filter(Boolean).join("\n");
      return {
        status: "runtime_error",
        stdout,
        stderr: errDetails,
        output: stdout ? `${stdout}\n${errDetails}` : errDetails,
        exitCode: exitCode || 1,
        executionTimeMs: Math.round(execTime),
        memoryKb: memory,
        provider: "Judge0",
        rawStatusDescription: statusDesc,
      };
    }

    // Accepted / Normal exit
    if (statusId === 3 || exitCode === 0) {
      return {
        status: "success",
        stdout,
        stderr,
        output: stdout || (stderr ? `Warnings:\n${stderr}` : "Program executed with no output."),
        exitCode: 0,
        executionTimeMs: Math.round(execTime),
        memoryKb: memory,
        provider: "Judge0",
        rawStatusDescription: statusDesc,
      };
    }

    // Generic error fallback
    return {
      status: "error",
      stdout,
      stderr: stderr || message || statusDesc,
      output: stdout || stderr || message || statusDesc,
      exitCode: exitCode || 1,
      executionTimeMs: Math.round(execTime),
      memoryKb: memory,
      provider: "Judge0",
      rawStatusDescription: statusDesc,
    };
  }
}
