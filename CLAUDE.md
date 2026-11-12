# FUCK YOU — working notes for Claude

FUCK YOU is the side experience of the FAN LIFE universe: an anonymous venting wall where anyone puts a name up and others back it, at `fuckyou.dubelteam.com`. No accounts. Next.js 16 (App Router), TypeScript strict, Tailwind v4 tokens, Supabase with RLS and SECURITY DEFINER RPC, Sentry. In the universe its place is narrow on purpose: it is a derby-days-only door from the hub, never a permanent feature of the football journey.

`README.md` documents the database, the pages, the admin area and the demo mode; read it before changing any of them. `claude/brand-library.md` records every identity shipped so no two products look alike.

## Working with the owner

Maor Harel owns every app here and works alone, with Claude as the whole engineering team. These are his standing decisions; each has a reason, and the reason tells you what to do in a case the line does not name.

- **He does not use a terminal.** Do every step yourself: branch, pull request, CI, merge, migration, deploy, check on production. He authorised Claude to merge. Whatever only he can do becomes a click-only step (a page to open, a button, a value to paste) listed at the end of the report. Never a command.
- **No ZIP when you can merge.** Deliver through the repository.
- **Reports are short and businesslike**, outcome first, no tour of the steps. He writes in Hebrew, so answer in Hebrew. Product copy, marketing and code are English unless this file says otherwise.
- **Free tiers only.** Say so before a limit is near; never adopt a paid service without his yes.
- **Anything that cannot be undone waits for his yes**: deleting data, dropping objects, the Auth Site URL, domains, a new kind of public posting. Prepare everything, then ask one question.
- **Every schedule is Europe/Athens time.** Nothing personal about the owner appears in a product, in content or in marketing; public accounts are business accounts only.
- **Design is original and built for the phone first.** Each product has its own identity (never a template), mobile and desktop are two designs, touch targets are at least 44px, and the Dubel Team credit stays in the footer.
- **Say what you noticed.** If you see an upgrade, a reuse or a risk beyond the task, give it one line at the end of the report. He asked for this.

## How to work a task

The order matters more than any single step: most past failures here came from acting on a remembered picture of the code or the database instead of the current one.

1. **Read before you reason.** Start from `origin/main` as it is now, the live database object (`pg_get_functiondef`, `list_tables`) and the page on production. Several sessions change these repositories every day, so what an earlier session knew is a hypothesis to check, not a fact.
2. **Load what the task touches, not everything.** `README.md` for the area you touch. Then the contract and the capability list if the change concerns the derby door or anything shared.
3. **Run the universe check** (next section) before you design, and write its four answers in the pull request description.
4. **Find the cause before you fix.** Reproduce or measure first, then change one thing. A guard that goes red after a data change is read, not muted: it is usually right.
5. **Prove the result.** A claim is established by the script, test or screenshot that shows it. In the report, separate what you verified from what you did not. "Should work" is not a state.
6. **Work wide in parallel.** Send independent reads and searches in one batch. Use a subagent for a sweep across many files or across the other repositories, and keep the decisions in the main thread.
7. **Finish whole.** Tests, green CI, merge, the production check, then the record: the `ecosystem/capabilities.json` row if you built something reusable, the `README.md` section if behaviour changed, and the status line in the Football Master project doc if a planned connection moved.
8. **Keep this file small.** It is loaded into every session, so every paragraph here is paid for on every task. Product detail belongs in `README.md`, not here.

## The universe check

This app is one of five that share one account, one database and one map. The map is `ecosystem/contract.json` (who owns what) and `ecosystem/capabilities.json` (every engine that already exists, where it lives and who could use it). Both are the same bytes in every repository. The house skill `dubel-universe` runs this check; `ecosystem-sync` runs before anything that touches Supabase, auth, domains or `ecosystem/`.

| App | Role | Moment it owns |
|---|---|---|
| FAN LIFE · `maordubel/fanlife` | the hub: every journey starts here and comes back here | sends `before_round`, `kickoff_live`, `go_deeper`, `derby_only` |
| DUBID · `maordubel/Dubid` | companion before the round (fantasy picks) | `next_moment` to OFFSIDES, `back_to_story` to the hub |
| OFFSIDES · `maordubel/Offsides` | companion at kick-off and live (prediction arenas) | `next_moment` to DUBID, `back_to_story` to the hub |
| THE WORKER · `maordubel/The-Worker` | the premium club edition (Hapoel Tel Aviv) | `bring_depth_back` to the hub |
| FUCK YOU · `maordubel/FuckYou` | a derby-days-only side experience | `back_to_story` to the hub |

A companion is "a smart companion, never a replacement": it sends the supporter back to the hub as readily as the hub sends them out.

Answer these four in one line each, before building:

1. **Does this engine already exist?** Look it up in `ecosystem/capabilities.json`. If it does, reuse it through its owner (a shared view or RPC, a route, a handoff). Copying source between repositories is a fork, and forks are how three shirt engines came to exist.
2. **Which moment does it fire?** A link to another app is built with `createHandoff` from `ecosystem/sdk.ts` and carries its moment; the target reports `shared.handoff_outcome`. A bare URL with UTM is invisible to the funnel, and an invisible link cannot be improved.
3. **Who else gains from it?** Name the app, the marketing slot or the page that could consume what you are building. Record it as `couldUse` in the capability row. If nobody, say so.
4. **What does it cost on the free tier?** Football Master is capped at 500MB and was at 469MB on 9.11.2026: a table that grows per minute or per match ships with its retention job in the same pull request. No new paid service. Vercel Hobby is non-commercial.

Lines that do not bend, because another app breaks when they do:

- An app writes only what it owns. FUCK YOU owns the `fy_*` tables and functions on a different Supabase project, the one it shares with TakeMeOut (`wvxzhjaerfmrlvirbasc`). It has nothing on Football Master and no accounts, so SSO, rewards and membership do not apply here. Everything else is read through views and RPCs in `shared` and `core`, never by reading another app's tables.
- Value crosses apps only through `shared.grant_reward`. Currencies never mix.
- Before changing a database object, read the live one. Never rebuild a live function from a file in the repository.
- No trigger on `auth.users`, no change to the Auth Site URL, sign-out stays local.
- `ecosystem/` is byte-identical in all five repositories. A change there, or to `core`, `shared` or the contract, is a five-repository change in the same round with the contract version bumped.
- One crest library (`ecosystem/crests`, sourced from OFFSIDES). One provider reader (`ecosystem/feed`). No second copy of either.

## FUCK YOU in the universe

- **The door opens on derby days only.** The contract moment is `derby_only` (hub to here) and `back_to_story` (here to the hub's derby page). On 9.11.2026 the code had no reference to a derby or to FAN LIFE: the moment existed in the contract alone. The planned build is a temporary wall for one derby, opened from `core.fixtures`, with a countdown, a link back to the hub, and closed at midnight. It waits for the owner's yes on the idea and its limits; do not build it before that.
- **The limits of a derby wall are part of the feature.** Humour about clubs only. No private individuals, no players by name, nothing about origin or religion. The content guard (`fy_has_contact`) and report-based hiding exist; a derby wall strengthens them before it opens.
- **It stays anonymous.** No account, no universe cookie, no identity joined to another app. A link in from the hub carries its handoff token for counting the visit and nothing that identifies the person.
- **The derby date is the only football data it needs**, and it comes from the neutral fixture list (`core.fixtures` through `shared.fixtures` on Football Master, read-only), never from a provider and never from another app's table.
- **What it lends.** The story card per entry (`src/app/n/[id]/story`) and the OG card are a share format the hub's 22:00 derby post can use.
- **It shares a database with TakeMeOut.** Everything it owns is prefixed `fy_`; never touch an object without that prefix, and never add a third product to that project's free tier without the owner's yes.

## This repository's own lines

- Every write goes through a SECURITY DEFINER function (`fy_add`, `fy_vote`, `fy_report`); `fy_votes` and `fy_reports` have no policy at all. Rate limits return a value rather than raising, so the attempt is recorded.
- Migrations are idempotent and run twice cleanly against an empty database. Pin `search_path` to include `extensions` when a function needs pgcrypto (migration 0005 is the lesson).
- With no environment variables the app runs on an in-memory demo store and says so with a banner. Never mistake demo mode for production.
- `/hq` is unlinked, `noindex` and password-gated in Postgres. No secret is ever committed.
- The interface is English and LTR; a name typed in Hebrew must still render (`src/lib/bidi.ts`). WCAG 2.2 AA, zero radius, the punk-zine identity in the brand library.
- There is no CI in this repository yet: run the gates yourself before merging.

## Commands

```
npm run lint · npm run typecheck · npm run build
npm run qa:responsive     # screenshots across widths
npm run qa:flows          # the add / back / report flows
npm run qa:a11y           # accessibility
```

## Skills that apply

`dubel-universe` and `ecosystem-sync` first. Then `supabase-server-authority`, `frontend-standards`, `brand-concept`, `responsive-qa`, `dubel-credit`. Check the installed skills before starting any task.

## When this file and the code disagree

The code and the live database are the truth; this file is the map. Fix the map in the same pull request, and keep the fix as short as the thing it corrects.
