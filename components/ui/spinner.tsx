const sizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
};

interface SpinnerProps {
  size?: keyof typeof sizes;
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const px = sizes[size];
  const r = 10;
  const circumference = 2 * Math.PI * r; // 62.83
  const arc = circumference * 0.75;      // 75% visible arc

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* track */}
      <circle
        cx="12"
        cy="12"
        r={r}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.15"
      />
      {/* arc */}
      <circle
        cx="12"
        cy="12"
        r={r}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${arc} ${circumference}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
