// `pnpm dev:clean`: deletes the Turbopack dev cache (.next/dev). It is rebuilt on the next
// `pnpm dev`. Use it when the dev server feels slow or keeps running out of memory; after many
// edits the cache can grow past several GB. Stop the dev server first.

import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), ".next", "dev");
if (existsSync(dir)) {
  rmSync(dir, { recursive: true, force: true });
  console.log("[dev:clean] Removed .next/dev. The next `pnpm dev` starts with a fresh cache.");
} else {
  console.log("[dev:clean] No .next/dev cache to remove.");
}
