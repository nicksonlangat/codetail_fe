"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Menu,
  X,
  Plus,
  Check,
  Sun,
  Moon,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

interface IconPair {
  a: { icon: typeof Play; label: string };
  b: { icon: typeof Pause; label: string };
  bgA: string;
  bgB: string;
}

const pairs: IconPair[] = [
  {
    a: { icon: Play, label: "Play" },
    b: { icon: Pause, label: "Pause" },
    bgA: "bg-muted",
    bgB: "bg-primary/10",
  },
  {
    a: { icon: Menu, label: "Menu" },
    b: { icon: X, label: "Close" },
    bgA: "bg-muted",
    bgB: "bg-primary/10",
  },
  {
    a: { icon: Plus, label: "Add" },
    b: { icon: Check, label: "Confirm" },
    bgA: "bg-muted",
    bgB: "bg-primary/10",
  },
  {
    a: { icon: Sun, label: "Light" },
    b: { icon: Moon, label: "Dark" },
    bgA: "bg-muted",
    bgB: "bg-primary/10",
  },
];

function MorphButton({ pair }: { pair: IconPair }) {
  const [toggled, setToggled] = useState(false);
  const current = toggled ? pair.b : pair.a;
  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={() => setToggled((v) => !v)}
        className={`cursor-pointer h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 ${
          toggled ? pair.bgB : pair.bgA
        }`}
        whileTap={{ scale: 0.9 }}
        transition={spring}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={current.label}
            className="flex items-center justify-center"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={spring}
          >
            <Icon className="w-5 h-5 text-foreground" />
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.span
          key={current.label}
          className="text-[11px] text-muted-foreground"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {current.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function MorphingIcon() {
  return (
    <div className="flex items-start justify-between max-w-sm mx-auto">
      {pairs.map((pair, i) => (
        <MorphButton key={i} pair={pair} />
      ))}
    </div>
  );
}
