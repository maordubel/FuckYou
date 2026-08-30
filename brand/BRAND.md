# FUCK YOU — brand book

Punk zine. Photocopied paper, a highlighter swipe, brush black, one hot pink.
Everything decorative is drawn by hand, and it arrives on screen by being drawn
rather than by fading in.

**Site:** fuckyou.dubelteam.com
**One line:** Say it. Don't send it.

---

## 1 · The idea

Someone ruined your day. You put their name up, and every stranger who felt the
same backs it. The product is a wall of names and a number that climbs. The tone
is a joke told with a straight face: the design is loud, the copy is blunt, and
the target is always a behaviour, never a person's body, race, religion or
anything they cannot change.

**Anti-target — what this must never look like:** a clean SaaS landing page, a
dark-mode neon meme app, a purple gradient, rounded cards with drop shadows,
emoji as decoration, stock illustration.

---

## 2 · Colour

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--color-paper` | `#EFEBE3` | The ground. Everything sits on it. | — |
| `--color-paper-2` | `#E5E0D6` | Second surface, rarely needed. | — |
| `--color-ink` | `#121110` | All text, all borders, the brush shapes. | 15.5:1 on paper |
| `--color-ink-70` | `#514D47` | Secondary text, fine print. | 7.4:1 on paper |
| `--color-ink-40` | `#8A847B` | Placeholders only. | 3.4:1 — never body text |
| `--color-lime` | `#D8F32B` | The highlighter. Behind the wordmark, the lead row, one button. | ink on lime 12.8:1 |
| `--color-pink` | `#F5216B` | The selected mood, the backed state, the marker line. | white on pink 4.6:1 |
| `--color-pink-ink` | `#C8004F` | Pink as text on paper. | 6.1:1 |

**Rules.** Lime is a highlighter, not a background — it goes behind something,
never under a paragraph. Pink appears once per screen at most. Never put pink
text on lime. Never tint the paper.

---

## 3 · Type

| Face | Role | Where |
|---|---|---|
| **Anton** | Poster caps | Wordmark, rank numbers, counts, page headings |
| **Permanent Marker** | Handwriting | Tape labels, the big button, the tagline, status lines |
| **Archivo** 400/600/700 | Reading | Names, body copy, buttons |
| **Courier Prime** | Fine print | Reason tags, counters, legal, the domain |

Anton is uppercase only. Permanent Marker never sets more than six words.
Archivo carries every name, so it is the face that has to survive any language.

**Names in other scripts.** A name can arrive in any language. Latin comes from
Archivo; Hebrew, Arabic, Cyrillic, Greek, Devanagari and Thai each fall to a
matching self-hosted Noto face, downloaded only when a character needs it. CJK
falls to the system stack on purpose — a Noto CJK file is 5–10 MB and would cost
every visitor the budget. Every name is wrapped in `<bdi dir="auto">` with
`unicode-bidi: plaintext`, so a right-to-left name keeps its own direction
inside the left-to-right page.

---

## 4 · The marker

One motif: **it is drawn, not placed.** Every ornament is an SVG path with
`pathLength="1"`, so a single inherited `stroke-dashoffset` animation makes a
marker travel along it. The highlighter is wiped left to right with `clip-path`.
Brush tape slaps down, then its text appears.

The library: the crown, the scribble underline, the arrow, the scrawl in the
field, the heart, the sparks, the torn strip, the dead-face sticker.

**Timing.** Draw 620ms on `cubic-bezier(.4,.05,.2,1)`. Taps 120ms. Landing and
bumps on `cubic-bezier(.2,1.4,.35,1)`. Chips stagger 45ms apart. Nothing loops,
nothing moves on its own, and every one of these is off under
`prefers-reduced-motion`.

**The witness.** A small face in the corner follows the pointer, goes wide-eyed
when a name is sent and grins when one is backed. It is the only element that
reacts without being asked. Keep it to one per screen.

---

## 5 · Logo

| File | Use |
|---|---|
| `logo/logo-primary.svg` | Default. Wordmark on the lime swipe. |
| `logo/logo-horizontal.svg` | One line, for banners and wide spaces. |
| `logo/logo-mono-black.svg` | One colour on light grounds, print, embroidery. |
| `logo/logo-mono-paper.svg` | One colour on black grounds and merch. |
| `logo/mark.svg` | The face. App icon, avatars, anywhere square. |
| `logo/mark-lime.svg` | The face on lime. Social avatars. |
| `logo/favicon.svg` | Browser icon. |

The wordmark is Anton converted to outlines, so no file here needs a font.

**Clear space** equals the height of the `F`. **Minimum width** 96px for the
stacked wordmark, 140px for the horizontal one, 24px for the mark.

**Never:** re-colour the wordmark, put it on a photograph, outline it, add a
shadow, stretch it, rotate it past ±3°, or set the two words on one line in the
stacked lockup.

---

## 6 · Voice

Short. Second person. Present tense. The joke is always the behaviour.

| Do | Don't |
|---|---|
| "Who pissed you off?" | "Report an incident" |
| "Me too" | "Upvote" |
| "Someone beat you to it." | "This entry already exists." |
| "Too short. Try harder." | "Please enter at least 2 characters." |
| "No signup. No tracking. No one needs to know." | "We value your privacy." |

Swearing belongs in the product name, the button and the section labels. It does
not belong in errors — an error is the one place the app is sincere.

**Never** aim at anything a person cannot change. Every entry carries a report
control and three reports hide it.

---

## 7 · Sharing

Every name has its own page at `/n/<id>` and generates two images at request
time, so no asset is ever reused:

* **1200×630** for links and previews — `/n/<id>/opengraph-image`
* **1080×1920** for stories and WhatsApp status — `/n/<id>/story`

Four ways out, in this order: WhatsApp with the line pre-written, save the story
card, the system share sheet, copy link. WhatsApp is first because it is where
this gets forwarded.

Both cards use the same composition: wordmark on lime top-left, tagline
top-right, the reason in Courier caps, the name in Archivo Bold, the count in
Anton at the largest size on the card, the domain bottom-right.

---

## 8 · Social kit

`social/` holds ready files at native sizes:

| File | Size | Use |
|---|---|---|
| `avatar-1080.png` | 1080² | Instagram, TikTok, X avatar |
| `avatar-square-wordmark-1080.png` | 1080² | Alternate avatar |
| `instagram-post-1080.png` | 1080² | Feed post template |
| `instagram-story-1080x1920.png` | 1080×1920 | Story template |
| `x-banner-1500x500.png` | 1500×500 | X header |
| `tiktok-avatar-720.png` | 720² | TikTok |
| `apple-icon-180.png` | 180² | Home-screen icon |

---

## 9 · The floor

WCAG 2.2 AA on every screen: 4.5:1 body, 3:1 large text and UI edges, 44px touch
targets, visible focus, a complete keyboard path, motion off under
`prefers-reduced-motion`. Mobile and desktop are separate layouts, verified from
320px to 1920px. The Dubel Team credit sits in the footer of every page.
