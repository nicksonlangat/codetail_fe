"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GLOSSARY } from "@/content/glossary";

type TermProps = {
  term: string;
  children: React.ReactNode;
};

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

export function Term({ term, children }: TermProps) {
  const [visible, setVisible] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const entry = GLOSSARY[term];

  if (!entry) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Term] No glossary entry for "${term}"`);
    }
    return <span>{children}</span>;
  }

  // Detect if the popover would overflow the right edge and flip it
  const checkFlip = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setFlipped(rect.left + 288 > window.innerWidth - 16);
  }, []);

  useEffect(() => {
    if (!visible) return;
    checkFlip();
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [visible, checkFlip]);

  return (
    <span
      ref={wrapperRef}
      className="relative inline"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
    >
      <span className="border-b border-dashed border-primary/60 text-primary/90 cursor-help">
        {children}
      </span>

      <AnimatePresence>
        {visible && (
          <motion.div
            className={`absolute bottom-full mb-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden text-left pointer-events-none ${flipped ? "right-0" : "left-0"}`}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={SPRING}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
              <span className="font-mono text-[12px] font-semibold text-primary">
                {entry.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded">
                {entry.type}
              </span>
            </div>

            {/* Definition */}
            <div className="px-4 py-3">
              <p className="text-[13px] leading-relaxed text-foreground/80">
                {entry.definition}
              </p>
            </div>

            {/* Code example */}
            {entry.example && (
              <div className="px-4 pb-4">
                <div className="rounded-lg overflow-hidden border border-border">
                  <pre className="bg-muted px-3 py-2.5 text-[11px] font-mono leading-relaxed text-foreground/85 overflow-x-auto">
                    <code>{entry.example}</code>
                  </pre>
                  {entry.exampleOutput && (
                    <div className="border-t border-border bg-background px-3 py-2">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 block mb-1">
                        output
                      </span>
                      <pre className="text-[11px] font-mono text-primary/80 leading-relaxed">
                        <code>{entry.exampleOutput}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
