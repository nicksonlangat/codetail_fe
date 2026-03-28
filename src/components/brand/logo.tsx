/* CT Monogram — shared logo component for all surfaces */

export function CTLogo({ size = 24, variant = "primary" }: { size?: number; variant?: "primary" | "dark" | "light" | "mono-white" }) {
  if (variant === "dark") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="#121418" stroke="#1fad87" strokeWidth="1.5" />
        <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  if (variant === "light") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="white" stroke="#D0D5DA" strokeWidth="1" />
        <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  if (variant === "mono-white") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
        <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // Primary — teal bg, white mark
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#1fad87" />
      <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
