// `pnpm dev`: runs `next dev` and keeps it running.
//
// Next.js sizes the dev heap at half the machine's RAM (about 8 GB here) and restarts itself
// when a request finishes above 80% of it. A long HMR compile can still push the heap over the
// limit between requests; Node then aborts (exit 134) and the dev server stays down. On a 16 GB
// laptop that 8 GB heap, plus Turbopack's native memory and the browser, also starves the system.
//
// So this script: caps the heap (DEV_MAX_HEAP_MB, default 4096) so Next's own restart kicks in
// earlier, and starts `next dev` again if it crashes anyway. Ctrl+C stops it for good.

import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const heapMb = process.env.DEV_MAX_HEAP_MB || "4096";
const args = ["dev", ...process.argv.slice(2)];

// Give up if it keeps dying right after start (a real error, not memory).
const QUICK_CRASH_MS = 15_000;
const MAX_QUICK_CRASHES = 3;

let child;
let stopping = false;
let quickCrashes = 0;

function start() {
  const startedAt = Date.now();
  const nodeOptions = [process.env.NODE_OPTIONS, `--max-old-space-size=${heapMb}`].filter(Boolean).join(" ");
  let duplicate = false;
  child = spawn(process.execPath, [nextBin, ...args], { stdio: ["inherit", "pipe", "pipe"], env: { ...process.env, NODE_OPTIONS: nodeOptions, FORCE_COLOR: "1" } });
  // Pass output through, watching for Next's "already running" refusal.
  for (const [from, to] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
    from.on("data", (buf) => {
      if (String(buf).includes("Another next dev server is already running")) duplicate = true;
      to.write(buf);
    });
  }

  child.on("exit", (code, signal) => {
    if (stopping || code === 0 || signal === "SIGINT" || signal === "SIGTERM") process.exit(code ?? 0);
    // Another `next dev` already owns the port (e.g. one left from an earlier run): don't loop.
    if (duplicate) {
      console.error("\n[dev] Another next dev server is already running. Stop it first (see the PID above), then run pnpm dev again.");
      process.exit(1);
    }

    quickCrashes = Date.now() - startedAt < QUICK_CRASH_MS ? quickCrashes + 1 : 0;
    if (quickCrashes >= MAX_QUICK_CRASHES) {
      console.error(`\n[dev] next dev crashed ${quickCrashes} times right after starting (last exit: ${code ?? signal}). Not restarting.`);
      process.exit(code ?? 1);
    }
    console.warn(`\n[dev] next dev stopped (exit ${code ?? signal}${code === 134 ? ", out of memory" : ""}). Restarting in 2s…\n`);
    setTimeout(start, 2000);
  });
}

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    stopping = true;
    child?.kill(sig);
  });
}

console.log(`[dev] next dev with a ${heapMb} MB heap, restarting automatically after a crash.`);
start();
