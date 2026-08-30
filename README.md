# FUCK YOU

Put a name up. Everyone who agrees backs it. Anonymous, no account, no one needs
to know.

**Live:** https://fuckyou.dubelteam.com

Next.js 16 (App Router) · TypeScript strict · Tailwind v4 tokens · Supabase
(Postgres + RLS + SECURITY DEFINER RPC) · WCAG 2.2 AA · mobile-first.

---

## Run it

```bash
npm install
npm run dev
```

With no environment variables the app boots on an in-memory demo store with
sample rows — handy for local work, CI and design review. With `.env.local`
filled in it runs against a real Supabase project.

```bash
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_SITE_URL=https://fuckyou.dubelteam.com   (optional; this is the default)
```

## Database

```bash
supabase db push     # or paste supabase/migrations/*.sql into the SQL Editor, in order
```

* `fy_entries` — read-only for `anon`, and only rows that are not hidden.
* `fy_votes`, `fy_reports` — no policy at all: unreadable and unwritable from the client.
* Every write goes through a `SECURITY DEFINER` function: `fy_add`, `fy_vote`, `fy_report`.
* `fy_lookup` answers "is this name already up?" using the database's own
  normalisation, so the client can never disagree with it about who is who.
* Rate limit: 8 per minute on add, 20 on back. Failures return a value rather
  than raising, so the attempt row survives and the quota also applies to whoever
  is abusing it.
* Moderation: 3 unique reports hide an entry.

Both migrations are idempotent — verified by running the whole set twice against
an empty database.

The reason chips write into `entries.reason`; there is no separate tag column and
no migration is needed to add or change a chip. The mood picker is interface
only — it colours the moment, it is not stored.

## Pages

| Route | What |
|---|---|
| `/` | The vent form and the wall |
| `/n/[id]` | One name: the count, backing it, and every way to send it on |
| `/n/[id]/opengraph-image` | 1200×630 card, generated per name |
| `/n/[id]/story` | 1080×1920 card for stories and WhatsApp status |
| `/opengraph-image` | The site card |
| `/robots.txt`, `/sitemap.xml` | Generated |

## Brand

Everything is in `brand/` — the guidelines, the logo family as SVG, and the
social kit at native sizes. Start at `brand/BRAND.md`.

## Copy and localisation

Every user-facing string lives in `src/messages/en.json` and is read through
`t()`. The layout uses logical properties throughout, so flipping `direction` in
`src/lib/i18n.ts` and adding a second catalogue is all a translation needs.
Names arrive in any script and are typeset by `--font-name` in one place.

## Proxy

`src/proxy.ts` (Next 16's name for middleware) issues an anonymous, httpOnly
`fy_voter` cookie on first visit. It identifies a browser for de-duplication and
rate limiting — it is not tied to a person and carries nothing else.

## Checks

```bash
npm run lint && npm run typecheck && npm run build
npm audit --audit-level=high
npm run qa:responsive   # 320 → 1920, both pages, targets and overflow
npm run qa:flows        # add, duplicate merge, back, entry page, share row
npm run qa:a11y         # reduced motion, focus ring, keyboard path
npm run brand:kit       # regenerate the social kit from the logo files
```
