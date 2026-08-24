# CoPublika Phase 1 Public Platform Design

Date: 2026-05-22
Status: Draft for user review

## 1. Goal

Phase 1 builds the complete public-facing CoPublika experience from the existing `copublika-design/` draft, with the PRD as the final source of truth. The site must communicate CoPublika as a **Digital Research Engine & Exclusive Community**, convert qualified academic visitors into batch applicants, and prepare all public content to be managed from Supabase/CMS later.

This phase covers all public pages from the draft:

- `/`
- `/about`
- `/research`
- `/research-project/[slug]`
- `/blog`
- `/blog/[slug]`
- `/event`
- `/event/[slug]`
- `/contact`
- `/curation-process`
- `/siap-tembus-scopus`
- `/join-batch`
- `/login` as visual shell only
- `/register` redirects or aligns to `/join-batch`

Dashboard, member workspace, LMS internals, template vault, and admin CRUD are out of Phase 1 except for data structures that prepare for them.

## 2. Source of Truth

Priority order:

1. `prd-copublika.md`
2. Modern draft system in `copublika-design/index.html` and `copublika-design/components/*.jsx`
3. Other draft pages in `copublika-design/*.html`
4. Implementation constraints in Next.js App Router

When draft design conflicts with PRD, PRD wins.

## 3. Canonical Visual System

Use **Approach A: Modern system** as the canonical visual foundation.

The public UI should preserve the strongest elements from the draft:

- dark cinematic animated hero
- SVG animated backdrops
- glassmorphism sticky navbar
- centered navigation
- Scopus Orange accent `#E9711C`
- bold modern typography
- bento/grid content layout
- motion-rich but professional academic aesthetic
- hover-lift cards
- responsive mobile-first layout

Adjustments required by PRD:

- Use **Plus Jakarta Sans** as primary font and **JetBrains Mono** for labels/metadata.
- Use PRD palette:
  - Primary Black: `#0F172A`
  - Light background: `#F8FAFC`
  - Light border: `#E2E8F0`
  - Dark background: `#020617`
  - Dark surface: `#1E293B`
  - Scopus Orange: `#E9711C`
- Register CTA must be solid Scopus Orange, not generic black/white.
- Public research must implement Curiosity Gap for guests: real preview + server-safe truncated data + visual blur overlay.
- Footer must include newsletter and real-time batch status.
- Landing must integrate dynamic updates from research, blog, and event pages.

## 4. Architecture

Use **Next.js App Router** with frontend/backend separation already started:

```txt
apps/frontend
  src/app
  src/components
  src/lib
  src/types
apps/backend
infra/supabase
packages
```

Primary architecture:

- Public pages are Server Components by default.
- Interactive components are isolated Client Components.
- Landing page is a server-rendered composition of static brand sections plus dynamic Supabase-fed sections.
- Join Batch form is a Client Component with Zod + React Hook Form.
- Supabase read queries run from server-side data access modules.
- Public API never sends full locked research data to guests.

## 5. Data Strategy

Use hybrid data:

### Landing

Landing is not static. It should pull dynamic snapshots from the same data sources used by public pages:

- latest published research projects from `/research`
- latest blog posts from `/blog`
- latest/upcoming events from `/event`
- active batch status from `batches`
- KPI counts from aggregate queries or fallback static values

Landing sections must update when source data changes.

### Public List/Detail Pages

Use Supabase as source of truth:

- `research_projects` for `/research` (list) and `/research-project/[slug]` (detail)
- `content_blogs` for `/blog` and `/blog/[slug]`
- `content_events` for `/event` and `/event/[slug]`
- `batches` for `/join-batch` and footer batch status
- `applications` for batch application submit

### Development Fallbacks

Because Supabase public schema is currently empty, implement temporary typed fallback fixtures in `src/lib/data/fallbacks.ts`. The data access layer should try Supabase first, then fallback gracefully. This lets frontend build proceed now while keeping the code ready for backend/CMS.

## 6. Supabase Schema Required for Phase 1

Minimum tables:

### `batches`

- `id uuid primary key`
- `number int not null`
- `status text check in ('open','closed','full')`
- `seats_total int`
- `seats_remaining int`
- `open_date timestamptz`
- `close_date timestamptz`
- `created_at timestamptz default now()`

### `applications`

- `id uuid primary key`
- `batch_id uuid references batches(id)`
- `applicant_data jsonb not null`
- `status text check in ('pending','verified','rejected') default 'pending'`
- `admin_notes text`
- `created_at timestamptz default now()`

`applicant_data` includes:

- full name
- email
- institution
- expertise
- Google Scholar ID (required)
- Scopus ID or LinkedIn (optional)
- ORCID (optional)
- role/title
- H-index (optional)
- statement of intent
- target journal tier

### `research_projects`

Use PRD fields plus public display fields:

- `id uuid primary key`
- `slug text unique not null`
- `creator_id uuid null`
- `title text not null`
- `abstract text not null`
- `methodology text`
- `required_expertise jsonb`
- `status text`
- `visibility text`
- `collaborators jsonb`
- `lead_name text`
- `lead_institution text`
- `tags jsonb`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Guest query should return public/scrambled preview only.

### `content_blogs`

- `id uuid primary key`
- `slug text unique not null`
- `title text not null`
- `excerpt text`
- `content_md text`
- `cover_image text`
- `category text`
- `is_published boolean default false`
- `publish_date timestamptz`
- `seo_data jsonb`

### `content_events`

- `id uuid primary key`
- `slug text unique not null`
- `title text not null`
- `date timestamptz`
- `location text`
- `description text`
- `status text check in ('upcoming','live','ended')`
- `is_paid boolean default false`
- `capacity int`
- `registrants jsonb`
- `cover_image text`

### `contact_inquiries`

- `id uuid primary key`
- `name text not null`
- `email text not null`
- `institution text`
- `subject text`
- `message text not null`
- `source_page text`
- `created_at timestamptz default now()`

## 7. Page Designs

### Landing `/`

Sections:

1. **Hero**
   - Based on modern `Hero.jsx` slider.
   - Copy rewritten to PRD framing: Digital Research Engine, exclusive curated academic network, Scopus acceleration.
   - CTA: primary `Register Batch`, secondary `Explore Research`.
   - Top rail shows live batch status.

2. **KPI Bento**
   - Member active count
   - Paper published count
   - Average H-index
   - Active projects
   - Data source: Supabase aggregate with fallback.

3. **Research Gallery Preview**
   - Pulls latest published projects from `research_projects`.
   - Guest sees title, lead/institution, tags, truncated abstract.
   - Locked details use Curiosity Gap overlay.
   - CTA to `/research` and `/join-batch`.

4. **Program Highlight**
   - `Siap Tembus Scopus` overview.
   - Links to `/siap-tembus-scopus`.

5. **Latest Blog**
   - Pull latest 3 published posts from `content_blogs`.
   - Links to `/blog`.

6. **Upcoming Events**
   - Pull next 3 events from `content_events` with `upcoming/live` badge.
   - Links to `/event`.

7. **Social Proof / Reviews**
   - Draft testimonials adjusted to academic tone.

8. **FAQ**
   - Covers curation, eligibility, Google Scholar verification, batch decision time.

9. **Final CTA**
   - Batch application push.

### `/research`

- Server-rendered list of published projects.
- Filters are implemented as simple client-side filtering over server-fetched list data in Phase 1.
- Each card implements guest Curiosity Gap.
- Links to `/research-project/[slug]`.

### `/research-project/[slug]`

- Guest-safe detail page.
- Full title and metadata visible.
- Abstract preview truncated.
- Methodology/collaborators blurred/locked.
- CTA: `Unlock Research — Register Batch`.

### `/blog`

- SEO-friendly grid.
- Featured article.
- Category chips.
- Data from published `content_blogs`.

### `/blog/[slug]`

- Article detail with metadata and Markdown content.
- PRD style: clean editorial academic tone.

### `/event`

- Upcoming/live/ended event cards.
- Badge styling with Scopus Orange for live/upcoming.
- Links to event detail.

### `/event/[slug]`

- Event landing detail.
- RSVP CTA links to `/contact` with event context prefilled in the URL query string.

### `/about`

- Vision: Digital Research Engine & Exclusive Community.
- Problem: academic isolation and fragmented collaboration.
- Solution: curated batch-based ecosystem.

### `/siap-tembus-scopus`

- Public LMS/program teaser.
- Syllabus roadmap visual.
- Drip-feed concept explained, but no member LMS implementation yet.

### `/curation-process`

- Explain batch curation:
  1. Apply with Google Scholar ID
  2. Metadata verification
  3. Council review
  4. Approve/reject
  5. Member activation later

### `/contact`

- Partnership/contact form visual.
- Contact form submits to `/api/contact` and stores records in `contact_inquiries` (minimal table added in Phase 1).

### `/join-batch`

- Multi-step PRD form.
- Google Scholar ID is required and primary.
- Steps:
  1. Identity
  2. Academic Background
  3. Research Intent
  4. Review & Submit
- Submit writes to `applications` via `POST /api/join-batch`.
- In development without DB credentials, the API returns a mocked success payload behind an explicit `MOCK_SUBMIT=true` flag only.
- Success state references batch and 10 working day review window.

## 8. Component Boundaries

### Layout

- `Navbar`
- `Footer`
- `PublicShell`

### Shared UI

- `Button`
- `Reveal`
- `CountUp`
- `ThemeToggle`
- `LanguageSwitcher`
- `Card`
- `Badge`
- `SectionHeader`

### Public Sections

- `Hero`
- `KpiBento`
- `ResearchPreview`
- `ProgramHighlight`
- `LatestBlog`
- `UpcomingEvents`
- `Reviews`
- `FAQ`
- `FinalCTA`

### Data Access

- `src/lib/data/research.ts`
- `src/lib/data/blog.ts`
- `src/lib/data/events.ts`
- `src/lib/data/batches.ts`
- `src/lib/data/fallbacks.ts`
- `src/lib/supabase/server.ts`

## 9. Error Handling

- If Supabase query fails, fallback fixtures render and log server-side warning.
- If no data exists, show polished empty state, not broken layout.
- Join Batch validation errors appear inline per field.
- Submit errors show non-destructive alert with retry option.
- Locked research content never sends full hidden content to guest render path.

## 10. Testing and Verification

Minimum verification before calling Phase 1 complete:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- manual route check for all public routes
- responsive check: mobile, tablet, desktop
- Supabase connection check via MCP `get_project_url` and `list_tables`
- accessibility spot check: keyboard nav, focus states, color contrast

## 11. Out of Scope

- Better Auth implementation
- actual login/session flow
- dashboard admin/member
- full CMS CRUD
- LMS member progress
- PDF watermark template vault
- realtime notifications
- payment/pricing integration

## 12. Open Decisions Resolved

- Canonical design system: Modern draft system.
- Scope: all public pages from draft.
- Priority: PRD overrides draft.
- Data: hybrid, with static brand narrative sections and dynamic Supabase-fed latest research/blog/event/batch/KPI sections on landing.
- Public data source: Supabase with fallback fixtures until schema is populated.
