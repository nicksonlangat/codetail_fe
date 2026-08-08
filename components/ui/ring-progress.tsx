interface RingProgressProps {
  value: number;
  size: number;
  stroke: number;
  inView: boolean;
}

export function RingProgress({ value, size, stroke, inView }: RingProgressProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ width: size, height: size }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--brand-surface)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--brand-primary)"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={inView ? c - (value / 100) * c : c}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}
