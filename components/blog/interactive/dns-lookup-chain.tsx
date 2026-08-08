"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type HopDef = {
  icon: string;
  label: string;
  sublabel: string;
  result: string;
  latency: string;
  detail: string;
  cached?: boolean;
};

const HOPS: HopDef[] = [
  {
    icon: "🌐",
    label: "Browser DNS Cache",
    sublabel: "Step 1",
    result: "MISS, no entry found",
    latency: "~0ms",
    detail: "Chrome, Firefox, and Safari all maintain an in-process DNS cache. A hit here costs nothing. You can inspect Chrome's cache at chrome://net-internals/#dns.",
    cached: false,
  },
  {
    icon: "💻",
    label: "OS Cache / hosts file",
    sublabel: "Step 2",
    result: "MISS, not in hosts file",
    latency: "~0ms",
    detail: "The OS checks /etc/hosts (or C:\\Windows\\System32\\drivers\\etc\\hosts on Windows) first, then its own DNS resolver cache. This is where local dev aliases like '127.0.0.1 myapp.local' live.",
    cached: false,
  },
  {
    icon: "🏢",
    label: "Recursive Resolver",
    sublabel: "Step 3, your ISP or 8.8.8.8",
    result: "MISS, querying root...",
    latency: "1-5ms",
    detail: "Your router points devices at a recursive resolver, usually your ISP's, or a public one like Cloudflare (1.1.1.1) or Google (8.8.8.8). This resolver does the heavy lifting on your behalf and caches results.",
    cached: false,
  },
  {
    icon: "🌍",
    label: "Root Nameserver",
    sublabel: "Step 4, 13 root server clusters",
    result: "-> try the .com TLD nameservers",
    latency: "5-30ms",
    detail: "There are 13 root nameserver addresses (a.root-servers.net through m.root-servers.net), backed by hundreds of physical servers via Anycast. They don't know google.com's IP, they know who to ask next.",
    cached: false,
  },
  {
    icon: "📂",
    label: ".com TLD Nameserver",
    sublabel: "Step 5, operated by Verisign",
    result: "-> try ns1.google.com",
    latency: "5-20ms",
    detail: "Top-Level Domain (TLD) nameservers know which authoritative nameservers are responsible for each domain under their TLD. For .com, Verisign operates these. They return the NS records for google.com.",
    cached: false,
  },
  {
    icon: "📋",
    label: "Authoritative Nameserver",
    sublabel: "Step 6, ns1.google.com",
    result: "✓ 142.250.80.46 (TTL 300s)",
    latency: "2-10ms",
    detail: "Google's own nameservers are authoritative for google.com. They return the A record: 142.250.80.46. The TTL (Time To Live) of 300 seconds tells resolvers how long to cache this answer.",
    cached: true,
  },
  {
    icon: "✅",
    label: "IP returned to browser",
    sublabel: "Step 7, lookup complete",
    result: "142.250.80.46 cached for 300s",
    latency: "Total: 20-80ms",
    detail: "The recursive resolver caches the result. Your OS caches it. Your browser caches it. For the next 300 seconds, anyone asking your machine for google.com's IP gets an instant answer from cache.",
    cached: true,
  },
];

function Hop({ hop, revealed }: { hop: HopDef; revealed: boolean }) {
  return (
    <div className="relative flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center text-base shrink-0 transition-all duration-300 ${
            revealed ? (hop.cached ? "border-brand-primary bg-brand-primary/10" : "border-brand-primary/40 bg-brand-primary/5") : "border-brand-border bg-white"
          }`}
        >
          {hop.icon}
        </div>
        <div className={`w-[2px] flex-1 min-h-[12px] transition-colors duration-300 ${revealed ? "bg-brand-primary/30" : "bg-brand-border"}`} />
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: 0.05 }}
            className="flex-1 pb-4"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <span className="text-[12px] font-semibold text-brand-text">{hop.label}</span>
                <span className="text-[10px] text-brand-text-muted ml-2">{hop.sublabel}</span>
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                  hop.cached ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-surface text-brand-text-muted"
                }`}
              >
                {hop.latency}
              </span>
            </div>
            <div className={`text-[11px] font-medium mb-1.5 ${hop.cached ? "text-brand-primary" : "text-brand-warning"}`}>
              {hop.result}
            </div>
            <p className="text-[11px] text-brand-text-muted leading-relaxed">{hop.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed && <div className="flex-1 h-8" />}
    </div>
  );
}

export function DNSLookupChain({ initiallyExpanded = false }: { initiallyExpanded?: boolean }) {
  const [revealedCount, setRevealedCount] = useState(initiallyExpanded ? HOPS.length : 0);
  const [isComplete, setIsComplete] = useState(initiallyExpanded);

  const revealNext = () => {
    if (revealedCount < HOPS.length) {
      const next = revealedCount + 1;
      setRevealedCount(next);
      if (next === HOPS.length) setIsComplete(true);
    }
  };

  const reset = () => {
    setRevealedCount(0);
    setIsComplete(false);
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl p-5 not-prose">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          DNS Resolution Chain
        </span>
        {revealedCount > 0 && (
          <button
            onClick={reset}
            className="text-[10px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-0">
        {HOPS.map((hop, i) => (
          <Hop key={hop.label} hop={hop} revealed={i < revealedCount} />
        ))}
      </div>

      {!isComplete ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={revealNext}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-border hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all duration-500 text-[12px] font-medium text-brand-text-muted hover:text-brand-primary cursor-pointer outline-none"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          {revealedCount === 0 ? "Start DNS lookup" : `Next hop (${revealedCount + 1}/${HOPS.length})`}
        </motion.button>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-brand-primary bg-brand-primary/5 border border-brand-primary/20 rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Cold lookup complete. Result cached for 300s, next visit skips steps 3-6.</span>
        </div>
      )}
    </div>
  );
}
