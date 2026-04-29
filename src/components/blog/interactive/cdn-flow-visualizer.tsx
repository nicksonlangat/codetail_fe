"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Scenario = "hit" | "miss" | "invalidate";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

type Step = {
  from: "user" | "edge" | "origin";
  to: "user" | "edge" | "origin";
  label: string;
  latency: number;
  color: string;
};

const SCENARIOS: Record<Scenario, {
  label: string;
  desc: string;
  steps: Step[];
  result: string;
  totalMs: number;
  statusColor: string;
}> = {
  hit: {
    label: "Cache Hit",
    desc: "Asset found at edge PoP — origin never contacted",
    totalMs: 28,
    statusColor: "text-primary",
    result: "200 OK — served from edge cache in 28ms",
    steps: [
      { from: "user", to: "edge", label: "GET /logo.png", latency: 12, color: "bg-primary" },
      { from: "edge", to: "user", label: "200 OK (HIT, Age: 3600)", latency: 16, color: "bg-primary" },
    ],
  },
  miss: {
    label: "Cache Miss",
    desc: "Asset not cached — edge fetches from origin then caches",
    totalMs: 210,
    statusColor: "text-orange-500",
    result: "200 OK — served via origin in 210ms, cached for next request",
    steps: [
      { from: "user",   to: "edge",   label: "GET /report.pdf",          latency: 12,  color: "bg-orange-400" },
      { from: "edge",   to: "origin", label: "GET /report.pdf (MISS)",   latency: 160, color: "bg-orange-400" },
      { from: "origin", to: "edge",   label: "200 OK + Cache-Control",   latency: 160, color: "bg-orange-400" },
      { from: "edge",   to: "user",   label: "200 OK (MISS, cached now)", latency: 12, color: "bg-orange-400" },
    ],
  },
  invalidate: {
    label: "Cache Invalidation",
    desc: "Purge stale asset after a deploy — forces fresh fetch",
    totalMs: 35,
    statusColor: "text-blue-500",
    result: "Purge complete — next request triggers fresh origin fetch",
    steps: [
      { from: "origin", to: "edge",   label: "PURGE /app.js (deploy hook)", latency: 20, color: "bg-blue-500" },
      { from: "edge",   to: "origin", label: "204 No Content (purged)",      latency: 15, color: "bg-blue-500" },
    ],
  },
};

const NODE_POS: Record<string, number> = { user: 0, edge: 50, origin: 100 };
const NODE_LABEL: Record<string, string> = {
  user: "User\n(Sydney)",
  edge: "Edge PoP\n(Singapore)",
  origin: "Origin\n(us-east-1)",
};
const NODE_COLOR: Record<string, string> = {
  user: "bg-muted border-border text-muted-foreground",
  edge: "bg-primary/10 border-primary/30 text-primary",
  origin: "bg-orange-400/10 border-orange-400/30 text-orange-500",
};

export function CDNFlowVisualizer() {
  const [scenario, setScenario] = useState<Scenario>("hit");
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const s = SCENARIOS[scenario];

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const runFlow = () => {
    if (running) return;
    setRunning(true);
    setActiveStep(-1);
    let delay = 300;
    s.steps.forEach((step, i) => {
      timerRef.current = setTimeout(() => {
        setActiveStep(i);
        if (i === s.steps.length - 1) {
          setTimeout(() => setRunning(false), 800);
        }
      }, delay);
      delay += Math.max(400, step.latency * 1.5);
    });
  };

  useEffect(() => {
    setActiveStep(-1);
    setRunning(false);
    return clearTimer;
  }, [scenario]);

  const switchScenario = (sc: Scenario) => {
    clearTimer();
    setScenario(sc);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 not-prose">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          CDN Request Flow Visualizer
        </span>
        <button
          onClick={() => { clearTimer(); setActiveStep(-1); setRunning(false); }}
          className="text-[9px] text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
        >
          reset
        </button>
      </div>

      {/* Scenario tabs */}
      <div className="flex border-b border-border">
        {(Object.keys(SCENARIOS) as Scenario[]).map(sc => (
          <button
            key={sc}
            onClick={() => switchScenario(sc)}
            className={`flex-1 py-2.5 text-[10px] font-semibold cursor-pointer transition-all duration-500 border-b-2 ${
              scenario === sc
                ? "text-primary border-primary bg-muted/30"
                : "text-muted-foreground border-transparent hover:bg-muted/20"
            }`}
          >
            {SCENARIOS[sc].label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* Description */}
        <p className="text-[10px] text-muted-foreground">{s.desc}</p>

        {/* Node diagram */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-7 left-[10%] right-[10%] h-px bg-border/60" />

          {/* Nodes */}
          <div className="flex justify-between items-start px-2">
            {(["user", "edge", "origin"] as const).map(node => (
              <div key={node} className="flex flex-col items-center gap-1.5 w-24 z-10">
                <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-center ${NODE_COLOR[node]}`}>
                  <span className="text-[8px] font-mono font-semibold leading-tight whitespace-pre-line">
                    {NODE_LABEL[node]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Animated packets */}
          <div className="relative h-8 mt-2">
            <AnimatePresence>
              {s.steps.map((step, i) => {
                if (activeStep < i) return null;
                const fromPct = NODE_POS[step.from];
                const toPct = NODE_POS[step.to];
                const leftPct = Math.min(fromPct, toPct);
                const widthPct = Math.abs(toPct - fromPct);
                const goingRight = toPct > fromPct;
                return (
                  <motion.div
                    key={`${i}-${step.from}-${step.to}`}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ...spring, delay: 0 }}
                    style={{
                      left: `${leftPct + 5}%`,
                      width: `${widthPct - 10}%`,
                      top: `${i * 10}px`,
                      transformOrigin: goingRight ? "left center" : "right center",
                    }}
                    className={`absolute h-1 rounded-full ${step.color}`}
                  >
                    <span
                      className={`absolute top-1.5 text-[8px] font-mono whitespace-nowrap ${step.color.replace("bg-", "text-")}`}
                      style={{ left: goingRight ? 0 : "auto", right: goingRight ? "auto" : 0 }}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Steps log */}
        <div className="space-y-1 min-h-20">
          {s.steps.map((step, i) => (
            <motion.div
              key={i}
              animate={{ opacity: activeStep >= i ? 1 : 0.25 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-[10px]"
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${
                activeStep >= i ? `${step.color} text-white` : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </span>
              <span className="font-mono text-muted-foreground">
                {step.from} → {step.to}
              </span>
              <span className="text-muted-foreground/60">{step.label}</span>
              <span className="ml-auto font-mono text-muted-foreground/60">{step.latency}ms</span>
            </motion.div>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence>
          {activeStep === s.steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
              className="flex items-center gap-2 p-2.5 bg-muted/30 rounded-xl border border-border"
            >
              <span className={`text-[10px] font-mono font-semibold ${s.statusColor}`}>{s.result}</span>
              <span className="ml-auto text-[9px] font-mono text-muted-foreground">total: {s.totalMs}ms</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Run button */}
        <motion.button
          onClick={runFlow}
          disabled={running}
          whileHover={!running ? { scale: 1.02 } : {}}
          whileTap={!running ? { scale: 0.98 } : {}}
          transition={spring}
          className={`w-full py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-500 cursor-pointer ${
            running
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {running ? "simulating..." : "Run Flow"}
        </motion.button>
      </div>
    </div>
  );
}
