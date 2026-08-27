import pathlib
import re

try:
    import yaml
except ImportError as exc:  # pragma: no cover - operator-facing failure
    raise SystemExit("FAIL: PyYAML is required to parse project YAML contracts") from exc

ROOT = pathlib.Path(__file__).resolve().parent.parent


def read(relative_path):
    return (ROOT / relative_path).read_text(encoding="utf-8")


def active(text, pattern):
    """Match executable-looking lines, excluding SQL/TS comments."""
    uncommented = "\n".join(
        line for line in text.splitlines()
        if not line.lstrip().startswith(("#", "//", "/*", "*"))
    )
    return re.search(pattern, uncommented, re.MULTILINE | re.DOTALL) is not None


login = read("apps/frontend/src/app/admin/login/page.tsx")
auth_provider = read("apps/frontend/src/components/auth/SupabaseAuthProvider.tsx")
guard = read("apps/frontend/src/lib/supabase/require-admin.ts")
layout = read("apps/frontend/src/app/admin/(shell)/layout.tsx")
migration = read("infra/supabase/migrations/202608270001_admin_auth_hardening.sql")
compose = yaml.safe_load(read("docker-compose.yml")) or {}
workspace = yaml.safe_load(read("pnpm-workspace.yaml")) or {}
services = compose.get("services", {})
frontend = services.get("frontend", {}) or {}
backend = services.get("backend", {}) or {}
frontend_build = frontend.get("build", {}) or {}
frontend_args = frontend_build.get("args", {}) or {}
frontend_env = frontend.get("environment", {}) or {}
workspace_packages = workspace.get("packages", []) or []

required_public_vars = {
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
}

checks = [
    ("static-only harness (no database execution)", True),
    (
        "admin login uses Supabase password auth",
        active(login, r"signIn\(email, password\)")
        and active(auth_provider, r"client\.auth\.signInWithPassword\(\{ email, password \}\)"),
    ),
    (
        "admin login has no mock credentials",
        not re.search(r"admin123|mock credential|setTimeout", login, re.IGNORECASE),
    ),
    (
        "server-side guard fails closed on auth errors",
        active(guard, r"getUser\(\)")
        and active(guard, r"authError")
        and active(guard, r"if \(authError \|\| !user\)"),
    ),
    (
        "server-side guard verifies admin role and fails closed on profile errors",
        active(guard, r'select\("role"\)')
        and active(guard, r"profileError")
        and active(guard, r"if \(profileError \|\| profile\?\.role !== \"admin\"\)"),
    ),
    ("admin shell applies server-side guard", active(layout, r"await requireAdmin\(\)")),
    (
        "migration defines security-definer is_admin",
        active(migration, r"create or replace function public\.is_admin\(\)")
        and active(migration, r"security definer"),
    ),
    ("is_admin locks search_path", active(migration, r"set search_path = public")),
    (
        "member self-promotion is blocked",
        active(migration, r"with check \(\(select auth\.uid\(\)\) = id and role = 'member'\)"),
    ),
    (
        "public profile read policy is removed",
        active(migration, r'drop policy if exists "Public can read profiles" on public\.profiles'),
    ),
    (
        "registrant column/table exposure is revoked",
        active(migration, r"(?:drop|revoke).*registrants")
        and active(migration, r"revoke select .*content_events"),
    ),
    (
        "backend remains internal in Docker Compose",
        isinstance(backend, dict)
        and backend.get("expose") == ["4000"]
        and "ports" not in backend,
    ),
    (
        "Docker Compose requires public Supabase build and runtime variables",
        required_public_vars.issubset(frontend_args)
        and required_public_vars.issubset(frontend_env)
        and all(
            str(frontend_args[name]).startswith(f"${{{name}:?")
            and str(frontend_env[name]).startswith(f"${{{name}:?")
            for name in required_public_vars
        ),
    ),
    (
        "workspace structurally includes frontend and backend apps",
        any(item in ("apps/*", "apps/frontend", "apps/backend") for item in workspace_packages)
        and (ROOT / "apps/frontend").is_dir()
        and (ROOT / "apps/backend").is_dir(),
    ),
]

for name, passed in checks:
    print(f"{'PASS' if passed else 'FAIL'}: {name}")

print(
    "NOTE: static-only checks; no Supabase database, migrations, grants, or RLS were "
    "executed. Effective DB privilege/RLS integration remains unverified."
)

if any(not passed for _, passed in checks):
    raise SystemExit(1)
