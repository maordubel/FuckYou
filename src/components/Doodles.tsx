/**
 * Every ornament in the product, drawn by hand as one sprite.
 * Stroked paths carry pathLength="1" so a single inherited
 * stroke-dashoffset animates them as if a marker were drawing them.
 */
export function Doodles() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <symbol id="d-crown" viewBox="0 0 60 44">
        <path d="M4 40c1-11 3-22 5-33 4 6 8 12 12 17 3-7 6-14 9-21 3 7 6 14 9 21 4-5 8-11 12-17 2 11 4 22 5 33-17 3-35 3-52 0Z" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" pathLength="1" />
      </symbol>

      <symbol id="d-scribble" viewBox="0 0 140 18">
        <path d="M3 12c22-7 46-9 68-6 10 2 20 5 30 3 12-2 22-6 36-3" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" pathLength="1" />
        <path d="M14 17c26-6 52-8 78-5 13 2 26 4 42 1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity=".7" pathLength="1" />
      </symbol>

      <symbol id="d-arrow" viewBox="0 0 46 26">
        <path d="M2 13h36" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" pathLength="1" />
        <path d="M28 3l14 10-14 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
      </symbol>

      <symbol id="d-scrawl" viewBox="0 0 30 20">
        <path d="M2 15c6-9 12-13 17-11 4 2 1 8-3 9-5 1-7-4-3-7 5-4 12-3 16 2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" pathLength="1" />
      </symbol>

      <symbol id="d-heart" viewBox="0 0 48 44">
        <path d="M24 40C12 31 4 24 4 16 4 9 9 4 15 4c4 0 7 2 9 5 2-3 5-5 9-5 6 0 11 5 11 12 0 8-8 15-20 24Z" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" pathLength="1" />
        <path d="M42 8l5-4M44 16l6-1M38 3l2-3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" pathLength="1" />
      </symbol>

      <symbol id="d-person" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M3.5 21c1-5 4.6-7.6 8.5-7.6S19.5 16 20.5 21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </symbol>

      <symbol id="d-x" viewBox="0 0 30 30">
        <path d="M5 5l20 20M25 5L5 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" pathLength="1" />
      </symbol>

      {/* mood faces */}
      <symbol id="m1" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.6" /><circle cx="14" cy="17" r="1.9" fill="currentColor" /><circle cx="26" cy="17" r="1.9" fill="currentColor" /><path d="M13 27h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></symbol>
      <symbol id="m2" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.6" /><path d="M10 14l7 3M30 14l-7 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /><circle cx="14" cy="19" r="1.9" fill="currentColor" /><circle cx="26" cy="19" r="1.9" fill="currentColor" /><path d="M13 28h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></symbol>
      <symbol id="m3" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.6" /><path d="M9 13l8 4M31 13l-8 4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><circle cx="14" cy="20" r="2" fill="currentColor" /><circle cx="26" cy="20" r="2" fill="currentColor" /><path d="M13 30c3-3 11-3 14 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></symbol>
      <symbol id="m4" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="currentColor" /><path d="M9 12l9 5M31 12l-9 5" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" /><circle cx="14" cy="21" r="2.2" fill="var(--color-paper)" /><circle cx="26" cy="21" r="2.2" fill="var(--color-paper)" /><path d="M12 31c2-4 14-4 16 0" fill="none" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" /></symbol>
      <symbol id="m5" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="currentColor" /><path d="M10 14l7 7M17 14l-7 7M23 14l7 7M30 14l-7 7" stroke="var(--color-paper)" strokeWidth="2.8" strokeLinecap="round" /><path d="M13 28h14" stroke="var(--color-paper)" strokeWidth="2.8" strokeLinecap="round" /><path d="M20 28c0 4 3 6 5 4" fill="none" stroke="var(--color-paper)" strokeWidth="2.6" strokeLinecap="round" /></symbol>

      {/* reasons */}
      <symbol id="r-heart" viewBox="0 0 24 24"><path d="M12 21C6 16.5 2 13 2 8.8 2 5.6 4.5 3 7.6 3c1.9 0 3.5 1 4.4 2.5C12.9 4 14.5 3 16.4 3 19.5 3 22 5.6 22 8.8 22 13 18 16.5 12 21Z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 5.5l-2 5 3.4 2-2.4 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></symbol>
      <symbol id="r-idiot" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="6" cy="5.5" r="3" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="18" cy="5.5" r="3" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="9.5" cy="12" r="1.4" fill="currentColor" /><circle cx="14.5" cy="12" r="1.4" fill="currentColor" /><path d="M9 17c2 1.6 4 1.6 6 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></symbol>
      <symbol id="r-mad" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M6 8l4 2.4M18 8l-4 2.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="8.8" cy="13" r="1.3" fill="currentColor" /><circle cx="15.2" cy="13" r="1.3" fill="currentColor" /><path d="M8 18c2-2 6-2 8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
      <symbol id="r-skull" viewBox="0 0 24 24"><path d="M12 2.5c5 0 8.5 3.4 8.5 8 0 3-1.6 4.6-2.6 5.6-.6.6-.9 1.2-.9 2v1.4c0 1-.8 1.8-1.8 1.8H8.8c-1 0-1.8-.8-1.8-1.8V18c0-.8-.3-1.4-.9-2C5.1 15 3.5 13.5 3.5 10.5c0-4.6 3.5-8 8.5-8Z" fill="none" stroke="currentColor" strokeWidth="1.9" /><circle cx="8.8" cy="11" r="1.9" fill="currentColor" /><circle cx="15.2" cy="11" r="1.9" fill="currentColor" /><path d="M10.5 16.5h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
      <symbol id="r-toxic" viewBox="0 0 24 24"><path d="M4 7h16l-1.4 13.2a1.6 1.6 0 0 1-1.6 1.4H7a1.6 1.6 0 0 1-1.6-1.4Z" fill="none" stroke="currentColor" strokeWidth="1.9" /><path d="M2.5 7h19M9 4.2h6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /><path d="M10 11v7M14 11v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></symbol>
      <symbol id="r-snake" viewBox="0 0 24 24"><path d="M5 20c6 0 6-5 10-5s3-4 0-4-6 2-8-1 2-6 6-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="14" cy="5.4" r="1.2" fill="currentColor" /></symbol>
      <symbol id="r-ghost" viewBox="0 0 24 24"><path d="M4.5 21V9.5a7.5 7.5 0 0 1 15 0V21l-2.5-2-2.5 2-2.5-2-2.5 2Z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" /><circle cx="9.5" cy="10" r="1.4" fill="currentColor" /><circle cx="14.5" cy="10" r="1.4" fill="currentColor" /></symbol>
      <symbol id="r-money" viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.9" /><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M6 9.5v5M18 9.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></symbol>
      <symbol id="r-bang" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="currentColor" /><path d="M7 8l3.5 2.5M17 8l-3.5 2.5" stroke="var(--color-paper)" strokeWidth="2" strokeLinecap="round" /><path d="M7.5 17.5h9" stroke="var(--color-paper)" strokeWidth="2.2" strokeLinecap="round" /><path d="M9 12.5l1.5 1.5M15 12.5l-1.5 1.5" stroke="var(--color-paper)" strokeWidth="2" strokeLinecap="round" /></symbol>
      <symbol id="r-other" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></symbol>

      {/* nav + share */}
      <symbol id="n-bolt" viewBox="0 0 24 24"><path d="M13.5 2 4 13.5h6L10 22l9.5-11.5h-6Z" fill="currentColor" /></symbol>
      <symbol id="n-wall" viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M2.5 9.5h19M9 9.5v10M15 4.5v5" stroke="currentColor" strokeWidth="2" /></symbol>
      <symbol id="s-whatsapp" viewBox="0 0 24 24"><path d="M12 2.6A9.3 9.3 0 0 0 4 16.7L2.7 21.4l4.8-1.3A9.3 9.3 0 1 0 12 2.6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M8.6 8c.3-.7.6-.7 1-.7h.7c.2 0 .5 0 .7.6l.8 1.9c.1.3 0 .5-.1.7l-.5.6c-.2.2-.3.4-.1.7.5.9 1.4 1.8 2.4 2.3.3.2.5.1.7-.1l.6-.7c.2-.2.4-.2.7-.1l1.8.9c.3.1.5.3.5.5v.9c0 .5-.4 1.2-1.4 1.3-2.9.2-7.6-3.6-8-6.7-.1-1 .1-1.6.2-2.1Z" fill="currentColor" /></symbol>
      <symbol id="s-story" viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 7v8M8.5 11.5 12 15l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="s-link" viewBox="0 0 24 24"><path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.4 1.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.4-1.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
      <symbol id="s-share" viewBox="0 0 24 24"><path d="M12 16V3.5M8 7l4-3.5L16 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 13v6.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></symbol>
    </svg>
  );
}
