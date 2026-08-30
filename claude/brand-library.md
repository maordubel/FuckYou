# Brand library — Dubel Team

A record of every visual identity shipped, so no two projects look alike.
Before starting a new project, read this file and do not reuse a palette family,
font pairing or leading concept listed here.

---

## Fuck You (2026) — superseded, do not reuse

| | |
|---|---|
| **Concept** | A public venting ledger. The page behaves like a wall someone stamped in anger: you write a name, the world co-signs it. |
| **Territory** | Brutalist protest-print — riot poster meets office rubber stamp. |
| **Anti-target (rejected)** | The obvious meme app: dark mode, neon purple→blue gradient, rounded cards, emoji everywhere, soft shadows. Rejected as anonymous and toothless. |
| **Signature motif** | The red rubber stamp (`.fy-stamp`) — rotated −6°, double-ruled, `mix-blend-mode: multiply`. It appears in the hero, slams down on submit, and marks rank #1. Supported by ledger hairlines behind lists and a caution-tape band across the top. |
| **Palette** | paper `#E9E2D2` · paper-2 `#DED5C2` · ink `#101010` · ink-70 `#4A463C` · tar `#17150F` · blood `#E4340F` (display/borders only, 3.4:1) · blood-ink `#B32409` (text/buttons, 5.1:1) · acid `#C8FF00` (on dark only, 15:1) |
| **Typography** | Display: **Karantina** 400/700 (condensed poster face). Body: **Heebo** 400/700/900. Both self-hosted woff2 through `next/font/local`. Interface is English/LTR; the Hebrew faces stay in the stack unpreloaded so a name typed in Hebrew still renders. |
| **Geometry** | Zero radius everywhere. 2px ink borders with a hard 3–4px offset shadow (`.fy-block`) — printed, not elevated. |
| **Motion** | `--ease-slam` `cubic-bezier(.2,1.4,.3,1)`; 90ms taps, 220ms stamp slam, 160ms error shake. Everything else deliberately still. Fully disabled under `prefers-reduced-motion`. |
| **Status** | Retired. Replaced by the punk-zine identity below. |

### In use

| Project | Palette family | Display face | Motif |
|---|---|---|---|
| Fuck You | bone + ink + burnt red + acid lime | Karantina | red rubber stamp |

---

## Fuck You (2026) — punk zine · IN USE

| | |
|---|---|
| **Concept** | A photocopied flyer taped to a pole. Someone writes a name in marker, strangers sign under it. |
| **Territory** | Punk zine / riso poster. |
| **Anti-target (rejected)** | Clean SaaS landing page; dark-mode neon meme app; purple gradient; rounded cards with shadows; emoji as decoration. |
| **Signature motif** | The marker arriving. Every ornament is an SVG path with `pathLength="1"` and draws itself on; the highlighter wipes left to right; brush tape slaps down. Supported by a hand-drawn library — crown, scribble, arrow, scrawl, heart, sparks, torn strip, dead-face sticker. |
| **Palette** | paper `#EFEBE3` · ink `#121110` (15.5:1) · ink-70 `#514D47` (7.4:1) · lime `#D8F32B` (highlighter only) · pink `#F5216B` (one per screen) · pink-ink `#C8004F` (6.1:1) |
| **Typography** | Anton (poster caps) · Permanent Marker (handwriting) · Archivo 400/600/700 (reading, and every name) · Courier Prime (fine print). Self-hosted; Noto per script behind Archivo for non-Latin names. |
| **Geometry** | Zero radius. 2–2.5px ink borders, hard offset shadows, hand-drawn brush shapes instead of rectangles. |
| **Motion** | Draw 620ms `cubic-bezier(.4,.05,.2,1)`; taps 120ms; landings and bumps `cubic-bezier(.2,1.4,.35,1)`; 45ms chip stagger. Nothing loops. All of it off under `prefers-reduced-motion`. |
| **Live character** | The witness — a face that follows the pointer, widens on submit, grins on backing. |
| **Status** | In use at fuckyou.dubelteam.com. |

### In use

| Project | Palette family | Display face | Motif |
|---|---|---|---|
| Fuck You | photocopy paper + ink + highlighter lime + hot pink | Anton + Permanent Marker | the marker arriving |
