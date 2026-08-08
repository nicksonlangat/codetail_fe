"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type Scenario = "success" | "exception";

type Step = {
  label: string;
  code: string;
  desc: string;
  color: "primary" | "success" | "destructive" | "muted";
};

const SUCCESS_STEPS: Step[] = [
  { label: "1", code: "cm.__enter__()", desc: "Context manager enters. Resources are acquired.", color: "primary" },
  { label: "2", code: "# body runs", desc: "The body of the with block executes normally.", color: "success" },
  { label: "3", code: "cm.__exit__(None, None, None)", desc: "No exception, __exit__ is called with three Nones. Resources are released.", color: "primary" },
];

const EXCEPTION_STEPS: Step[] = [
  { label: "1", code: "cm.__enter__()", desc: "Context manager enters. Resources are acquired.", color: "primary" },
  { label: "2", code: "# body raises ValueError", desc: "An exception is raised inside the with block.", color: "destructive" },
  { label: "3", code: "cm.__exit__(ValueError, e, tb)", desc: "__exit__ receives the exception info. It can suppress it by returning True, or let it propagate.", color: "destructive" },
  { label: "4", code: "# exception propagates", desc: "If __exit__ returns False/None, the exception continues up the call stack.", color: "muted" },
];

const COLOR_MAP = {
  primary: { chip: "bg-brand-primary/10 border-brand-primary/20 text-brand-primary", dot: "bg-brand-primary" },
  success: { chip: "bg-brand-success/10 border-brand-success/20 text-brand-success", dot: "bg-brand-success" },
  destructive: { chip: "bg-brand-destructive/10 border-brand-destructive/20 text-brand-destructive", dot: "bg-brand-destructive" },
  muted: { chip: "bg-brand-surface border-brand-border/50 text-brand-text-muted", dot: "bg-brand-text-subtle" },
};

export function InteractiveContextManager() {
  const [scenario, setScenario] = useState<Scenario>("success");
  const [revealed, setRevealed] = useState(0);

  const steps = scenario === "success" ? SUCCESS_STEPS : EXCEPTION_STEPS;

  const handleScenario = (s: Scenario) => {
    setScenario(s);
    setRevealed(0);
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block mb-4">
        Context Manager Lifecycle
      </span>

      <div className="flex gap-1.5 mb-5">
        {(["success", "exception"] as Scenario[]).map((s) => (
          <motion.button
            key={s}
            onClick={() => handleScenario(s)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
              scenario === s
                ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
            }`}
          >
            {s === "success" ? "body succeeds" : "body raises"}
          </motion.button>
        ))}
      </div>

      <div className="font-mono text-[11px] text-brand-text-subtle bg-brand-surface/50 rounded-lg px-3 py-2 mb-5">
        <span className="text-brand-text/60">with</span> open(
        <span className="text-brand-success">&quot;file.txt&quot;</span>){" "}
        <span className="text-brand-text/60">as</span> f:{"\n"}
        {"    "}
        <span className="text-brand-text-subtle"># body</span>
      </div>

      <div className="space-y-2 mb-4">
        <AnimatePresence mode="wait">
          {steps.slice(0, revealed + 1).map((step, i) => {
            const c = COLOR_MAP[step.color];
            return (
              <motion.div
                key={scenario + i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SPRING, delay: 0.05 }}
                className={`rounded-lg border p-3 flex gap-3 items-start ${c.chip}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.dot}`} />
                <div>
                  <code className="text-[11px] font-mono block mb-0.5">{step.code}</code>
                  <p className="text-[10px] opacity-70">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {revealed < steps.length - 1 ? (
          <motion.button
            onClick={() => setRevealed((r) => r + 1)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="px-4 py-2 text-[11px] font-mono rounded-md border border-brand-primary/20 bg-brand-primary/10 text-brand-primary cursor-pointer outline-none transition-all duration-500"
          >
            next step
          </motion.button>
        ) : (
          <span className="text-[11px] font-mono text-brand-text-subtle self-center">
            done
          </span>
        )}
        {revealed > 0 && (
          <motion.button
            onClick={() => setRevealed(0)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className="text-[10px] text-brand-text-muted hover:text-brand-text cursor-pointer outline-none transition-all duration-500"
          >
            reset
          </motion.button>
        )}
      </div>
    </div>
  );
}
