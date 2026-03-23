"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List, Kanban } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 500, damping: 35 };

const textOptions = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const iconOptions = [
  { id: "grid", label: "Grid view", icon: LayoutGrid },
  { id: "list", label: "List view", icon: List },
  { id: "board", label: "Board view", icon: Kanban },
];

function TextToggle() {
  const [selected, setSelected] = useState("daily");

  return (
    <div className="bg-muted rounded-lg p-1 inline-flex">
      {textOptions.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setSelected(opt.id)}
          className="relative px-4 py-1.5 text-[13px] font-medium cursor-pointer transition-all duration-500"
        >
          {selected === opt.id && (
            <motion.div
              layoutId="segment-indicator"
              className="absolute inset-0 bg-primary rounded-md"
              transition={spring}
            />
          )}
          <span
            className={`relative z-10 transition-all duration-500 ${
              selected === opt.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function IconToggle() {
  const [selected, setSelected] = useState("grid");

  return (
    <div className="bg-muted rounded-lg p-1 inline-flex">
      {iconOptions.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className="relative w-9 h-8 flex items-center justify-center cursor-pointer transition-all duration-500"
            title={opt.label}
          >
            {selected === opt.id && (
              <motion.div
                layoutId="icon-segment-indicator"
                className="absolute inset-0 bg-primary rounded-md"
                transition={spring}
              />
            )}
            <Icon
              className={`relative z-10 w-4 h-4 transition-all duration-500 ${
                selected === opt.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ToggleGroup() {
  return (
    <div className="py-6 space-y-8">
      {/* Text segmented control */}
      <div>
        <p className="text-[11px] text-muted-foreground mb-3">Time Period</p>
        <TextToggle />
      </div>

      {/* Icon segmented control */}
      <div>
        <p className="text-[11px] text-muted-foreground mb-3">View Mode</p>
        <IconToggle />
      </div>
    </div>
  );
}
