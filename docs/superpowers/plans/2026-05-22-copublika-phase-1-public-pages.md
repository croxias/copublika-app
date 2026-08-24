# CoPublika Phase 1 Public Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Phase 1 public-facing CoPublika platform with a dynamic landing page, public content pages, join batch form, contact form, and Supabase-ready data layer.

**Architecture:** Use Next.js App Router Server Components for public pages and isolated Client Components for interactivity. Data access modules try Supabase first and fall back to typed fixtures until the database schema is populated. Public research data remains guest-safe with truncated previews and locked detail overlays.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React, React Hook Form, Zod, Supabase JS.

---

## File Structure

### Data and Supabase
- Create: `apps/frontend/src/lib/supabase/server.ts` — server-side Supabase client factory with environment-aware null fallback.
- Create: `apps/frontend/src/lib/data/fallbacks.ts` — typed fixtures for batches, research, blogs, events, KPIs, testimonials, and FAQ.
- Create: `apps/frontend/src/lib/data/batches.ts` — active batch and KPI accessors.
- Create: `apps/frontend/src/lib/data/research.ts` — research list/detail accessors with guest-safe truncation.
- Create: `apps/frontend/src/lib/data/blog.ts` — blog list/detail accessors.
- Create: `apps/frontend/src/lib/data/events.ts` — event list/detail accessors.

### Shared UI
- Create: `apps/frontend/src/components/ui/Badge.tsx` — reusable status/category badge.
- Create: `apps/frontend/src/components/ui/Card.tsx` — reusable card shell.
- Create: `apps/frontend/src/components/ui/SectionHeader.tsx` — reusable eyebrow/title/copy block.
- Create: `apps/frontend/src/components/ui/LockedOverlay.tsx` — curiosity-gap overlay for locked research content.

### Landing Sections
- Create: `apps/frontend/src/components/landing/Hero.tsx` — cinematic hero with batch status and CTAs.
- Create: `apps/frontend/src/components/landing/KpiBento.tsx` — KPI grid.
- Create: `apps/frontend/src/components/landing/ResearchPreview.tsx` — latest research cards.
- Create: `apps/frontend/src/components/landing/ProgramHighlight.tsx` — Siap Tembus Scopus teaser.
- Create: `apps/frontend/src/components/landing/LatestBlog.tsx` — latest blog cards.
- Create: `apps/frontend/src/components/landing/UpcomingEvents.tsx` — event cards.
- Create: `apps/frontend/src/components/landing/Reviews.tsx` — testimonials.
- Create: `apps/frontend/src/components/landing/FAQ.tsx` — FAQ list.
- Create: `apps/frontend/src/components/landing/FinalCTA.tsx` — final conversion section.

### Forms
- Create: `apps/frontend/src/components/forms/JoinBatchForm.tsx` — multi-step client form with Zod validation.
- Create: `apps/frontend/src/components/forms/ContactForm.tsx` — client contact form.

### Pages
- Modify: `apps/frontend/src/app/layout.tsx` — wrap children with Navbar/Footer public shell.
- Replace: `apps/frontend/src/app/page.tsx` — landing page composition.
- Create: `apps/frontend/src/app/about/page.tsx`
- Create: `apps/frontend/src/app/research/page.tsx`
- Create: `apps/frontend/src/app/research-project/[slug]/page.tsx`
- Create: `apps/frontend/src/app/blog/page.tsx`
- Create: `apps/frontend/src/app/blog/[slug]/page.tsx`
- Create: `apps/frontend/src/app/event/page.tsx`
- Create: `apps/frontend/src/app/event/[slug]/page.tsx`
- Create: `apps/frontend/src/app/contact/page.tsx`
- Create: `apps/frontend/src/app/curation-process/page.tsx`
- Create: `apps/frontend/src/app/siap-tembus-scopus/page.tsx`
- Create: `apps/frontend/src/app/join-batch/page.tsx`
- Create: `apps/frontend/src/app/login/page.tsx`
- Create: `apps/frontend/src/app/register/page.tsx`

### API Routes
- Create: `apps/frontend/src/app/api/join-batch/route.ts` — validates and inserts applications or mocks only with `MOCK_SUBMIT=true`.
- Create: `apps/frontend/src/app/api/contact/route.ts` — validates and inserts contact inquiries or mocks only with `MOCK_SUBMIT=true`.

### Database
- Create: `infra/supabase/migrations/202605220001_phase1_public_schema.sql` — minimum public schema tables and RLS-safe policies.

### Verification
- Modify: `apps/frontend/package.json` — add `typecheck` script.

---

## Task 1: Install Supabase JS and add typecheck script

**Files:**
- Modify: `apps/frontend/package.json`

- [ ] **Step 1: Install Supabase client**

Run from `apps/frontend`:

```powershell
npm install @supabase/supabase-js
```

Expected: package installs and `package-lock.json` updates.

- [ ] **Step 2: Add typecheck script**

In `apps/frontend/package.json`, set scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 3: Run verification**

```powershell
npm run typecheck
```

Expected: TypeScript passes or reports only current default-page issues to fix in later tasks.

---

## Task 2: Data layer and fixtures

**Files:**
- Create: `apps/frontend/src/lib/supabase/server.ts`
- Create: `apps/frontend/src/lib/data/fallbacks.ts`
- Create: `apps/frontend/src/lib/data/batches.ts`
- Create: `apps/frontend/src/lib/data/research.ts`
- Create: `apps/frontend/src/lib/data/blog.ts`
- Create: `apps/frontend/src/lib/data/events.ts`

- [ ] **Step 1: Create Supabase server client**

`apps/frontend/src/lib/supabase/server.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
```

- [ ] **Step 2: Create fallback fixtures**

`apps/frontend/src/lib/data/fallbacks.ts` defines realistic Phase 1 content using existing types from `src/types/index.ts` and exports:

```ts
export const fallbackBatch;
export const fallbackKpis;
export const fallbackResearch;
export const fallbackBlogs;
export const fallbackEvents;
export const fallbackTestimonials;
export const fallbackFaqs;
```

Include at least 4 research projects, 4 blog posts, 4 events, 4 testimonials, and 5 FAQs.

- [ ] **Step 3: Create data access modules**

Each module imports `createServerSupabaseClient` and fallback fixtures. Queries must catch errors and return fallback data.

Functions required:

```ts
getActiveBatch()
getLandingKpis()
getResearchProjects()
getResearchProjectBySlug(slug: string)
getLatestResearchProjects(limit?: number)
getBlogPosts()
getBlogPostBySlug(slug: string)
getLatestBlogPosts(limit?: number)
getEvents()
getEventBySlug(slug: string)
getUpcomingEvents(limit?: number)
```

- [ ] **Step 4: Run typecheck**

```powershell
npm run typecheck
```

Expected: no missing imports or type errors from data modules.

---

## Task 3: Shared UI primitives

**Files:**
- Create: `apps/frontend/src/components/ui/Badge.tsx`
- Create: `apps/frontend/src/components/ui/Card.tsx`
- Create: `apps/frontend/src/components/ui/SectionHeader.tsx`
- Create: `apps/frontend/src/components/ui/LockedOverlay.tsx`

- [ ] **Step 1: Create UI components**

Implement small focused components using CSS variables from `globals.css`:

```ts
Badge({ children, tone })
Card({ children, className })
SectionHeader({ eyebrow, title, description, align })
LockedOverlay({ title, description, ctaHref, ctaLabel })
```

- [ ] **Step 2: Verify imports**

```powershell
npm run typecheck
```

Expected: no UI component type errors.

---

## Task 4: Landing page sections

**Files:**
- Create all files under `apps/frontend/src/components/landing/`
- Replace: `apps/frontend/src/app/page.tsx`

- [ ] **Step 1: Create landing section components**

Each component receives data via props and renders PRD-aligned copy:

```ts
Hero({ batch })
KpiBento({ kpis })
ResearchPreview({ projects })
ProgramHighlight()
LatestBlog({ posts })
UpcomingEvents({ events })
Reviews({ testimonials })
FAQ({ faqs })
FinalCTA({ batch })
```

- [ ] **Step 2: Replace default page**

`apps/frontend/src/app/page.tsx` must fetch dynamic data server-side and compose all sections:

```ts
const [batch, kpis, research, posts, events] = await Promise.all([...]);
```

- [ ] **Step 3: Run checks**

```powershell
npm run typecheck
npm run lint
```

Expected: landing page compiles and default Next starter is gone.

---

## Task 5: Public content pages

**Files:**
- Create page files for about, research, research detail, blog, blog detail, event, event detail, curation process, Scopus program, login, register.

- [ ] **Step 1: Static narrative pages**

Create polished pages for:

```txt
/about
/curation-process
/siap-tembus-scopus
/login
```

Use PRD copy, bento layouts, and Scopus Orange accents.

- [ ] **Step 2: Data-driven list/detail pages**

Create server-rendered pages for:

```txt
/research
/research-project/[slug]
/blog
/blog/[slug]
/event
/event/[slug]
```

Use data access modules, `notFound()` when slug does not exist, and locked overlays on research details.

- [ ] **Step 3: Register route**

`/register` should redirect to `/join-batch` using Next.js `redirect` from `next/navigation`.

- [ ] **Step 4: Run checks**

```powershell
npm run typecheck
npm run lint
```

Expected: all routes typecheck and lint.

---

## Task 6: Join Batch and Contact forms

**Files:**
- Create: `apps/frontend/src/components/forms/JoinBatchForm.tsx`
- Create: `apps/frontend/src/components/forms/ContactForm.tsx`
- Create: `apps/frontend/src/app/join-batch/page.tsx`
- Create: `apps/frontend/src/app/contact/page.tsx`
- Create: `apps/frontend/src/app/api/join-batch/route.ts`
- Create: `apps/frontend/src/app/api/contact/route.ts`

- [ ] **Step 1: Implement join batch form**

Use React Hook Form + Zod. Required fields:

```txt
fullName, email, institution, role, expertise, googleScholarId, statementOfIntent, targetJournalTier
```

Optional fields:

```txt
scopusOrLinkedIn, orcid, hIndex, motivation
```

- [ ] **Step 2: Implement contact form**

Use fields:

```txt
name, email, institution, subject, message, sourcePage
```

- [ ] **Step 3: Implement API validation and submit**

API routes must:
1. parse JSON,
2. validate required fields,
3. insert into Supabase when client is available,
4. return mock success only when `MOCK_SUBMIT=true`,
5. return `503` if DB is unavailable and mock mode is off.

- [ ] **Step 4: Run checks**

```powershell
npm run typecheck
npm run lint
```

Expected: form and API route code passes.

---

## Task 7: Supabase migration

**Files:**
- Create: `infra/supabase/migrations/202605220001_phase1_public_schema.sql`

- [ ] **Step 1: Write schema migration**

Create tables:

```sql
batches
applications
research_projects
content_blogs
content_events
contact_inquiries
```

Include UUID primary keys, timestamps, status checks, and RLS enabled.

- [ ] **Step 2: Apply migration through Supabase MCP only after review**

Use migration name:

```txt
phase1_public_schema
```

Expected: public tables exist after application.

- [ ] **Step 3: Run Supabase advisor checks**

Run security and performance advisors after DDL.

Expected: no critical RLS/security issue for public Phase 1 tables.

---

## Task 8: Final verification

**Files:**
- All implemented files.

- [ ] **Step 1: Run static checks**

```powershell
npm run typecheck
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 2: Manual route check**

Run:

```powershell
npm run dev
```

Visit:

```txt
/
/about
/research
/research-project/[fixture-slug]
/blog
/blog/[fixture-slug]
/event
/event/[fixture-slug]
/contact
/curation-process
/siap-tembus-scopus
/join-batch
/login
/register
```

Expected: every route renders, mobile nav works, dark/light toggle works, language switcher works.

- [ ] **Step 3: Supabase connection check**

Use MCP:

```txt
supabase_get_project_url
supabase_list_tables({ schemas: ["public"], verbose: false })
```

Expected: project URL matches configured Supabase project and Phase 1 tables appear if migration was applied.

---

## Self-Review

- Spec coverage: landing dynamic sections, public pages, join batch, contact, Supabase schema, fallback data, guest-safe research, and verification are covered.
- Placeholder scan: no task relies on TBD implementation; each module has explicit exported functions and route list.
- Type consistency: function names and route paths match the approved spec.
