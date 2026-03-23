"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface Shortcut {
  label: string;
  keys: string[];
}

const shortcuts: Shortcut[] = [
  { label: "Submit Solution", keys: ["⌘", "Enter"] },
  { label: "Next Problem", keys: ["⌘", "→"] },
  { label: "Toggle Hints", keys: ["⌘", "H"] },
  { label: "Reset Code", keys: ["⌘", "⇧", "R"] },
  { label: "Run Tests", keys: ["⌘", "⇧", "T"] },
  { label: "Command Palette", keys: ["⌘", "K"] },
];

const paletteCommands: Shortcut[] = [
  { label: "Submit Solution", keys: ["⌘", "Enter"] },
  { label: "Run Tests", keys: ["⌘", "⇧", "T"] },
  { label: "Toggle Hints", keys: ["⌘", "H"] },
  { label: "Reset Code", keys: ["⌘", "⇧", "R"] },
  { label: "Open Settings", keys: ["⌘", ","] },
];

const spring = { type: "spring" as const, stiffness: 500, damping: 35 };

function KeyBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-md bg-muted border border-border text-[10px] font-mono text-muted-foreground shadow-sm leading-none">
      {children}
    </span>
  );
}

function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {keys.map((key, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && <span className="text-[9px] text-muted-foreground/40 mx-px">+</span>}
          <KeyBadge>{key}</KeyBadge>
        </span>
      ))}
    </span>
  );
}

export function KeyboardHints() {
  const [showPalette, setShowPalette] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="relative space-y-4" style={{ minHeight: showPalette ? 320 : undefined }}>
      {/* Shortcut list */}
      <div className="space-y-0.5">
        {shortcuts.map((s, i) => (
          <motion.div
            key={s.label}
            className="relative flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer"
            onHoverStart={() => setHoveredRow(i)}
            onHoverEnd={() => setHoveredRow(null)}
            onClick={() => { if (s.label === "Command Palette") setShowPalette(true); }}
          >
            {hoveredRow === i && (
              <motion.div
                layoutId="shortcut-hover"
                className="absolute inset-0 bg-muted/60 rounded-lg"
                transition={spring}
              />
            )}
            <span className="relative text-[12px] text-foreground">{s.label}</span>
            <motion.div
              className="relative"
              animate={{ y: hoveredRow === i ? -1 : 0 }}
              transition={spring}
            >
              <KeyCombo keys={s.keys} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setShowPalette(true)}
        className="w-full text-[11px] text-muted-foreground hover:text-foreground transition-all duration-500 py-1.5 border border-dashed border-border rounded-lg"
      >
        Open command palette demo
      </button>

      {/* Command Palette overlay */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            className="absolute inset-0 z-10 flex items-start justify-center pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl"
              onClick={() => setShowPalette(false)}
            />

            {/* Palette */}
            <motion.div
              className="relative w-[90%] max-w-[280px] surface-elevated rounded-xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: -8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -8 }}
              transition={spring}
            >
              {/* Search input */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground">Type a command...</span>
              </div>

              {/* Commands */}
              <div className="py-1">
                {paletteCommands.map((cmd, i) => (
                  <motion.div
                    key={cmd.label}
                    className="relative flex items-center justify-between px-3 py-1.5 cursor-pointer"
                    onHoverStart={() => setActiveIndex(i)}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: i * 0.03 }}
                  >
                    {activeIndex === i && (
                      <motion.div
                        layoutId="palette-highlight"
                        className="absolute inset-x-1 inset-y-0 bg-primary/8 rounded-md"
                        transition={spring}
                      />
                    )}
                    <span className={`relative text-[12px] ${activeIndex === i ? "text-foreground" : "text-muted-foreground"}`}>
                      {cmd.label}
                    </span>
                    <div className="relative">
                      <KeyCombo keys={cmd.keys} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-3 py-1.5 border-t border-border flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground/50">
                  <KeyBadge>↑↓</KeyBadge> navigate
                </span>
                <span className="text-[10px] text-muted-foreground/50">
                  <KeyBadge>↵</KeyBadge> select
                </span>
                <span className="text-[10px] text-muted-foreground/50 ml-auto">
                  <KeyBadge>esc</KeyBadge> close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
