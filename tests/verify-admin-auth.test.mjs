import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const verifier = path.join(repositoryRoot, "scripts", "verify_admin_auth.py");
const staticOnlyNote = "NOTE: static-only checks; no Supabase database, migrations, grants, or RLS were executed.";

for (const cwd of [repositoryRoot, "/tmp"]) {
  test(`verifier passes when executed from ${cwd}`, () => {
    const result = spawnSync("python3", [verifier], {
      cwd,
      encoding: "utf8",
    });

    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PASS/);
    assert.match(result.stdout, new RegExp(staticOnlyNote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
}
