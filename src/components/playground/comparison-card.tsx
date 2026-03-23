"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical, ChevronLeft, ChevronRight } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

const beforeCode = [
  "function twoSum(nums, target) {",
  "  for (let i = 0; i < nums.length; i++) {",
  "    for (let j = i + 1; j < nums.length; j++) {",
  "      if (nums[i] + nums[j] === target) {",
  "        return [i, j];",
  "      }",
  "    }",
  "  }",
  "  return [];",
  "}",
];

const afterCode = [
  "function twoSum(nums, target) {",
  "  const map = new Map();",
  "  for (let i = 0; i < nums.length; i++) {",
  "    const comp = target - nums[i];",
  "    if (map.has(comp)) {",
  "      return [map.get(comp), i];",
  "    }",
  "    map.set(nums[i], i);",
  "  }",
  "  return [];",
  "}",
];

const metrics = [
  { label: "Time", before: "O(n\u00B2)", after: "O(n)", beforePct: 90, afterPct: 30 },
  { label: "Space", before: "O(1)", after: "O(n)", beforePct: 20, afterPct: 50 },
  { label: "Lines", before: "10", after: "11", beforePct: 60, afterPct: 65 },
];

function CodePanel({
  lines,
  tint,
  label,
}: {
  lines: string[];
  tint: string;
  label: string;
}) {
  return (
    <div className={`p-3 ${tint} h-full`}>
      <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 mb-2 block">
        {label}
      </span>
      <pre className="text-[11px] font-mono leading-5 text-foreground whitespace-pre overflow-hidden">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-muted-foreground/30 select-none w-4 text-right shrink-0">
              {i + 1}
            </span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function ComparisonCard() {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(90, Math.max(10, pct)));
  }, []);

  const onMouseDown = () => {
    dragging.current = true;
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="py-6 space-y-5">
      {/* Comparison area */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-border overflow-hidden bg-card select-none"
        style={{ height: 280 }}
      >
        {/* Before (full width behind) */}
        <div className="absolute inset-0">
          <CodePanel lines={beforeCode} tint="bg-red-500/5" label="Before" />
        </div>
        {/* After (clipped) */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <CodePanel lines={afterCode} tint="bg-green-500/5" label="After" />
        </div>
        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 z-10 transition-all duration-500"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-px bg-border" />
          <div
            onMouseDown={onMouseDown}
            className="cursor-pointer absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-10 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center gap-0"
          >
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
            <GripVertical className="w-3 h-3 text-muted-foreground" />
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 + i * 0.1 }}
            className="space-y-2"
          >
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
              {m.label}
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-red-400/60 transition-all duration-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${m.beforePct}%` }}
                    transition={{ ...spring, delay: 0.4 + i * 0.1 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground w-8">
                  {m.before}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-green-400/60 transition-all duration-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${m.afterPct}%` }}
                    transition={{ ...spring, delay: 0.5 + i * 0.1 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-primary w-8">
                  {m.after}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
