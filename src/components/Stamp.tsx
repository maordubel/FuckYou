type StampProps = {
  children: React.ReactNode;
  className?: string;
  slam?: boolean;
};

/** Signature motif: the red rubber stamp. Appears in the hero, on submit and on rank #1. */
export function Stamp({ children, className = '', slam = false }: StampProps) {
  return (
    <span className={`fy-stamp ${slam ? 'fy-stamp-slam' : ''} ${className}`.trim()}>{children}</span>
  );
}
