import pathlib
import re


ROOT = pathlib.Path(__file__).resolve().parent.parent


def read(relative_path):
    return (ROOT / relative_path).read_text(encoding="utf-8")


def compose_service(text, service):
    match = re.search(rf"(?ms)^  {re.escape(service)}:\n(?P<body>(?:^    .*\n|^\n)*)", text)
    return match.group("body") if match else ""


def yaml_section(block, key):
    match = re.search(rf"(?m)^(?P<indent>\s+){re.escape(key)}:\s*$", block)
    if not match:
        return ""
    indent = len(match.group("indent"))
    lines = []
    for line in block[match.end():].splitlines():
        if line.strip() and len(line) - len(line.lstrip()) <= indent:
            break
        lines.append(line)
    return "\n".join(lines)


def yaml_required_var(block, name):
    return bool(re.search(rf"(?m)^\s+{re.escape(name)}:\s+\$\{{{re.escape(name)}:\?", block))


def has_list_value(block, key, value):
    return bool(re.search(rf"(?ms)^\s+{re.escape(key)}:\s*\n(?:^\s+-\s+[^\n]*\n)*^\s+-\s+[\"']?{re.escape(value)}[\"']?\s*$", block))


def workspace_has_package(text, package):
    return bool(re.search(rf"(?m)^\s+-\s+[\"']?{re.escape(package)}[\"']?\s*$", text))


def strip_comments(text):
    """Remove comments while preserving quoted strings enough for contract checks."""
    output = []
    index = 0
    quote = None
    block_comment = False
    while index < len(text):
        if block_comment:
            if text[index:index + 2] == "*/":
                block_comment = False
                output.extend("  ")
                index += 2
            else:
                output.append("\n" if text[index] == "\n" else " ")
                index += 1
            continue
        if quote:
            output.append(text[index])
            if text[index] == "\\":
                if index + 1 < len(text):
                    output.append(text[index + 1])
                    index += 2
                    continue
            elif text[index] == quote:
                quote = None
            index += 1
            continue
        if text[index] in ("'", '"', "`"):
            quote = text[index]
            output.append(text[index])
            index += 1
            continue
        if text[index:index + 2] == "/*":
            block_comment = True
            output.extend("  ")
            index += 2
            continue
        if text[index:index + 2] in ("//", "--") or text[index] == "#":
            while index < len(text) and text[index] != "\n":
                output.append(" ")
                index += 1
            continue
        output.append(text[index])
        index += 1
    return "".join(output)


def active(text, pattern):
    """Match executable-looking lines after removing comments."""
    uncommented = strip_comments(text)
    return re.search(pattern, uncommented, re.MULTILINE) is not None


login = read("apps/frontend/src/app/admin/login/page.tsx")
auth_provider = read("apps/frontend/src/components/auth/SupabaseAuthProvider.tsx")
guard = read("apps/frontend/src/lib/supabase/require-admin.ts")
layout = read("apps/frontend/src/app/admin/(shell)/layout.tsx")
migration = read("infra/supabase/migrations/202608270001_admin_auth_hardening.sql")
compose = read("docker-compose.yml")
workspace = read("pnpm-workspace.yaml")
frontend = compose_service(compose, "frontend")
backend = compose_service(compose, "backend")
frontend_build = yaml_section(frontend, "build")
frontend_args = yaml_section(frontend_build, "args")
frontend_env = yaml_section(frontend, "environment")

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
        active(
            migration,
            r"revoke\s+select\s+\(registrants\)\s+on\s+public\.content_events\s+from\s+anon,\s*authenticated\s*;",
        ),
    ),
    (
        "backend remains internal in Docker Compose",
        bool(backend)
        and has_list_value(backend, "expose", "4000")
        and not re.search(r"(?m)^\s+ports:", backend),
    ),
    (
        "Docker Compose requires public Supabase build and runtime variables",
        all(yaml_required_var(frontend_args, name) for name in required_public_vars)
        and all(yaml_required_var(frontend_env, name) for name in required_public_vars),
    ),
    (
        "workspace structurally includes frontend and backend apps",
        (
            workspace_has_package(workspace, "apps/*")
            or (workspace_has_package(workspace, "apps/frontend")
                and workspace_has_package(workspace, "apps/backend"))
        )
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
