import type { ExecutionProvider } from "./types";
import { Judge0Provider } from "./judge0";
import { WandboxProvider } from "./wandbox";
import { SelfHostedProvider } from "./self-hosted";

export * from "./types";
export * from "./judge0";
export * from "./wandbox";
export * from "./self-hosted";

let activeProvider: ExecutionProvider | null = null;

export function getExecutionProvider(): ExecutionProvider {
  if (activeProvider) return activeProvider;

  const prefer =
    (typeof process !== "undefined" && process.env?.EXECUTION_PROVIDER?.toLowerCase()) || "self-hosted";

  if (prefer === "wandbox") {
    activeProvider = new WandboxProvider();
    return activeProvider;
  }

  if (prefer === "judge0" || (typeof process !== "undefined" && process.env?.JUDGE0_API_KEY)) {
    activeProvider = new Judge0Provider();
    return activeProvider;
  }

  // Primary Default: Self-Hosted isolated sandbox execution in the codebase!
  activeProvider = new SelfHostedProvider();
  return activeProvider;
}

export function setExecutionProvider(provider: ExecutionProvider) {
  activeProvider = provider;
}
