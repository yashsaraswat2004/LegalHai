export class ProviderError extends Error {
  readonly status: number;
  readonly body: string;
  readonly retryable: boolean;
  readonly provider: "gemini" | "groq";

  constructor(
    message: string,
    opts: { status: number; body: string; retryable: boolean; provider: "gemini" | "groq" },
  ) {
    super(message);
    this.name = "ProviderError";
    this.status = opts.status;
    this.body = opts.body;
    this.retryable = opts.retryable;
    this.provider = opts.provider;
  }
}

export function isProviderError(err: unknown): err is ProviderError {
  return err instanceof ProviderError;
}

export function isGeminiRetryable(status: number, body: string): boolean {
  const lower = body.toLowerCase();
  return (
    status === 429 ||
    status === 500 ||
    status === 503 ||
    status === 413 ||
    lower.includes("resource_exhausted") ||
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("overloaded") ||
    lower.includes("unavailable") ||
    lower.includes("too many tokens") ||
    lower.includes("token count") ||
    lower.includes("exceeds the maximum")
  );
}

export function isGroqRetryable(status: number, body: string): boolean {
  const lower = body.toLowerCase();
  return (
    status === 429 ||
    status === 500 ||
    status === 503 ||
    status === 413 ||
    lower.includes("request too large") ||
    lower.includes("tokens per minute") ||
    lower.includes("tpm") ||
    lower.includes("rate limit")
  );
}

export function shouldFallbackToNextProvider(err: unknown): boolean {
  if (!isProviderError(err)) return false;
  // Invalid/expired key on primary provider — try backup before failing
  if (err.status === 401 || err.status === 403) return true;
  return err.retryable;
}
