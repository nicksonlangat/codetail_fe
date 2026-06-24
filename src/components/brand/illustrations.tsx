/* Branded SVG illustrations — abstract, geometric, same line language as CTLogo */

interface IllustrationProps {
  size?: number;
  className?: string;
}

export function DocsReadyIllustration({ size = 56, className = "" }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`text-primary ${className}`}>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="currentColor" opacity="0.08" />
      <rect x="13" y="19" width="26" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.3" transform="rotate(-7 26 35)" />
      <rect x="19" y="14" width="26" height="32" rx="4" fill="var(--card)" stroke="currentColor" strokeWidth="2.5" />
      <path d="M25 25h14M25 31h14M25 37h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <circle cx="46" cy="43" r="12" fill="currentColor" />
      <path d="M40.5 43l3.8 3.8L51.5 39" stroke="var(--card)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function DocsPendingIllustration({ size = 56, className = "" }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`text-yellow-500 ${className}`}>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="currentColor" opacity="0.08" />
      <rect x="13" y="19" width="26" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.3" transform="rotate(-7 26 35)" />
      <rect x="19" y="14" width="26" height="32" rx="4" fill="var(--card)" stroke="currentColor" strokeWidth="2.5" />
      <path d="M25 25h14M25 31h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <path d="M25 37h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 3.5" opacity="0.55" />
      <circle cx="46" cy="43" r="12" fill="currentColor" />
      <path d="M46 37.5v6M46 47v.5" stroke="var(--card)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export function SubmittedIllustration({ size = 72, className = "" }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" className={`text-primary ${className}`}>
      <rect x="3" y="3" width="66" height="66" rx="20" fill="currentColor" opacity="0.08" />
      <rect x="16" y="24" width="40" height="28" rx="5" fill="var(--card)" stroke="currentColor" strokeWidth="2.5" />
      <path d="M17 26l17 13a3 3 0 0 0 4 0l17-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="52" cy="48" r="11" fill="currentColor" />
      <path d="M46.5 48l3.8 3.8L57 43.3" stroke="var(--card)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function InviteSentIllustration({ size = 56, className = "" }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`text-primary ${className}`}>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="currentColor" opacity="0.08" />
      <path d="M9 47q7-1.5 11.5-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" opacity="0.4" />
      <path d="M16 41 44 13l-7 16-12 3-3 12z" fill="currentColor" />
      <path d="M44 13 25 32" stroke="var(--card)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      <circle cx="45" cy="44" r="12" fill="currentColor" />
      <path d="M39.5 44l3.8 3.8L50.5 40" stroke="var(--card)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
