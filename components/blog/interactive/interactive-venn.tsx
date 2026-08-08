"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type Op = {
  label: string;
  code: string;
  comment: string;
  result: number[];
  aOnly: boolean;
  both: boolean;
  bOnly: boolean;
};

const OPS: Op[] = [
  { label: "A | B", code: "A | B", comment: "union: all items from both", result: [1, 2, 3, 4, 5, 6, 7, 8], aOnly: true, both: true, bOnly: true },
  { label: "A & B", code: "A & B", comment: "intersection: items in both", result: [4, 5], aOnly: false, both: true, bOnly: false },
  { label: "A - B", code: "A - B", comment: "difference: in A, not in B", result: [1, 2, 3], aOnly: true, both: false, bOnly: false },
  { label: "B - A", code: "B - A", comment: "difference: in B, not in A", result: [6, 7, 8], aOnly: false, both: false, bOnly: true },
  { label: "A ^ B", code: "A ^ B", comment: "symmetric difference: in exactly one", result: [1, 2, 3, 6, 7, 8], aOnly: true, both: false, bOnly: true },
];

const cxA = 108, cxB = 192, cy = 75, r = 70;

export function InteractiveVenn() {
  const [active, setActive] = useState<string | null>(null);
  const op = OPS.find((o) => o.label === active) ?? null;

  const fillOp = (lit: boolean) => (op ? (lit ? 0.2 : 0.04) : 0.08);
  const textOp = (lit: boolean) => (op ? (lit ? 1 : 0.25) : 0.7);
  const strokeOp = (lit: boolean) => (op ? (lit ? 1 : 0.25) : 0.55);

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle block">
            Set Operations Explorer
          </span>
          <span className="text-[11px] font-mono text-brand-text-subtle mt-0.5 block">
            A = {"{1, 2, 3, 4, 5}"}{"  ·  "}B = {"{4, 5, 6, 7, 8}"}
          </span>
        </div>
        <AnimatePresence>
          {op && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              onClick={() => setActive(null)}
              className="text-[10px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center mb-5">
        <svg width={300} height={150} viewBox="0 0 300 150" className="text-brand-text overflow-visible">
          <defs>
            <mask id="venn-a-only">
              <circle cx={cxA} cy={cy} r={r} fill="white" />
              <circle cx={cxB} cy={cy} r={r} fill="black" />
            </mask>
            <mask id="venn-b-only">
              <circle cx={cxB} cy={cy} r={r} fill="white" />
              <circle cx={cxA} cy={cy} r={r} fill="black" />
            </mask>
            <clipPath id="venn-both">
              <circle cx={cxA} cy={cy} r={r} />
            </clipPath>
          </defs>

          <motion.rect
            x={0} y={0} width={300} height={150}
            mask="url(#venn-a-only)" fill="var(--brand-primary)"
            animate={{ fillOpacity: fillOp(op?.aOnly ?? false) }} transition={SPRING}
          />
          <motion.circle
            cx={cxB} cy={cy} r={r}
            clipPath="url(#venn-both)" fill="var(--brand-primary)"
            animate={{ fillOpacity: fillOp(op?.both ?? false) }} transition={SPRING}
          />
          <motion.rect
            x={0} y={0} width={300} height={150}
            mask="url(#venn-b-only)" fill="var(--brand-primary)"
            animate={{ fillOpacity: fillOp(op?.bOnly ?? false) }} transition={SPRING}
          />

          <motion.circle
            cx={cxA} cy={cy} r={r} fill="none" stroke="var(--brand-primary)" strokeWidth={1.5}
            animate={{ strokeOpacity: strokeOp(op ? op.aOnly || op.both : true) }} transition={SPRING}
          />
          <motion.circle
            cx={cxB} cy={cy} r={r} fill="none" stroke="var(--brand-primary)" strokeWidth={1.5}
            animate={{ strokeOpacity: strokeOp(op ? op.bOnly || op.both : true) }} transition={SPRING}
          />

          <text x={50} y={25} fill="currentColor" fontSize={11} fontFamily="monospace" opacity={0.4}>A</text>
          <text x={244} y={25} fill="currentColor" fontSize={11} fontFamily="monospace" opacity={0.4}>B</text>

          <motion.g animate={{ opacity: textOp(op?.aOnly ?? true) }} transition={SPRING}>
            <text x={70} y={cy - 8} fill="currentColor" fontSize={12} fontFamily="monospace" textAnchor="middle">1  2</text>
            <text x={70} y={cy + 12} fill="currentColor" fontSize={12} fontFamily="monospace" textAnchor="middle">3</text>
          </motion.g>

          <motion.g animate={{ opacity: textOp(op?.both ?? true) }} transition={SPRING}>
            <text x={150} y={cy - 8} fill="currentColor" fontSize={12} fontFamily="monospace" textAnchor="middle">4</text>
            <text x={150} y={cy + 12} fill="currentColor" fontSize={12} fontFamily="monospace" textAnchor="middle">5</text>
          </motion.g>

          <motion.g animate={{ opacity: textOp(op?.bOnly ?? true) }} transition={SPRING}>
            <text x={230} y={cy - 8} fill="currentColor" fontSize={12} fontFamily="monospace" textAnchor="middle">6  7</text>
            <text x={230} y={cy + 12} fill="currentColor" fontSize={12} fontFamily="monospace" textAnchor="middle">8</text>
          </motion.g>
        </svg>
      </div>

      <div className="space-y-2 mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Try it, pick an operation
        </span>
        <div className="flex flex-wrap gap-1.5">
          {OPS.map((o) => (
            <motion.button
              key={o.label}
              onClick={() => setActive(active === o.label ? null : o.label)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-all duration-500 cursor-pointer outline-none ${
                active === o.label
                  ? "border-brand-primary/20 bg-brand-primary/10 text-brand-primary"
                  : "text-brand-text-muted bg-brand-surface border-brand-border hover:text-brand-text"
              }`}
            >
              {o.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {op && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-surface/60 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-brand-text-muted">Result</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={op.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="text-[10px] font-mono text-brand-text-subtle"
                  >
                    {op.comment}
                  </motion.span>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait">
                <motion.code
                  key={op.label + "r"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-[13px] font-mono text-brand-text"
                >
                  {`{${op.result.join(", ")}}`}
                </motion.code>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
