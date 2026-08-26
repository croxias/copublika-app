# CoPublika Backend

Backend boundary for server-side APIs and domain services.

The current application still contains legacy Next.js route handlers under `apps/frontend/src/app/api`. Those routes remain unchanged in this foundation step. New backend work must be added here unless an approved ADR says otherwise.

## Local development

```bash
pnpm --filter backend start
```

The backend foundation intentionally exposes only a health endpoint. Domain APIs and Supabase server access will be added through bounded work packages; existing Next.js route handlers remain unchanged until their migration contract is approved.

Health check:

```text
GET http://localhost:4000/health
```

## Boundary rules

- Keep server-only credentials and privileged Supabase access here.
- Never expose service-role credentials to the frontend.
- Add API contracts and validation before dependent frontend work.
- Production deployment remains a Founder approval gate.

## Docker Compose

From the repository root, copy `.env.example` to a deployment-only `.env`, fill the two public Supabase values from the approved server-side configuration, then run:

```bash
docker compose config
docker compose up --build
```

The Compose file fails fast when the required frontend build variables are absent. Real secrets must be supplied by the deployment secret manager and must not be committed.
