"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

/* ── CT Monogram — Primary (teal bg, white mark) ── */
function LogoPrimary({ size = 48 }: { size?: number }) {
  const s = size / 48;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx={12 * s} fill="#1fad87" />
      <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── CT Monogram — Dark bg variant ── */
function LogoDark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#121418" stroke="#1fad87" strokeWidth="1.5" />
      <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── CT Monogram — White bg (for light mode) ── */
function LogoLight({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="12" fill="white" stroke="#D0D5DA" strokeWidth="1" />
      <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="#1fad87" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── CT Monogram — Monochrome white (for dark bg overlays) ── */
function LogoMonoWhite({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="12" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── CT Monogram — Monochrome dark (for light bg overlays) ── */
function LogoMonoDark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#161C24" />
      <path d="M20 16C15 16 12 19.5 12 24C12 28.5 15 32 20 32" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M26 16H38M32 16V28C32 30 33 32 36 33" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── Favicon — 16px optimized, no radius ── */
function Favicon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill="#1fad87" />
      <path d="M6.5 4.5C4.5 4.5 3.5 6.2 3.5 8C3.5 9.8 4.5 11.5 6.5 11.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M9 4.5H13M11 4.5V9.5C11 10.3 11.4 11 12.5 11.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── Social media — square with padding ── */
function LogoSocial({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" rx="40" fill="#1fad87" />
      <path d="M82 62C67 62 58 72 58 100C58 128 67 138 82 138" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M108 62H158M133 62V118C133 126 136 134 148 138" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── OG Image variant — wide with wordmark ── */
function LogoOG() {
  return (
    <svg width="600" height="315" viewBox="0 0 600 315" fill="none">
      <rect width="600" height="315" fill="#0f1115" />
      {/* Logo mark */}
      <rect x="200" y="60" width="80" height="80" rx="20" fill="#1fad87" />
      <path d="M228 82C218 82 214 89 214 100C214 111 218 118 228 118" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M240 82H260M250 82V106C250 110 252 114 256 116" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Wordmark */}
      <text x="295" y="115" fontFamily="-apple-system, sans-serif" fontSize="36" fontWeight="700" fill="white">
        code<tspan fill="#1fad87">tail</tspan>
      </text>
      {/* Tagline */}
      <text x="200" y="180" fontFamily="-apple-system, sans-serif" fontSize="18" fill="#858a93">
        Practice coding the way you actually learn
      </text>
      {/* URL */}
      <text x="200" y="250" fontFamily="monospace" fontSize="14" fill="#4a4f57">
        codetail.cc
      </text>
    </svg>
  );
}

/* ── App Icon — iOS style with gradient ── */
function LogoAppIcon({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="app-grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1fad87" />
          <stop offset="100%" stopColor="#14997a" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#app-grad)" />
      <path d="M50 36C38 36 32 45 32 60C32 75 38 84 50 84" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M62 36H92M77 36V70C77 76 80 82 88 85" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const variants = [
  { id: "primary", name: "Primary", description: "Teal background, white mark. Default for most uses.", Component: LogoPrimary, sizes: [24, 32, 48, 64, 96], bgClass: "bg-card" },
  { id: "dark", name: "Dark Outlined", description: "Dark background with teal stroke border and teal mark. For dark UIs.", Component: LogoDark, sizes: [24, 32, 48, 64, 96], bgClass: "bg-card" },
  { id: "light", name: "Light", description: "White background with subtle border. For light mode UIs.", Component: LogoLight, sizes: [24, 32, 48, 64, 96], bgClass: "bg-[#F9FAFB]" },
  { id: "mono-white", name: "Mono White", description: "Ghost white on transparent. For dark photo overlays, video intros.", Component: LogoMonoWhite, sizes: [32, 48, 64, 96], bgClass: "bg-card" },
  { id: "mono-dark", name: "Mono Dark", description: "Dark square with white mark. For print, merch, high contrast.", Component: LogoMonoDark, sizes: [32, 48, 64, 96], bgClass: "bg-[#F9FAFB]" },
  { id: "favicon", name: "Favicon", description: "16px optimized. Reduced detail, tighter strokes, smaller radius.", Component: Favicon, sizes: [16, 32], bgClass: "bg-card" },
  { id: "app-icon", name: "App Icon", description: "iOS/Android app icon. Gradient fill, thicker strokes, 26px radius.", Component: LogoAppIcon, sizes: [60, 80, 120], bgClass: "bg-card" },
  { id: "social", name: "Social Media", description: "Square avatar for Twitter, GitHub, LinkedIn. Bold at small sizes.", Component: LogoSocial, sizes: [48, 80, 120], bgClass: "bg-card" },
];

export default function BrandPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <main className="max-w-[1000px] mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight mb-2">CT Monogram — Brand Kit</h1>
          <p className="text-[14px] text-muted-foreground">Every variant you need. Click to expand size previews.</p>
        </motion.div>

        {/* Variants grid */}
        <div className="space-y-4 mb-16">
          {variants.map((v, i) => (
            <motion.div key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.04 }}
              onClick={() => setExpanded(expanded === v.id ? null : v.id)}
              className={`rounded-xl border p-5 cursor-pointer transition-all duration-500 ${
                expanded === v.id ? "border-primary bg-primary/[0.03]" : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-5">
                {/* Preview */}
                <div className={`w-16 h-16 rounded-lg ${v.bgClass} flex items-center justify-center flex-shrink-0`}>
                  <v.Component size={v.sizes[Math.min(2, v.sizes.length - 1)]} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-[14px] font-semibold">{v.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{v.description}</p>
                </div>

                {/* Sizes count */}
                <span className="text-[10px] text-muted-foreground/40 font-mono">{v.sizes.length} sizes</span>
              </div>

              {/* Expanded — size previews */}
              {expanded === v.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="mt-5 pt-5 border-t border-border/50"
                >
                  <div className="flex items-end gap-6">
                    {v.sizes.map((size) => (
                      <div key={size} className="flex flex-col items-center gap-2">
                        <div className={`rounded-lg ${v.bgClass} p-2 flex items-center justify-center`}>
                          <v.Component size={size} />
                        </div>
                        <span className="text-[9px] text-muted-foreground/40 font-mono">{size}px</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* OG Image preview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-[15px] font-semibold mb-4">OG Image / Social Share</h2>
          <div className="rounded-lg overflow-hidden border border-border">
            <LogoOG />
          </div>
          <p className="text-[10px] text-muted-foreground/40 mt-2 font-mono">1200×630 recommended. This is 600×315 preview.</p>
        </motion.div>

        {/* Wordmark combinations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 mt-4"
        >
          <h2 className="text-[15px] font-semibold mb-6">Wordmark Combinations</h2>

          <div className="space-y-4">
            {/* Dark bg — primary logo */}
            <div className="flex items-center gap-8 p-6 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <LogoPrimary size={36} />
                <span className="text-[20px] font-semibold tracking-tight">
                  code<span className="text-primary">tail</span>
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2.5">
                <LogoPrimary size={24} />
                <span className="text-[14px] font-semibold tracking-tight">
                  code<span className="text-primary">tail</span>
                </span>
              </div>
            </div>

            {/* Dark bg — dark outlined logo */}
            <div className="flex items-center gap-8 p-6 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-3">
                <LogoDark size={36} />
                <span className="text-[20px] font-semibold tracking-tight">
                  code<span className="text-primary">tail</span>
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2.5">
                <LogoDark size={24} />
                <span className="text-[14px] font-semibold tracking-tight">
                  code<span className="text-primary">tail</span>
                </span>
              </div>
            </div>

            {/* Light bg */}
            <div className="flex items-center gap-8 p-6 rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <LogoPrimary size={36} />
                <span className="text-[20px] font-semibold tracking-tight text-[#161C24]">
                  code<span className="text-[#1fad87]">tail</span>
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2.5">
                <LogoLight size={24} />
                <span className="text-[14px] font-semibold tracking-tight text-[#161C24]">
                  code<span className="text-[#1fad87]">tail</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Color palette */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.6 }}
          className="rounded-xl border border-border bg-card p-6 mt-4"
        >
          <h2 className="text-[15px] font-semibold mb-4">Brand Colors</h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: "Primary", hex: "#1fad87", label: "Teal" },
              { name: "Background", hex: "#121418", label: "Near Black" },
              { name: "Card", hex: "#181b20", label: "Dark Card" },
              { name: "Foreground", hex: "#e8eaed", label: "Off White" },
              { name: "Muted", hex: "#858a93", label: "Gray" },
            ].map((c) => (
              <div key={c.name} className="text-center">
                <div className="w-full h-16 rounded-lg border border-border mb-2" style={{ backgroundColor: c.hex }} />
                <p className="text-[11px] font-medium">{c.name}</p>
                <p className="text-[9px] text-muted-foreground font-mono">{c.hex}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
