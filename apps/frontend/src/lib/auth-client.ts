import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

/** Only same-site paths are allowed as a post-login destination. */
export function safeNext(next: string | null | undefined, fallback = "/") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
