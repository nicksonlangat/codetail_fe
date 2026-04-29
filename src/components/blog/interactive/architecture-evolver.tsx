"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "monolith" | "modular" | "microservices";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

const MODULES = ["Auth", "Orders", "Catalog", "Payments", "Notify"];

type StageProps = {
  label: string;
  subtitle: string;
  deployUnit: string;
  database: string;
  teamCoupling: string;
  failureBlast: string;
  opsComplexity: string;
  devVelocity: string;
};

const STAGES: Record<Stage, StageProps> = {
  monolith: {
    label: "Monolith",
    subtitle: "Single deployable unit — everything in one process",
    deployUnit: "One build artifact, one deploy pipeline, one process",
    database: "Single shared database, shared schema",
    teamCoupling: "High — all teams share codebase and release together",
    failureBlast: "Total — one crash or bad deploy takes down everything",
    opsComplexity: "Low — one process to monitor, one deploy, one log stream",
    devVelocity: "Fast early, slows as codebase grows and teams collide",
  },
  modular: {
    label: "Modular Monolith",
    subtitle: "Strict internal boundaries — still one deploy",
    deployUnit: "One process, modules enforced by API contracts (no direct imports across boundaries)",
    database: "Shared database — each module owns its own schema/tables",
    teamCoupling: "Medium — modules prevent coupling from accumulating; teams still release together",
    failureBlast: "Total — one deploy still; but bugs are better isolated within module code",
    opsComplexity: "Low — operationally identical to a monolith, easier to reason about",
    devVelocity: "Sustained — module boundaries prevent the big-ball-of-mud degradation",
  },
  microservices: {
    label: "Microservices",
    subtitle: "Independent processes — independent deploys",
    deployUnit: "N services, N build pipelines, N deploy cycles, N containers",
    database: "Database per service — polyglot persistence, data isolation enforced at the network boundary",
    teamCoupling: "Low — teams own and deploy their service independently at any time",
    failureBlast: "Contained — one service failing does not directly crash others (with circuit breakers)",
    opsComplexity: "High — service discovery, distributed tracing, N health checks, N log streams, latency budgets",
    devVelocity: "Fast per-service; slow for cross-service features requiring coordination across repos",
  },
};

const PROP_ROWS: { key: keyof StageProps; label: string }[] = [
  { key: "deployUnit", label: "Deploy unit" },
  { key: "database", label: "Database" },
  { key: "teamCoupling", label: "Team coupling" },
  { key: "failureBlast", label: "Failure blast radius" },
  { key: "opsComplexity", label: "Ops complexity" },
  { key: "devVelocity", label: "Dev velocity" },
];

export function ArchitectureEvolver() {
  const [stage, setStage] = useState<Stage>("monolith");

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 not-prose">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-border bg-secondary/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Architecture Evolution Explorer — e-commerce app
        </span>
      </div>

      {/* Stage tabs */}
      <div className="flex border-b border-border">
        {(Object.keys(STAGES) as Stage[]).map(s => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`flex-1 py-2.5 text-[11px] font-semibold cursor-pointer transition-all duration-500 border-b-2 ${
              stage === s
                ? "text-primary border-primary bg-muted/30"
                : "text-muted-foreground border-transparent hover:bg-muted/20"
            }`}
          >
            {STAGES[s].label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={spring}
          >
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-3">
              {STAGES[stage].subtitle}
            </p>

            {/* Monolith diagram */}
            {stage === "monolith" && (
              <div className="flex flex-col items-center gap-2 mb-5">
                <div className="w-full max-w-xs border-2 border-primary/30 rounded-xl p-3 bg-primary/5">
                  <p className="text-[7px] uppercase tracking-wider text-primary/50 mb-2 text-center">
                    Single Process
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MODULES.map(m => (
                      <div
                        key={m}
                        className="bg-primary/10 border border-primary/20 rounded-lg py-2 text-center"
                      >
                        <span className="text-[9px] font-mono text-primary">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="border border-border rounded-lg px-6 py-1.5 bg-muted/40">
                  <span className="text-[9px] font-mono text-muted-foreground">Single Database</span>
                </div>
              </div>
            )}

            {/* Modular monolith diagram */}
            {stage === "modular" && (
              <div className="flex flex-col items-center gap-2 mb-5">
                <div className="w-full max-w-xs border-2 border-primary/30 rounded-xl p-3 bg-primary/5">
                  <p className="text-[7px] uppercase tracking-wider text-primary/50 mb-2 text-center">
                    Single Process — Enforced Module Boundaries
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MODULES.map(m => (
                      <div
                        key={m}
                        className="bg-card border-2 border-dashed border-primary/40 rounded-lg py-2 text-center"
                      >
                        <span className="text-[9px] font-mono text-primary">{m}</span>
                        <div className="text-[7px] text-muted-foreground/60 mt-0.5">own schema</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="border border-border rounded-lg px-4 py-1.5 bg-muted/40">
                  <span className="text-[9px] font-mono text-muted-foreground">
                    Shared DB — schema per module
                  </span>
                </div>
              </div>
            )}

            {/* Microservices diagram */}
            {stage === "microservices" && (
              <div className="mb-5">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {MODULES.map((m, i) => (
                    <motion.div
                      key={m}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...spring, delay: i * 0.07 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-full border border-primary/30 rounded-xl p-2 bg-primary/5 text-center">
                        <span className="text-[9px] font-mono text-primary font-semibold">{m}</span>
                        <div className="text-[7px] text-muted-foreground/60 mt-0.5">service</div>
                      </div>
                      <div className="w-px h-3 bg-border" />
                      <div className="border border-border rounded px-2 py-0.5 bg-muted/40">
                        <span className="text-[7px] font-mono text-muted-foreground">DB</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground/60 text-center mt-3">
                  Services communicate via HTTP/gRPC or message queue — no shared memory
                </p>
              </div>
            )}

            {/* Properties */}
            <div className="space-y-2 border-t border-border/50 pt-4">
              {PROP_ROWS.map(({ key, label }) => (
                <div key={key} className="flex gap-3 text-[11px]">
                  <span className="text-muted-foreground w-28 flex-shrink-0 leading-relaxed">{label}</span>
                  <span className="text-foreground/80 leading-relaxed">{STAGES[stage][key]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
