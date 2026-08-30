export function Tape({ text }: { text: string }) {
  return (
    <div className="fy-tape border-y-2 border-ink">
      <p className="px-4 py-1.5 text-center text-xs font-bold tracking-wide text-acid">{text}</p>
    </div>
  );
}
