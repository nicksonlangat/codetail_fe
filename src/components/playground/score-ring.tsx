"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

/* ── Single ring ── */
function Ring({
  score,
  label,
  delay = 0,
}: {
  score: number;
  label: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const size = 120;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  /* Animated number */
  const raw = useMotionValue(0);
  const sprng = useSpring(raw, { stiffness: 60, damping: 20 });
  const display = useTransform(sprng, (v) => Math.round(v));

  /* Animated offset for the ring */
  const offsetMV = useMotionValue(circumference);
  const offsetSpring = useSpring(offsetMV, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const timeout = setTimeout(() => {
      raw.set(score);
      offsetMV.set(circumference * (1 - score / 100));
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [score, delay, raw, offsetMV, circumference]);

  const grade =
    score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Fair" : "Needs Work";
  const gradeColor =
    score >= 90 ? "text-primary" : score >= 75 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500";

  return (
    <motion.div
      className="flex flex-col items-center gap-3 cursor-pointer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.08, y: -4 }}
      transition={spring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: hovered
              ? "0 0 24px 4px hsl(164 70% 40% / 0.2)"
              : "0 0 0px 0px hsl(164 70% 40% / 0)",
          }}
          transition={{ duration: 0.5 }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-muted"
          />
          {/* Hover track glow */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={hovered ? stroke + 2 : stroke}
            strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: offsetSpring }}
            animate={{ opacity: hovered ? 1 : 0.85 }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-2xl font-bold tabular-nums font-mono text-foreground">
            {display}
          </motion.span>
          <motion.span
            className={`text-[10px] font-medium ${hovered ? gradeColor : "text-muted-foreground"}`}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {hovered ? grade : "/100"}
          </motion.span>
        </div>
      </div>

      <motion.span
        className="text-[11px] font-medium tracking-wide transition-all duration-500"
        animate={{ color: hovered ? "hsl(164 70% 40%)" : "hsl(220 9% 46%)" }}
        transition={{ duration: 0.5 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

/* ── Exported composite ── */
const rings = [
  { score: 87, label: "Code Quality" },
  { score: 92, label: "Correctness" },
  { score: 71, label: "Performance" },
];

export function ScoreRing() {
  return (
    <div className="flex items-center justify-center gap-10 py-6">
      {rings.map((r, i) => (
        <Ring key={r.label} score={r.score} label={r.label} delay={i * 0.15} />
      ))}
    </div>
  );
}
