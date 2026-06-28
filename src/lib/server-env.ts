/**
 * Runtime secrets/vars for server-only code.
 * Cloudflare Workers inject secrets on `cloudflare:workers` env at request time;
 * bare process.env may be empty or build-inlined in the worker bundle.
 */
import { env as cloudflareEnv } from "cloudflare:workers";

export function readServerEnv(name: string): string | undefined {
  const fromWorker = cloudflareEnv[name]?.trim();
  if (fromWorker) return fromWorker;

  const fromProcess = process.env[name]?.trim();
  return fromProcess || undefined;
}
