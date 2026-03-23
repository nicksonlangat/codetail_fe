"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

const SIZE = 240;
const CX = SIZE / 2;
const CY = SIZE / 2 + 20;
const R = 90;
const NEEDLE_LEN = 75;
const START_ANGLE = Math.PI;
const END_ANGLE = 0;

function polarToCart(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) };
}

function describeArc(startA: number, endA: number, r: number) {
  const s = polarToCart(startA, r);
  const e = polarToCart(endA, r);
  const large = startA - endA > Math.PI ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

const zones = [
  { from: 0, to: 40, color: "#ef4444" },
  { from: 40, to: 70, color: "#eab308" },
  { from: 70, to: 100, color: "#22c55e" },
];

function scoreToAngle(score: number) {
  return START_ANGLE - (score / 100) * (START_ANGLE - END_ANGLE);
}

function CountUp({ target }: { target: number }) {
  const spring = useSpring(0, { stiffness: 80, damping: 12 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [val, setVal] = useState(0);

  useEffect(() => {
    spring.set(target);
    const unsub = display.on("change", (v) => setVal(v as number));
    return unsub;
  }, [target, spring, display]);

  return <>{val}</>;
}

export function GaugeChart() {
  const [score, setScore] = useState(72);
  const needleAngle = useSpring(scoreToAngle(72), {
    stiffness: 80,
    damping: 12,
  });

  useEffect(() => {
    needleAngle.set(scoreToAngle(score));
  }, [score, needleAngle]);

  const needleX = useTransform(needleAngle, (a) => CX + NEEDLE_LEN * Math.cos(a));
  const needleY = useTransform(needleAngle, (a) => CY - NEEDLE_LEN * Math.sin(a));

  const currentZone = zones.find((z) => score >= z.from && score <= z.to) || zones[2];

  const randomize = () => setScore(Math.floor(Math.random() * 101));

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);
  const labels = [0, 25, 50, 75, 100];

  return (
    <div className="py-6 flex flex-col items-center gap-4">
      <svg width={SIZE} height={SIZE / 2 + 50} viewBox={`0 0 ${SIZE} ${SIZE / 2 + 50}`}>
        {/* Zone arcs */}
        {zones.map((zone) => {
          const sa = scoreToAngle(zone.from);
          const ea = scoreToAngle(zone.to);
          return (
            <path
              key={zone.from}
              d={describeArc(sa, ea, R)}
              fill="none"
              stroke={zone.color}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={0.25}
            />
          );
        })}

        {/* Active zone glow */}
        {(() => {
          const sa = scoreToAngle(currentZone.from);
          const ea = scoreToAngle(Math.min(score, currentZone.to));
          return (
            <path
              d={describeArc(sa, ea, R)}
              fill="none"
              stroke={currentZone.color}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={0.8}
              filter="url(#glow)"
            />
          );
        })()}

        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tick marks */}
        {ticks.map((t) => {
          const angle = scoreToAngle(t);
          const outer = polarToCart(angle, R + 14);
          const inner = polarToCart(angle, R + 8);
          return (
            <line
              key={t}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="currentColor"
              className="text-muted-foreground/20"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Labels */}
        {labels.map((l) => {
          const angle = scoreToAngle(l);
          const p = polarToCart(angle, R + 26);
          return (
            <text
              key={l}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground/50 text-[9px]"
            >
              {l}
            </text>
          );
        })}

        {/* Needle */}
        <motion.line
          x1={CX}
          y1={CY}
          x2={needleX}
          y2={needleY}
          stroke="currentColor"
          className="text-foreground"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={CX} cy={CY} r={5} className="fill-foreground" />
        <circle cx={CX} cy={CY} r={2.5} className="fill-card" />
      </svg>

      {/* Score display */}
      <div className="flex flex-col items-center -mt-2">
        <span className="text-4xl font-bold font-mono tabular-nums text-foreground">
          <CountUp target={score} />
        </span>
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60 mt-1">
          Performance Score
        </span>
      </div>

      {/* Randomize button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={randomize}
        className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium transition-all duration-500"
      >
        Randomize
      </motion.button>
    </div>
  );
}
