# Fuck You

The FUCK YOU list. Add a name, search the list, and co-sign whoever ruined your day.

Next.js 16 (App Router) · TypeScript strict · Tailwind v4 tokens · Supabase (Postgres + RLS + RPC) · WCAG 2.2 AA · mobile-first.

## Run locally

```bash
npm install
npm run dev
```

With no environment variables the app boots on an in-memory **demo store** with sample rows —
handy for local work and CI. With `.env.local` filled in it runs against a real Supabase project.

```bash
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Database

```bash
supabase db push          # or paste supabase/migrations/0001_init.sql into the SQL Editor
```

* `fy_entries` — read-only for `anon`, and only rows that are not hidden.
* `fy_votes`, `fy_reports` — no policy at all: unreadable and unwritable from the client.
* Every write goes through a `SECURITY DEFINER` function: `fy_add`, `fy_vote`, `fy_report`.
* Rate limit: 8 signatures per minute on add, 20 on vote. Failures return a value rather than
  raising, so the attempt row survives and the quota also applies to whoever is abusing it.
* Moderation: 3 unique reports hide an entry automatically.

The migration is idempotent — verified by running it twice in a row against an empty database.

## Copy and localisation

Every user-facing string lives in `src/messages/en.json` and is read through `t()`.
The layout uses logical properties throughout, so flipping `direction` in `src/lib/i18n.ts`
to `rtl` and adding a second catalogue is all a translation needs.
Hebrew webfonts stay in the stack (unpreloaded) so a name typed in Hebrew still renders.

## Proxy

`src/proxy.ts` (the Next 16 name for middleware) issues an anonymous, httpOnly
`fy_voter` cookie on first visit. It identifies a browser for signature de-duplication
and rate limiting — it is not tied to a person and carries nothing else.

## Checks

```bash
npm run lint && npm run typecheck && npm run build
npm audit --audit-level=high
npm run qa:responsive   # viewport matrix -> qa/screenshots
npm run qa:flows        # add, duplicate, search, vote, mobile sheet
```
