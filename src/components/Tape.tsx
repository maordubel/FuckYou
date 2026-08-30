/** A section label torn from black brush tape. */
export function Tape({ children, width = 260 }: { children: React.ReactNode; width?: number }) {
  return (
    <span
      className="fy-marker relative inline-block -rotate-[1.2deg] px-4 pt-[5px] pb-[7px] text-[0.9375rem] tracking-[0.06em] text-paper uppercase"
      data-anim
    >
      <svg
        className="fy-tape-bg absolute inset-0 text-ink"
        viewBox={`0 0 ${width} 34`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={`M2 7c${width * 0.23}-6 ${width * 0.5}-8 ${width - 4}-4 3 8 2 18 0 26-${width * 0.32}
             6-${width * 0.68} 6-${width - 6} 2-3-8-4-16-2-24Z`}
          fill="currentColor"
        />
      </svg>
      <span className="fy-tape-text relative">{children}</span>
    </span>
  );
}
