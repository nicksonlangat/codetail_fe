"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

export function MethodExplorer({ methods, categories }: MethodExplorerProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeMethod, setActiveMethod] = useState(
    methods.find((m) => m.category === categories[0])?.name ?? ""
  );
  const [activeExample, setActiveExample] = useState(0);

  const filtered = methods.filter((m) => m.category === activeCategory);
  const selected = methods.find((m) => m.name === activeMethod);

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    const first = methods.find((m) => m.category === cat);
    if (first) setActiveMethod(first.name);
    setActiveExample(0);
  }

  function handleMethodChange(name: string) {
    setActiveMethod(name);
    setActiveExample(0);
  }

  return (
    <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-brand-border">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block mb-3">
          Method Explorer
        </span>
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all duration-500 capitalize cursor-pointer outline-none ${
                activeCategory === cat
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted hover:text-brand-text hover:bg-brand-surface"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row min-h-80">
        <div className="sm:w-36 shrink-0 border-b sm:border-b-0 sm:border-r border-brand-border p-2">
          <div className="flex sm:flex-col gap-1 flex-wrap sm:flex-nowrap">
            <AnimatePresence mode="popLayout">
              {filtered.map((m) => (
                <motion.button
                  key={m.name}
                  layout
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={SPRING}
                  onClick={() => handleMethodChange(m.name)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`text-left px-3 py-2 rounded-md text-[12px] font-mono transition-all duration-500 cursor-pointer outline-none w-full ${
                    activeMethod === m.name
                      ? "bg-brand-primary/10 text-brand-primary font-medium"
                      : "text-brand-text-muted hover:text-brand-text hover:bg-brand-surface/50"
                  }`}
                >
                  {m.name}()
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={SPRING}
              className="flex-1 p-5 space-y-3 min-w-0"
            >
              <code className="block text-[12px] font-mono text-brand-primary bg-brand-primary/5 px-3 py-2 rounded-lg break-all">
                {selected.signature}
              </code>

              <p className="text-[13px] text-brand-text-muted leading-relaxed">
                {selected.description}
              </p>

              {selected.analogy && (
                <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-2 rounded-r-lg">
                  <p className="text-[12px] text-brand-text-muted italic">{selected.analogy}</p>
                </div>
              )}

              {selected.examples.length > 1 && (
                <div className="flex gap-1.5 flex-wrap">
                  {selected.examples.map((ex, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveExample(i)}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={SPRING}
                      className={`px-2.5 py-1 text-[10px] rounded transition-all duration-500 cursor-pointer outline-none ${
                        activeExample === i
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "bg-brand-surface text-brand-text-muted hover:text-brand-text"
                      }`}
                    >
                      {ex.label}
                    </motion.button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selected.name}-${activeExample}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="bg-brand-surface rounded-lg overflow-hidden"
                >
                  <div className="px-4 py-3 font-mono text-[12px] text-brand-text overflow-x-auto">
                    {selected.examples[activeExample]?.code}
                  </div>
                  <div className="border-t border-brand-border px-4 py-2 font-mono text-[12px] text-brand-primary bg-brand-primary/5">
                    &rarr; {selected.examples[activeExample]?.output}
                  </div>
                </motion.div>
              </AnimatePresence>

              {selected.gotcha && (
                <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-2 rounded-r-lg">
                  <p className="text-[11px] text-brand-warning font-medium mb-0.5">Gotcha</p>
                  <p className="text-[12px] text-brand-text-muted">{selected.gotcha}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
