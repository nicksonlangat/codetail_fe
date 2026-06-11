type LogoProps = { className?: string };

export function PythonLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="#4584B6" d="M54.9 5C34.1 5 35.4 13.8 35.4 13.8L35.4 23H55.2V26H22.3C22.3 26 11 24.6 11 45.6C11 66.7 20.8 66 20.8 66H26.6V55.4C26.6 55.4 26.3 45.6 36.3 45.6H55.9C55.9 45.6 65.2 45.7 65.2 36.6V16C65.2 16 66.6 5 54.9 5ZM44.8 11.4C46.8 11.4 48.4 13 48.4 15C48.4 17 46.8 18.6 44.8 18.6C42.8 18.6 41.2 17 41.2 15C41.2 13 42.8 11.4 44.8 11.4Z"/>
      <path fill="#FFD43B" d="M55.1 105C75.9 105 74.6 96.2 74.6 96.2L74.6 87H54.8V84H87.7C87.7 84 99 85.4 99 64.4C99 43.3 89.2 44 89.2 44H83.4V54.6C83.4 54.6 83.7 64.4 73.7 64.4H54.1C54.1 64.4 44.8 64.3 44.8 73.4V94C44.8 94 43.4 105 55.1 105ZM65.2 98.6C63.2 98.6 61.6 97 61.6 95C61.6 93 63.2 91.4 65.2 91.4C67.2 91.4 68.8 93 68.8 95C68.8 97 67.2 98.6 65.2 98.6Z"/>
    </svg>
  );
}

export function DjangoLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="#092E20" d="M11.146 0h3.924v18.165c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 0 0-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v11.996c0 4.148-.306 6.14-1.198 7.848-.84 1.656-1.937 2.73-4.206 3.88l-3.644-1.732c2.269-1.07 3.366-2.04 4.079-3.516.74-1.504.995-3.24.995-7.796V6.059h3.974zM17.34.001h3.973v4.026H17.34z"/>
    </svg>
  );
}

export function FastAPILogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fill="#009485" d="M12 0C5.375 0 0 5.375 0 12c0 6.628 5.375 12 12 12 6.628 0 12-5.372 12-12 0-6.625-5.372-12-12-12zm-.624 21.62v-7.528H7.19L13.203 2.38v7.528h4.029L11.376 21.62z"/>
    </svg>
  );
}

export function GoLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <ellipse cx="22" cy="30" rx="11" ry="14" fill="#00ADD8"/>
      <ellipse cx="78" cy="30" rx="11" ry="14" fill="#00ADD8"/>
      <ellipse cx="22" cy="30" rx="6.5" ry="9" fill="#C9EEFB"/>
      <ellipse cx="78" cy="30" rx="6.5" ry="9" fill="#C9EEFB"/>
      {/* Head */}
      <ellipse cx="50" cy="55" rx="38" ry="34" fill="#00ADD8"/>
      {/* Eye whites */}
      <circle cx="34" cy="44" r="11" fill="white"/>
      <circle cx="66" cy="44" r="11" fill="white"/>
      {/* Pupils */}
      <circle cx="36" cy="44" r="5.5" fill="#1A1A2E"/>
      <circle cx="68" cy="44" r="5.5" fill="#1A1A2E"/>
      {/* Eye highlights */}
      <circle cx="38.5" cy="41" r="2" fill="white"/>
      <circle cx="70.5" cy="41" r="2" fill="white"/>
      {/* Snout */}
      <ellipse cx="50" cy="64" rx="17" ry="13" fill="#C9EEFB"/>
      {/* Nose */}
      <ellipse cx="50" cy="57" rx="5.5" ry="3.5" fill="#1A1A2E"/>
    </svg>
  );
}

export function StackLogo({ stack, className }: { stack: string; className?: string }) {
  switch (stack.toLowerCase()) {
    case "python":         return <PythonLogo  className={className} />;
    case "django":         return <DjangoLogo  className={className} />;
    case "fastapi":        return <FastAPILogo className={className} />;
    case "go": case "golang": return <GoLogo  className={className} />;
    default:               return null;
  }
}
