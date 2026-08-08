import React from "react";

function PythonLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <defs>
        <linearGradient id="py-top" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5A9FD4" />
          <stop offset="1" stopColor="#306998" />
        </linearGradient>
        <linearGradient id="py-bot" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFD43B" />
          <stop offset="1" stopColor="#FFE873" />
        </linearGradient>
      </defs>
      {/* top snake body */}
      <path
        d="M127.5 20C93 20 95 35 95 35l.04 15.5h33V55H80S55 52 55 87s22 33.5 22 33.5H91V109s-1 22 22 22h42s20 .3 20-19.5V58S178 20 127.5 20zm-7 19a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"
        fill="url(#py-top)"
      />
      {/* bottom snake body */}
      <path
        d="M128.5 236C163 236 161 221 161 221l-.04-15.5h-33V201h48S201 204 201 169s-22-33.5-22-33.5H165v11.5s1-22-22-22h-42s-20-.3-20 19.5v53.5S78 236 128.5 236zm7-19a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
        fill="url(#py-bot)"
      />
    </svg>
  );
}

function DjangoLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="12" fill="#092E20" />
      <path
        d="M143 52h28v117c-14.4 2.7-25 3.7-36.5 3.7-34.3 0-52.2-15.5-52.2-45.3 0-28.7 19.3-47.3 49.2-47.3 4.7 0 8.3.4 11.5 1.1V52zm0 41c-3-1-5.5-1.2-8.7-1.2-14.5 0-22.8 8.9-22.8 24.5 0 15.2 8.1 23.6 22.8 23.6 2.9 0 5.3-.2 8.7-.7V93zM178 34h28v28h-28V34z"
        fill="white"
      />
    </svg>
  );
}

function FastAPILogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="128" fill="#059669" />
      <path d="M142 44L74 148h58l-26 64 86-116h-60z" fill="white" />
    </svg>
  );
}

function GoLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="12" fill="#00ACD7" />
      <text
        x="128"
        y="148"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="96"
        fill="white"
      >
        Go
      </text>
    </svg>
  );
}

function TypeScriptLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="12" fill="#3178C6" />
      <path
        d="M150 198v21c3.5 1.8 7.6 3.2 12.3 4 4.8.9 9.8 1.3 15.1 1.3 5 0 9.9-.5 14.6-1.5 4.6-1 8.6-2.7 12-4.9 3.5-2.3 6.2-5.3 8.2-9 2-3.7 3-8.1 3-13.3 0-3.8-.5-7.2-1.6-10.1-1.1-2.9-2.7-5.5-4.8-7.7-2.1-2.2-4.7-4.2-7.8-6.1-3-1.8-6.5-3.5-10.5-5.2-2.8-1.2-5.4-2.3-7.6-3.4-2.2-1-4-2-5.5-3.1-1.5-1.1-2.7-2.2-3.5-3.4-.8-1.2-1.2-2.7-1.2-4.3 0-1.5.3-2.8 1-4 .7-1.1 1.6-2.1 2.9-2.9 1.2-.8 2.7-1.4 4.4-1.8 1.7-.4 3.6-.6 5.6-.6 1.5 0 3 .1 4.7.4 1.6.2 3.3.6 4.9 1.2 1.6.6 3.2 1.3 4.8 2.3 1.5 1 3 2.1 4.3 3.5v-20c-3.1-1.2-6.4-2-9.9-2.6-3.6-.5-7.5-.8-11.8-.8-5 0-9.8.5-14.4 1.7-4.5 1.1-8.5 2.9-11.8 5.3-3.4 2.4-6 5.4-8 9-2 3.7-3 8-3 12.8 0 6.4 1.8 11.8 5.5 16.3 3.7 4.5 9.2 8.3 16.8 11.5 3.1 1.2 5.9 2.4 8.4 3.6 2.5 1.1 4.7 2.3 6.5 3.5 1.8 1.2 3.1 2.6 4.1 4 1 1.5 1.5 3.2 1.5 5.1 0 1.4-.3 2.8-1 4-.6 1.2-1.6 2.3-2.9 3.2-1.3.9-2.9 1.6-4.8 2.1-1.9.5-4.1.7-6.6.7-4.3 0-8.6-.8-12.9-2.4-4.2-1.6-8.1-4.1-11.6-7.6zM116 133H143v-18.5H59V133h27.5v78H116v-78z"
        fill="white"
      />
    </svg>
  );
}

function SQLLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="12" fill="#336791" />
      <ellipse cx="128" cy="76" rx="68" ry="26" fill="white" fillOpacity="0.9" />
      <path d="M60 76v34c0 14.4 30.4 26 68 26s68-11.6 68-26V76c0 14.4-30.4 26-68 26S60 90.4 60 76z" fill="white" fillOpacity="0.7" />
      <path d="M60 110v34c0 14.4 30.4 26 68 26s68-11.6 68-26v-34c0 14.4-30.4 26-68 26s-68-11.6-68-26z" fill="white" fillOpacity="0.5" />
      <path d="M60 144v32c0 14.4 30.4 26 68 26s68-11.6 68-26v-32c0 14.4-30.4 26-68 26s-68-11.6-68-26z" fill="white" fillOpacity="0.35" />
    </svg>
  );
}

const LOGOS: Record<string, (size: number) => React.ReactNode> = {
  python: (s) => <PythonLogo size={s} />,
  django: (s) => <DjangoLogo size={s} />,
  fastapi: (s) => <FastAPILogo size={s} />,
  go: (s) => <GoLogo size={s} />,
  typescript: (s) => <TypeScriptLogo size={s} />,
  sql: (s) => <SQLLogo size={s} />,
};

const LABELS: Record<string, string> = {
  python: "Py",
  django: "Dj",
  fastapi: "Fa",
  sql: "SQL",
  go: "Go",
  typescript: "TS",
};

export function StackTile({
  stack,
  className = "",
  iconSize = 28,
}: {
  stack: string;
  className?: string;
  iconSize?: number;
}) {
  const logo = LOGOS[stack];
  if (logo) {
    return (
      <span className={`inline-flex items-center justify-center rounded-lg overflow-hidden shrink-0 ${className}`}>
        {logo(iconSize)}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary font-mono font-bold text-[9px] uppercase ${className}`}
    >
      {LABELS[stack] ?? stack.slice(0, 2)}
    </span>
  );
}
