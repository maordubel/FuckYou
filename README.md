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

## Database — shared with TakeMeOut

This runs on the **same Supabase project as TakeMeOut**. Everything it owns is
prefixed `fy_`, so the two products never collide: `fy_entries`, `fy_votes`,
`fy_reports`, `fy_audit`, `fy_admin`, `fy_admin_sessions`, `fy_admin_attempts`,
and functions named `fy_*`. Dropping this product later is a matter of dropping
that prefix.

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
* Content guard: `fy_has_contact` refuses phone numbers, emails, links and
  handles inside `fy_add`, so no client can put contact details on the wall.
* Audit: a trigger on `fy_entries` records inserts, deletes and human edits —
  on the table, so a manual `UPDATE` from the SQL editor is caught too.

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
| `/hq` | The admin area. Not linked from anywhere and disallowed in robots.txt |
| `/api/bot` | The daily seeding bot, secret-gated |
| `/robots.txt`, `/sitemap.xml` | Generated |

## A page that ends

The wall shows 12 names and a **Show more** button that adds twelve at a time
through a `?show=` parameter, so the page has a bottom no matter how many names
the bot has added and the footer is always reachable on a phone.

## Demo mode

Without Supabase keys the app runs on an in-memory store that dies with the
process — fine locally, disastrous to mistake for the real thing. So it says so:
a pink banner under the masthead, and `/hq` answers "No database configured"
rather than "wrong password".

## HQ — the admin area

`/hq` is unlinked and `noindex`. The password lives in Postgres as a bcrypt hash
and is checked there; a correct login gets a session token the database issued,
carried in an httpOnly cookie scoped to `/hq` and valid for 12 hours. Ten bad
guesses in fifteen minutes locks the door, and the counter survives a failure
because the function returns a value rather than raising.

Inside: search, inline edit of name, reason and backing, hide, delete, and the
recent-changes log. Every one of those is a `SECURITY DEFINER` function that
checks the token on its first line.

> **Migration 0005 matters.** On Supabase, pgcrypto lives in the `extensions`
> schema, and the admin functions originally pinned `search_path = public,
> pg_temp` — so `crypt()` was invisible to them and every login failed with the
> right password. 0005 widens the pinned path to include `extensions` and clears
> the failed-attempt lockout. Run it.

**Set the password.** The migrations seed the admin row with a random password
that is generated inside the database and immediately forgotten, so no secret is
ever committed here. Set your own from the SQL editor before you use `/hq`:

```sql
update public.fy_admin set password_hash = crypt('<your password>', gen_salt('bf', 12)) where id = 1;
```

Once you are signed in you can change it without touching SQL:

```sql
select public.fy_admin_set_password('<session token>', '<current>', '<new password>');
```

Or reset it outright from the SQL editor:

```sql
update public.fy_admin set password_hash = crypt('<new password>', gen_salt('bf', 12)) where id = 1;
delete from public.fy_admin_sessions;
```

## The bot

`/api/bot` adds two to four names a day, weighted about half English with Greek,
Hebrew, Bulgarian, Spanish and Russian behind it, each landing with one to six
backings so the wall reads as a place people already use. It writes through the
same `fy_add` and `fy_vote` as any visitor, so the duplicate merge, the content
guard and the rate limits all still apply to it.

Its whole vocabulary is `src/lib/bot/names.json` — archetypes and ordinary
invented personal names. Edit that file to change what it says; nothing is
generated at runtime.

Vercel Cron calls it daily at 09:17 UTC using `CRON_SECRET`. To fire it by hand,
set `BOT_SECRET` and call `/api/bot?key=…`.

## Realtime, Turnstile, Sentry

* **Realtime** — the wall subscribes to `fy_entries` and refreshes itself, so a
  count climbs while you are looking at it. Migration 0003 adds the table to the
  `supabase_realtime` publication.
* **Turnstile** — inert until both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
  `TURNSTILE_SECRET_KEY` exist. The widget renders, the server action verifies,
  and a Cloudflare outage fails open rather than taking the wall down.
* **Sentry** — inert without `NEXT_PUBLIC_SENTRY_DSN`. Cookies, auth headers and
  user objects are stripped before send; the wall is anonymous and stays that
  way. Setting `SENTRY_ORG` additionally turns on source-map upload at build.

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
