"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type MethodExample = {
  label: string;
  code: string;
  output: string;
};

export type ExplorerMethod = {
  name: string;
  signature: string;
  description: string;
  analogy?: string;
  examples: MethodExample[];
  gotcha?: string;
  category: string;
};

type MethodExplorerProps = {
  methods: ExplorerMethod[];
  categories: string[];
};

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export function MethodExplorer({ methods, categories }: MethodExplorerProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeMethod, setActiveMethod] = useState(
    methods.find((m) => m.category === categories[0])?.name ?? ""
  );
  const [activeExample, setActiveExample] = useState(0);

  const filtered = methods.filter((m) => m.category === activeCategory);
  const selected = methods.find((m) => m.name === activeMethod);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const first = methods.find((m) => m.category === cat);
    if (first) setActiveMethod(first.name);
    setActiveExample(0);
  };

  const handleMethodChange = (name: string) => {
    setActiveMethod(name);
    setActiveExample(0);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header + category tabs */}
      <div className="px-5 pt-4 pb-3 border-b border-border/60">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 block mb-3">
          Method Explorer
        </span>
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className={cn(
                "px-3 py-1 text-[11px] font-medium rounded-md transition-all duration-500 capitalize cursor-pointer",
                activeCategory === cat
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Method list + detail panel */}
      <div className="flex flex-col sm:flex-row min-h-[320px]">
        {/* Method list */}
        <div className="sm:w-36 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-border/60 p-2">
          <div className="flex sm:flex-col gap-1 flex-wrap sm:flex-nowrap">
            <AnimatePresence mode="popLayout">
              {filtered.map((m) => (
                <motion.button
                  key={m.name}
                  layout
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={spring}
                  onClick={() => handleMethodChange(m.name)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "text-left px-3 py-2 rounded-md text-[12px] font-mono transition-all duration-500 cursor-pointer w-full",
                    activeMethod === m.name
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {m.name}()
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={spring}
              className="flex-1 p-5 space-y-3 min-w-0"
            >
              {/* Signature */}
              <code className="block text-[12px] font-mono text-primary bg-primary/5 px-3 py-2 rounded-lg break-all">
                {selected.signature}
              </code>

              {/* Description */}
              <p className="text-[13px] text-foreground/80 leading-relaxed">
                {selected.description}
              </p>

              {/* Analogy */}
              {selected.analogy && (
                <div className="border-l-2 border-primary bg-primary/5 pl-4 py-2 rounded-r-lg">
                  <p className="text-[12px] text-foreground/70 italic">{selected.analogy}</p>
                </div>
              )}

              {/* Example tabs */}
              {selected.examples.length > 1 && (
                <div className="flex gap-1.5 flex-wrap">
                  {selected.examples.map((ex, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveExample(i)}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={spring}
                      className={cn(
                        "px-2.5 py-1 text-[10px] rounded transition-all duration-500 cursor-pointer",
                        activeExample === i
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {ex.label}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Example code */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selected.name}-${activeExample}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-muted rounded-lg overflow-hidden"
                >
                  <div className="px-4 py-3 font-mono text-[12px] text-foreground/80 overflow-x-auto">
                    {selected.examples[activeExample]?.code}
                  </div>
                  <div className="border-t border-border/40 px-4 py-2 font-mono text-[12px] text-primary bg-primary/5">
                    → {selected.examples[activeExample]?.output}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Gotcha */}
              {selected.gotcha && (
                <div className="border-l-2 border-orange-400 bg-orange-400/5 pl-4 py-2 rounded-r-lg">
                  <p className="text-[11px] text-orange-600 dark:text-orange-400 font-medium mb-0.5">
                    Gotcha
                  </p>
                  <p className="text-[12px] text-foreground/70">{selected.gotcha}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
