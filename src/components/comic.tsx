/** Shared original comic-book decorations (no copyrighted motifs). */

export function Web({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <line key={a} x1="0" y1="0" x2={100 * Math.cos((a * Math.PI) / 360)} y2={100 * Math.sin((a * Math.PI) / 360)} />
      ))}
      {[25, 50, 75, 100].map((r) => (
        <path key={r} d={`M ${r} 0 Q ${r * 0.8} ${r * 0.35} ${r * 0.7} ${r * 0.7} Q ${r * 0.35} ${r * 0.8} 0 ${r}`} />
      ))}
    </svg>
  );
}

export function Starburst({ label, className }: { label: string; className: string }) {
  return (
    <span
      aria-hidden
      className={`font-comic halftone-red grid place-items-center text-primary-foreground [clip-path:polygon(50%_0,61%_30%,95%_20%,72%_48%,100%_75%,65%_70%,50%_100%,38%_70%,4%_78%,28%_50%,6%_18%,40%_30%)] ${className}`}
    >
      {label}
    </span>
  );
}
