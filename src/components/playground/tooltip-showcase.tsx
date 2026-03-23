"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Command, Zap } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 500, damping: 30 };

type Placement = "top" | "right" | "bottom" | "left";

const offsets: Record<Placement, { initial: { x: number; y: number }; arrow: string; pos: string }> = {
  top:    { initial: { x: 0, y: 4 },   arrow: "bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground", pos: "bottom-full left-1/2 -translate-x-1/2 mb-2" },
  bottom: { initial: { x: 0, y: -4 },  arrow: "top-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-foreground", pos: "top-full left-1/2 -translate-x-1/2 mt-2" },
  left:   { initial: { x: 4, y: 0 },   arrow: "right-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-foreground", pos: "right-full top-1/2 -translate-y-1/2 mr-2" },
  right:  { initial: { x: -4, y: 0 },  arrow: "left-[-4px] top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-foreground", pos: "left-full top-1/2 -translate-y-1/2 ml-2" },
};

function useTooltip(delay = 300) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { visible, show, hide };
}

function SimpleTooltip({ label, placement }: { label: string; placement: Placement }) {
  const { visible, show, hide } = useTooltip();
  const cfg = offsets[placement];

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer">
        {placement.charAt(0).toUpperCase() + placement.slice(1)}
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            className={`absolute z-50 ${cfg.pos} pointer-events-none`}
            initial={{ opacity: 0, scale: 0.95, ...cfg.initial }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, ...cfg.initial }}
            transition={spring}
          >
            <div className="bg-foreground text-background rounded-lg px-2.5 py-1.5 text-[11px] max-w-[200px] whitespace-nowrap relative">
              {label}
              <div className={`absolute w-0 h-0 ${cfg.arrow}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RichTooltip() {
  const { visible, show, hide } = useTooltip();

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-500 cursor-pointer inline-flex items-center gap-1.5">
        <Info className="w-3 h-3" />
        Rich Tooltip
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2"
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={spring}
          >
            <div className="bg-foreground text-background rounded-lg px-3 py-2.5 text-[11px] max-w-[220px] space-y-1.5 relative">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="font-medium">Quick Submit</span>
              </div>
              <p className="text-[10px] opacity-70 leading-relaxed">
                Submit your solution without leaving the editor.
              </p>
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-background/20 text-[9px] font-mono inline-flex items-center gap-0.5">
                  <Command className="w-2 h-2" /> Enter
                </kbd>
              </div>
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HoverCard() {
  const { visible, show, hide } = useTooltip();

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted text-foreground hover:bg-muted/80 transition-all duration-500 cursor-pointer">
        @sarah_dev
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={spring}
          >
            <div className="bg-card border border-border/50 rounded-xl p-3 w-[220px] shadow-lg">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
                  S
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-foreground">Sarah Chen</p>
                  <p className="text-[10px] text-muted-foreground">@sarah_dev</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="text-center">
                  <p className="text-[12px] font-bold text-foreground">342</p>
                  <p className="text-[9px] text-muted-foreground">Solved</p>
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-bold text-primary">87</p>
                  <p className="text-[9px] text-muted-foreground">Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-bold text-foreground">Top 3%</p>
                  <p className="text-[9px] text-muted-foreground">Rank</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TooltipShowcase() {
  return (
    <div className="space-y-6">
      {/* Directional tooltips */}
      <div>
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium mb-3">
          Directional
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 py-8">
          {(["top", "right", "bottom", "left"] as Placement[]).map((p) => (
            <SimpleTooltip key={p} label={`Tooltip on ${p}`} placement={p} />
          ))}
        </div>
      </div>

      {/* Rich variants */}
      <div>
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium mb-3">
          Rich Variants
        </p>
        <div className="flex flex-wrap items-center gap-3 py-4">
          <RichTooltip />
          <HoverCard />
        </div>
      </div>
    </div>
  );
}
