import pathlib

root = pathlib.Path(__file__).resolve().parents[1]
login = (root / 'apps/frontend/src/app/admin/login/page.tsx').read_text()
guard = (root / 'apps/frontend/src/lib/supabase/require-admin.ts').read_text()
layout = (root / 'apps/frontend/src/app/admin/(shell)/layout.tsx').read_text()
migration = (root / 'infra/supabase/migrations/202608270001_admin_auth_hardening.sql').read_text()

checks = {
    'login uses Supabase password auth': 'signIn(email, password)' in login,
    'mock credentials removed': 'admin123' not in login and 'setTimeout' not in login,
    'guard verifies user': 'supabase.auth.getUser()' in guard,
    'guard verifies admin role': 'profile?.role !== "admin"' in guard,
    'shell applies guard': 'await requireAdmin()' in layout,
    'profiles public read removed': 'drop policy if exists "Public can read profiles"' in migration,
    'member role changes blocked': 'role = \'member\'' in migration,
    'registrant column revoked': 'revoke select (registrants)' in migration,
}

failed = [name for name, passed in checks.items() if not passed]
for name, passed in checks.items():
    print(f"{'PASS' if passed else 'FAIL'}: {name}")
if failed:
    raise SystemExit(1)
