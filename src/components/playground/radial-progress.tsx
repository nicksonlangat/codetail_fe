"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

interface Ring {
  label: string;
  progress: number;
  color: string;
  radius: number;
  strokeWidth: number;
}

const rings: Ring[] = [
  { label: "DSA", progress: 72, color: "hsl(var(--primary))", radius: 80, strokeWidth: 10 },
  { label: "Frameworks", progress: 58, color: "#0ea5e9", radius: 60, strokeWidth: 10 },
  { label: "SQL", progress: 85, color: "#8b5cf6", radius: 40, strokeWidth: 10 },
];

function ProgressRing({
  ring,
  delay,
  isHovered,
}: {
  ring: Ring;
  delay: number;
  isHovered: boolean;
}) {
  const circumference = 2 * Math.PI * ring.radius;
  const offset = circumference * (1 - ring.progress / 100);

  return (
    <>
      {/* Track */}
      <circle
        cx="100"
        cy="100"
        r={ring.radius}
        fill="none"
        stroke="currentColor"
        className="text-muted/50"
        strokeWidth={ring.strokeWidth}
      />
      {/* Progress */}
      <motion.circle
        cx="100"
        cy="100"
        r={ring.radius}
        fill="none"
        stroke={ring.color}
        strokeWidth={isHovered ? ring.strokeWidth + 3 : ring.strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ ...spring, delay }}
        transform="rotate(-90 100 100)"
        className="transition-all duration-500"
      />
    </>
  );
}

function CountUp({ target, delay }: { target: number; delay: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1200;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setValue(target);
          clearInterval(interval);
        } else {
          setValue(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return <>{value}%</>;
}

export function RadialProgress() {
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);

  return (
    <div className="py-6 space-y-4">
      <motion.div
        className="flex flex-col items-center gap-6"
        whileHover={{ rotate: 3 }}
        transition={spring}
      >
        {/* SVG rings */}
        <div className="relative w-[200px] h-[200px]">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {rings.map((ring, i) => (
              <ProgressRing
                key={ring.label}
                ring={ring}
                delay={i * 0.15}
                isHovered={hoveredRing === i}
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground tabular-nums">
              <CountUp target={72} delay={0.1} />
            </span>
            <span className="text-[10px] text-muted-foreground">Overall</span>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6">
        {rings.map((ring, i) => (
          <motion.div
            key={ring.label}
            className="flex items-center gap-1.5 cursor-pointer transition-all duration-500"
            onMouseEnter={() => setHoveredRing(i)}
            onMouseLeave={() => setHoveredRing(null)}
            animate={{
              scale: hoveredRing === i ? 1.08 : 1,
              opacity: hoveredRing !== null && hoveredRing !== i ? 0.5 : 1,
            }}
            transition={spring}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: ring.color }}
            />
            <span className="text-[11px] text-foreground font-medium">{ring.label}</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {ring.progress}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
