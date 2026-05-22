# Gombe ICT Club

A school club website for Gombe Senior Secondary School's ICT Club — covering software engineering, cybersecurity, and gaming departments.

## Run & Operate

- `pnpm --filter @workspace/gombe-ict-club run dev` — run the web app (port 20671)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind v4 + Wouter (routing) + shadcn/ui
- Auth & DB: Supabase (email/password + Google OAuth)
- Theme: Neo-brutalist dark (background #0A0A0A, yellow #FFE500, blue #2563FF, green #00E676)
- API: Express 5 (used for future server-side routes)

## Where things live

- `artifacts/gombe-ict-club/` — main React/Vite web app
- `artifacts/gombe-ict-club/src/pages/` — all pages (Home, Coding, Cyber, Gaming, Announcements, Account, Auth, Members)
- `artifacts/gombe-ict-club/src/contexts/AuthContext.tsx` — Supabase auth + user profile state
- `artifacts/gombe-ict-club/src/data/bootcamp-data.ts` — all lesson notes and quiz questions
- `artifacts/gombe-ict-club/src/components/LessonNotesModal.tsx` — lesson notes shown before quizzes
- `artifacts/gombe-ict-club/src/components/CodeEditor.tsx` — in-browser code editor (Coding page)
- `artifacts/gombe-ict-club/.env` — Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

## Architecture decisions

- Direct Supabase client queries from the frontend — no API server needed for this artifact
- Role system: `member` (default), `admin`, `super_admin` (gated by `profiles.role` in Supabase)
- Super admin email: `hpro453176@gmail.com` — auto-promoted on first sign-in via AuthContext
- Lesson progression: lesson 1 is unlocked; subsequent lessons unlock after quiz completion
- Lesson notes modal always shown before a quiz attempt can begin

## Product

The Gombe ICT Club site has three departments:
1. **Software Engineering** — tracks from HTML basics to React, with code editor and quizzes
2. **Cybersecurity** — tracks covering networks, Linux, web security with notes + quizzes
3. **Gaming** — PS4/PS5 session scheduling and leaderboards (admin-managed)

Members can sign up, track their learning progress, and earn role badges. Admins manage announcements, gaming sessions, and member roles via the Account page admin panel.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Vite config must read PORT from env var (set to 20671 by artifact.toml) — do not hardcode 3000
- Supabase credentials are in `.env`, not in environment secrets — this is intentional for Vite VITE_ prefix exposure
- The `@workspace/gombe-ict-club` package name is required for pnpm workspace resolution
- Root tsconfig.json only references composite libs — do not add the gombe-ict-club artifact there

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Supabase `profiles` table stores: id, username, full_name, role, avatar_url, bio, created_at
