# CoPublika Development Roadmap

> **For Hermes:** Use the project-agent-orchestration and subagent-driven-development workflows to execute this roadmap task-by-task. Ale remains CTO/PM, reviewer, and integration gate owner; OpenCode is the execution layer.

**Goal:** Deliver CoPublika as a secure, credible, visually distinctive academic research platform without generic AI-generated UI patterns.

**Architecture:** Preserve the implemented Supabase Auth/SSR, Supabase client, PostgreSQL migrations, RLS, Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Chart.js, React Hook Form, and Zod baseline. Do not migrate to Better Auth/Drizzle merely because the PRD contains an older architecture description. Record the conflict as an architecture decision and align the PRD/implementation documentation before feature expansion.

**Repository:** `/home/ubuntu/project/copublika-app`
**Remote:** `https://github.com/croxias/copublika-app.git`
**Delivery boundary:** Development and verification only. Push, merge, deployment, production, sensitive-data operations, destructive migrations, public launch, cost, and paid services remain Founder-gated.

---

## 1. Verified baseline

- PRD copies are byte-identical by SHA-256: `prd-copublika.md` and `copublika-design-update/uploads/prd-copublika.md`.
- Product intent: Digital Research Engine & Exclusive Community; public discovery plus private member workspace and curated admin operations.
- Product phases in PRD: MVP foundation/curation; engagement/collaboration; scaling/education/tools; global expansion.
- Implemented stack: pnpm monorepo, Next.js 16.2.6, React 19.2.4, TypeScript, Tailwind CSS 4, Supabase SSR/client, Framer Motion 12, Chart.js, React Hook Form, Zod.
- Existing public routes include home, about, research, research detail, blog, event, contact, registration, login, program/LMS entry, and auth callback.
- Existing admin routes include login, dashboard, analytics, notifications, profile, settings.
- Existing UI primitives include Button, Card, Badge, Reveal, CountUp, ThemeToggle, LanguageSwitcher, LockedOverlay, and SectionHeader.
- Baseline frontend lint/typecheck/build commands in the repository root are currently false positives because root filters target `@copublika/frontend` while the actual package name is `frontend`. The commands exit 0 without running the package checks. The valid package checks are under `apps/frontend`.
- Automated test script is not present in the frontend package.
- Security blockers already identified: mock/hardcoded admin login, missing admin route authorization, profile role mutation risk, public profile reads, public registrant JSON exposure, broad/public policies, browser-side profile upsert, and fallback data that may mask outages.

## 2. Product and architecture decisions

### Approved baseline decision

Keep Supabase as the baseline for authentication, data, storage, and RLS. Reconcile the PRD's Better Auth/Drizzle references with the actual implementation in a documentation/decision record before implementation agents expand the system.

### Recommended visual direction

**Editorial Research Platform / Institutional Premium:** authoritative typography, monochrome foundation, restrained Scopus Orange accent, strong editorial hierarchy, measured whitespace, structured data visualization, and purposeful motion. Use the logo as the anchor; derive tokens from its actual colors after inspecting the asset.

Avoid:

- default purple-blue gradients;
- excessive glassmorphism and glow;
- every section rendered as a rounded card;
- identical card grids and centered hero templates;
- decorative animation without user intent;
- fake KPI/social proof values presented as live data;
- visual polish that hides missing auth, data, or error states.

Motion principles:

- animate state changes, hierarchy, and feedback;
- use stagger/reveal only for meaningful content groups;
- animate data transitions and progress, not static decoration;
- honor `prefers-reduced-motion`;
- keep mobile motion lighter and avoid layout thrash.

## 3. Delivery phases and gates

### Phase 0 — Project alignment and design foundation

**Objective:** Establish a shared source of truth before coding.

Deliverables:

1. Architecture Decision Record: Supabase baseline versus stale Better Auth/Drizzle PRD section.
2. Product backlog mapped to PRD phases and current implementation.
3. UI audit of public and admin surfaces using Taste Skill + Impeccable.
4. CoPublika design direction and token proposal: color, type, spacing, radius, elevation, motion, data-viz rules, light/dark behavior.
5. Route inventory and state matrix: loading, empty, error, unauthorized, forbidden, success.
6. Correct root package filters and add a real test strategy without hiding existing failures.

Gate: Founder/AL review of architecture decision and design direction before broad UI implementation.

### Phase 1 — Security and access foundation (MVP blocker)

**Objective:** Make authentication, authorization, and sensitive data boundaries real.

Deliverables:

1. Replace mock admin login with Supabase Auth.
2. Add server-side admin authorization for every admin route and API action.
3. Establish immutable role assignment path; users cannot self-promote.
4. Restrict profile reads to the minimum public/member/admin fields.
5. Protect application/contact/event registrant data and remove public JSON exposure.
6. Move profile creation/updates to a trusted server path or database trigger with allowlisted fields.
7. Add rate limiting/abuse controls to public application/contact endpoints where supported by the approved environment.
8. Add auth/RLS regression tests and a manual abuse matrix.

Gate: BE security review + independent QA authorization matrix. This is P0/P1 work and must precede admin feature expansion.

### Phase 2 — Public experience and design system

**Objective:** Make the public product coherent, credible, responsive, and distinctive.

Recommended order:

1. App shell: metadata, theme, typography, tokens, Navbar, Footer, responsive navigation.
2. Home: hero, proof/KPI section with verified data states, research preview, program/event/blog sections, CTA.
3. Research gallery/detail: curiosity gap enforced at the data boundary, not only CSS; guest/member states.
4. Blog and event surfaces: real loading/error/empty states, SEO metadata, status badges, detail routes.
5. Register/join-batch/contact flows: validation, accessible feedback, resilient API behavior.
6. Motion pass: page transitions, reveal, filters, count-up, modal/drawer, skeleton, reduced motion.

Gate: FE visual review, Impeccable critique/audit/polish, desktop/mobile browser evidence, accessibility and performance checks.

### Phase 3 — Admin curation MVP

**Objective:** Enable secure operational management of batches, applications, public content, and research submissions.

Deliverables:

1. Admin shell with verified session/role guard.
2. Application queue and batch management with explicit status transitions.
3. Scholar verification workflow as a bounded integration contract; no scraping/provider spend without approval.
4. CRUD for blog/event with draft/publish scheduling rules.
5. Research project moderation queue.
6. Audit trail for material admin actions.
7. Honest analytics sourced from database; no mock values presented as live.

Gate: security review, role matrix, data integrity tests, QA admin workflow evidence.

### Phase 4 — Member research workspace

**Objective:** Deliver the private collaboration foundation.

Deliverables:

1. Member dashboard and profile with verified-field restrictions.
2. Project submission/editing with Draft → Pending Review → Published → Archived transitions.
3. Ownership validation and collaborator model.
4. Research progress tracker.
5. Linked-data expertise search with privacy boundaries.
6. Notifications/inquiry only after contract and abuse controls are defined.

Gate: API/schema/RLS contract review before FE dependent work; integrated member journey test.

### Phase 5 — Scaling features

**Objective:** Add LMS, template protection, analytics, and notifications only after core security/data contracts are stable.

Deliverables:

- LMS module/progress model and accessible roadmap;
- Template Vault with approved storage and watermarking design;
- admin analytics sourced from verified data;
- realtime notifications where operationally justified;
- bilingual content strategy;
- PWA/mobile companion only as a separately approved scope.

Gate: separate architecture and risk review for storage, document generation, realtime, and any external integration.

## 4. Work breakdown and dependencies

| ID | Work package | Owner | Reviewer | Depends on | Priority |
|---|---|---|---|---|---|
| PM-01 | ADR, backlog, route/state inventory | Ale | AL/Founder gate | canonical context | P1 |
| PM-02 | UI audit and design tokens proposal | FE design worker | Ale + QA visual | PM-01, logo inspection | P1 |
| BE-01 | Auth/RBAC threat model and policy matrix | BE | independent QA/security | PM-01 | P0 |
| BE-02 | Harden profile/application/contact/event RLS | BE | QA + Ale | BE-01 | P0 |
| BE-03 | Replace mock admin auth with Supabase server auth | BE | QA | BE-01 | P0 |
| QA-01 | Baseline test harness and auth/RLS matrix | QA | Ale | BE-01 | P0 |
| DEV-01 | Fix root package filters and reproducible checks | DevOps | QA | repository inspection | P1 |
| FE-01 | Design system/shell alignment | FE | Impeccable + Ale | PM-02 | P1 |
| FE-02 | Home/public route redesign | FE | QA visual | FE-01, data contracts | P1 |
| FE-03 | Curiosity-gap gallery/detail states | FE | BE + QA | BE-02, FE-01 | P1 |
| FE-04 | Forms and public conversion flows | FE | QA | BE API validation | P1 |
| BE-04 | Admin/content/research contracts | BE | QA | BE-02/03 | P1 |
| FE-05 | Admin UI implementation | FE | BE + QA | BE-04 | P1 |
| QA-02 | Integrated browser/accessibility/regression suite | QA | Ale | FE/BE integration | P0 |
| DEV-02 | CI/build/security scan and environment contract | DevOps | QA/Ale | DEV-01 | P1 |

## 5. Sub-agent operating briefs

### FE worker

Scope: `apps/frontend/src/app`, `apps/frontend/src/components`, styles, frontend tests only. Use Taste Skill and Impeccable. Do not change migrations, secrets, auth policy, or product copy without a bounded task. Every UI task must include loading/empty/error/unauthorized states, responsive behavior, reduced motion, and browser evidence.

Acceptance: intentional hierarchy, no detected AI-slop anti-patterns, correct data states, keyboard/accessibility checks, desktop/mobile screenshots or browser evidence, lint/typecheck/build results.

### BE worker

Scope: `apps/frontend/src/lib`, API routes, Supabase migrations, server actions, contracts, and backend tests. Preserve Supabase baseline. Never use service-role credentials in client code. Explicitly select columns, validate input with Zod, enforce ownership/role server-side and in RLS, and document migration safety.

Acceptance: policy matrix passes, unauthorized/forbidden tests pass, public data is minimized, errors are explicit, migration is reviewed, typecheck/build pass.

### QA worker

Scope: independent test plans, tests, browser checks, accessibility, security abuse cases, and regression evidence. QA must not rely only on the implementer's report and must not modify production data.

Acceptance: traceable test matrix to acceptance criteria, reproducible defects with route/steps/evidence, independent pass/fail verdict, baseline versus regression distinction.

### DevOps worker

Scope: package scripts, CI, environment contracts, build/runtime checks, logging/observability, and deployment readiness documentation. No production deployment or paid resource provisioning.

Acceptance: root checks execute the intended package, environment names are documented without values, secret scan is clean, install/build are reproducible, failure states are honest.

### Ale orchestration rules

- Use isolated worktrees for parallel code workers; do not share a mutable worktree.
- Sequence BE contracts/RLS before dependent FE implementation.
- QA may prepare plans in parallel but final QA follows integration.
- Require changed files, diff, tests, failures, assumptions, risks, and next gate from every worker.
- Run independent code review before commit; no agent verifies its own work.
- Do not push/merge/deploy without explicit Founder authorization.

## 6. Immediate next execution slice

After Founder/AL accepts the roadmap and design direction:

1. Create a feature branch for project hygiene and planning artifacts.
2. Run Impeccable static audit against the current public UI and read its findings.
3. Inspect the logo and current global/admin CSS to derive a token proposal.
4. Create the architecture decision record and a design brief.
5. Fix root package filter mismatch in a separate bounded task.
6. Dispatch BE-01 and QA-01 first because security is a blocker.
7. Dispatch FE-01 only after the design brief is approved.
8. Do not start broad visual redesign while mock admin auth/RLS exposure remains unresolved unless the work is explicitly limited to non-sensitive presentational surfaces.

## 7. Verification commands

Run from repository root with Node path configured:

```bash
PATH=/home/ubuntu/.local/node20/bin:$PATH pnpm --dir apps/frontend lint
PATH=/home/ubuntu/.local/node20/bin:$PATH pnpm --dir apps/frontend typecheck
PATH=/home/ubuntu/.local/node20/bin:$PATH pnpm --dir apps/frontend build
```

Root scripts must be corrected before they are treated as valid gates. Add a test script only with an explicit implementation task and a selected test framework.

## 8. Risks and open decisions

- **P0:** Admin routes/login are not production-safe.
- **P0:** RLS/profile role and public sensitive JSON policies may expose or permit privilege changes.
- **P1:** PRD architecture sections conflict with the approved Supabase implementation.
- **P1:** Fallback static data can hide database failures.
- **P1:** No automated test script exists.
- **P1:** Dependency audit reports vulnerabilities; patch plan needed before release.
- **P2:** Node 20 future support warning; plan Node 22 migration.
- **P2:** `metadataBase` is not configured.
- **Open:** final Scholar metadata provider and legal/consent requirements.
- **Open:** final brand colors/fonts beyond the logo.
- **Open:** production environment and deployment target.

## 9. Completion definition for this roadmap

The roadmap is ready for execution when the PM artifact is readable, the architecture baseline is accepted, the first work packages have owners/dependencies/acceptance criteria, runtime readiness is verified, and the next gate is explicit. The project is not production-ready until P0/P1 security, data, test, and dependency blockers are resolved and independently verified.

## Next gate

**FOUNDER / AL DECISION REQUIRED:** approve this roadmap and the recommended Editorial Research Platform / Institutional Premium visual direction before implementation agents begin broad changes.
