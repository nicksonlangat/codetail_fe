"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

type Scenario = "success" | "exception";

type Step = {
  label: string;
  code: string;
  desc: string;
  color: "primary" | "green" | "red" | "muted";
};

const SUCCESS_STEPS: Step[] = [
  { label: "1", code: "cm.__enter__()", desc: "Context manager enters. Resources are acquired.", color: "primary" },
  { label: "2", code: "# body runs",    desc: "The body of the with block executes normally.", color: "green"   },
  { label: "3", code: "cm.__exit__(None, None, None)", desc: "No exception — __exit__ is called with three Nones. Resources are released.", color: "primary" },
];

const EXCEPTION_STEPS: Step[] = [
  { label: "1", code: "cm.__enter__()",              desc: "Context manager enters. Resources are acquired.", color: "primary" },
  { label: "2", code: "# body raises ValueError",   desc: "An exception is raised inside the with block.", color: "red"     },
  { label: "3", code: "cm.__exit__(ValueError, e, tb)", desc: "__exit__ receives the exception info. It can suppress it by returning True, or let it propagate.", color: "red" },
  { label: "4", code: "# exception propagates",     desc: "If __exit__ returns False/None, the exception continues up the call stack.", color: "muted"   },
];

const COLOR_MAP = {
  primary: { chip: "bg-primary/10 border-primary/20 text-primary",    dot: "bg-primary" },
  green:   { chip: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400", dot: "bg-green-500" },
  red:     { chip: "bg-red-400/10 border-red-400/20 text-red-500",    dot: "bg-red-400" },
  muted:   { chip: "bg-muted border-border/50 text-muted-foreground", dot: "bg-muted-foreground/40" },
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
    <div className="bg-card border border-border rounded-xl p-6">
      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 block mb-4">
        Context Manager Lifecycle
      </span>

      <div className="flex gap-1.5 mb-5">
        {(["success", "exception"] as Scenario[]).map((s) => (
          <motion.button
            key={s}
            onClick={() => handleScenario(s)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
            className={cn(
              "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
              scenario === s
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-muted-foreground bg-secondary border-border hover:text-foreground"
            )}
          >
            {s === "success" ? "body succeeds" : "body raises"}
          </motion.button>
        ))}
      </div>

      <div className="font-mono text-[11px] text-muted-foreground/50 bg-muted/50 rounded-lg px-3 py-2 mb-5">
        <span className="text-foreground/60">with</span> open(<span className="text-green-600 dark:text-green-400">&quot;file.txt&quot;</span>) <span className="text-foreground/60">as</span> f:{"\n"}
        {"    "}<span className="text-muted-foreground/40"># body</span>
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
                transition={{ ...spring, delay: 0.05 }}
                className={cn("rounded-lg border p-3 flex gap-3 items-start", c.chip)}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", c.dot)} />
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
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
            className="px-4 py-2 text-[11px] font-mono rounded-md border border-primary/20 bg-primary/10 text-primary cursor-pointer transition-all duration-500"
          >
            next step
          </motion.button>
        ) : (
          <span className="text-[11px] font-mono text-muted-foreground/40 self-center">
            done
          </span>
        )}
        {revealed > 0 && (
          <motion.button
            onClick={() => setRevealed(0)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
            className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
          >
            reset
          </motion.button>
        )}
      </div>
    </div>
  );
}
