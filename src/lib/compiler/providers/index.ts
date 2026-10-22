import type { ExecutionProvider } from "./types";
import { Judge0Provider } from "./judge0";
import { WandboxProvider } from "./wandbox";

export * from "./types";
export * from "./judge0";
export * from "./wandbox";

let activeProvider: ExecutionProvider | null = null;

export function getExecutionProvider(): ExecutionProvider {
  if (activeProvider) return activeProvider;

  const prefer =
    (typeof process !== "undefined" && process.env?.EXECUTION_PROVIDER?.toLowerCase()) || "auto";

  if (prefer === "wandbox") {
    activeProvider = new WandboxProvider();
    return activeProvider;
  }

  // If Judge0 API URL or Key is configured, use Judge0
  if (
    typeof process !== "undefined" &&
    (process.env?.JUDGE0_API_KEY || process.env?.JUDGE0_API_URL)
  ) {
    activeProvider = new Judge0Provider();
    return activeProvider;
  }

  // Default to Wandbox for immediate zero-config public execution, while fully supporting Judge0
  activeProvider = new WandboxProvider();
  return activeProvider;
}

export function setExecutionProvider(provider: ExecutionProvider) {
  activeProvider = provider;
}
