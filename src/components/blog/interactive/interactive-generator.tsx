"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };
const PRIMARY = "#1fad87";
const TOTAL = 8;

function computeItem(i: number) {
  return i * i;
}

const ALL_ITEMS = Array.from({ length: TOTAL }, (_, i) => computeItem(i));

export function InteractiveGenerator() {
  const [genIndex, setGenIndex] = useState(0);
  const [genDone, setGenDone] = useState(false);
  const [listRevealed, setListRevealed] = useState(false);
  const [mode, setMode] = useState<"list" | "gen">("list");

  const resetGen = () => { setGenIndex(0); setGenDone(false); };
  const resetList = () => setListRevealed(false);

  const handleNext = () => {
    if (genIndex < TOTAL - 1) {
      setGenIndex((i) => i + 1);
    } else {
      setGenDone(true);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 block mb-4">
        Eager vs Lazy Explorer
      </span>

      {/* Mode toggle */}
      <div className="flex gap-1.5 mb-5">
        {(["list", "gen"] as const).map((m) => (
          <motion.button
            key={m}
            onClick={() => { setMode(m); resetGen(); resetList(); }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
            className={cn(
              "px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer",
              mode === m
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-muted-foreground bg-secondary border-border hover:text-foreground"
            )}
          >
            {m === "list" ? "list comprehension" : "generator expression"}
          </motion.button>
        ))}
      </div>

      {mode === "list" ? (
        <div>
          <div className="font-mono text-[12px] text-primary bg-primary/8 border border-primary/15 rounded-lg px-3 py-2 mb-4">
            squares = [x**2 for x in range({TOTAL})]
          </div>

          <p className="text-[12px] text-muted-foreground/70 mb-4">
            A list comprehension evaluates all items immediately. All{" "}
            <span className="font-mono text-foreground/80">{TOTAL}</span> values
            are computed at once and stored in memory.
          </p>

          {!listRevealed ? (
            <motion.button
              onClick={() => setListRevealed(true)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
              className="px-4 py-2 text-[11px] font-mono rounded-md border border-primary/20 bg-primary/10 text-primary cursor-pointer transition-all duration-500"
            >
              evaluate all
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-wrap gap-2 mb-3">
                {ALL_ITEMS.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...spring, delay: i * 0.04 }}
                    className="px-2.5 py-1 rounded-md border border-primary/25 bg-primary/8 text-[12px] font-mono text-primary"
                  >
                    {v}
                  </motion.div>
                ))}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground/50">
                {TOTAL}/{TOTAL} items in memory
              </p>
              <motion.button
                onClick={resetList} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
                className="mt-3 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
              >
                reset
              </motion.button>
            </motion.div>
          )}
        </div>
      ) : (
        <div>
          <div className="font-mono text-[12px] text-primary bg-primary/8 border border-primary/15 rounded-lg px-3 py-2 mb-4">
            squares = (x**2 for x in range({TOTAL}))
          </div>

          <p className="text-[12px] text-muted-foreground/70 mb-4">
            A generator computes items only when requested. Each{" "}
            <span className="font-mono text-foreground/80">next()</span> call
            produces exactly one value. Nothing is stored in memory until you ask.
          </p>

          <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
            {Array.from({ length: genIndex + (genDone ? 0 : 0) }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring}
                className="px-2.5 py-1 rounded-md border border-primary/25 bg-primary/8 text-[12px] font-mono text-primary"
              >
                {ALL_ITEMS[i]}
              </motion.div>
            ))}
            {!genDone && genIndex < TOTAL && (
              <div className="px-2.5 py-1 rounded-md border border-border/30 bg-muted/30 text-[12px] font-mono text-muted-foreground/30">
                ?
              </div>
            )}
          </div>

          <p className="text-[11px] font-mono text-muted-foreground/50 mb-3">
            {genIndex}/{TOTAL} items computed
          </p>

          <div className="flex gap-2">
            {!genDone ? (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
                className="px-4 py-2 text-[11px] font-mono rounded-md border border-primary/20 bg-primary/10 text-primary cursor-pointer transition-all duration-500"
              >
                next()
              </motion.button>
            ) : (
              <span className="text-[11px] font-mono text-muted-foreground/50 self-center">
                StopIteration — generator exhausted
              </span>
            )}
            {(genIndex > 0 || genDone) && (
              <motion.button
                onClick={resetGen} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
                className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
              >
                reset
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
