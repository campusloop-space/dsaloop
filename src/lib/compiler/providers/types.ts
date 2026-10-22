export interface CodeExecutionRequest {
  language: string;
  code: string;
  stdin?: string;
  timeoutMs?: number;
  memoryLimitKb?: number;
}

export type ExecutionStatus =
  | "success"
  | "compile_error"
  | "runtime_error"
  | "time_limit_exceeded"
  | "memory_limit_exceeded"
  | "error";

export interface CodeExecutionResponse {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  output: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb?: number;
  provider: string;
  rawStatusDescription?: string;
}

export interface ProviderLanguageInfo {
  id: string;
  name: string;
  judge0Id?: number;
  version: string;
  available: boolean;
}

export interface ExecutionProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  execute(req: CodeExecutionRequest): Promise<CodeExecutionResponse>;
  getLanguages(): Promise<ProviderLanguageInfo[]>;
}
