"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, WandSparkles, Command } from "lucide-react";
import { AiProblemPanel } from "./ai-problem-panel";
import type { ProblemBrief } from "@/lib/api/interviews";

interface AiDrawerProps {
  open: boolean;
  onClose: () => void;
  interviewTitle: string;
  onProblemAdded: (p: ProblemBrief) => void;
}

export function AiDrawer({ open, onClose, interviewTitle, onProblemAdded }: AiDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-[560px] bg-card border-l border-border/60 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <WandSparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold tracking-tight">AI Problem Designer</p>
                  {interviewTitle && (
                    <p className="text-[11px] text-muted-foreground truncate max-w-[320px]">
                      for <span className="text-foreground font-medium">{interviewTitle}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60 text-[10px] text-muted-foreground font-mono select-none">
                  <Command className="w-2.5 h-2.5" /> Esc
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body — full height AI panel */}
            <div className="flex-1 min-h-0">
              <AiProblemPanel
                onProblemAdded={(p) => {
                  onProblemAdded(p);
                  onClose();
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
