# Brand library — Dubel Team

A record of every visual identity shipped, so no two projects look alike.
Before starting a new project, read this file and do not reuse a palette family,
font pairing or leading concept listed here.

---

## Fuck You (2026)

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
| **Status** | In use. |

### In use

| Project | Palette family | Display face | Motif |
|---|---|---|---|
| Fuck You | bone + ink + burnt red + acid lime | Karantina | red rubber stamp |
