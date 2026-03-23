"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

/* ── Status config ── */
type Status = {
  key: string;
  label: string;
  color: string;
  pulse?: boolean;
};

const statuses: Status[] = [
  { key: "generated", label: "Generated", color: "#0ea5e9" },
  { key: "submitted", label: "Submitted", color: "#8b5cf6" },
  { key: "passed", label: "Passed", color: "hsl(142 60% 42%)" },
  { key: "failed", label: "Failed", color: "hsl(0 68% 55%)" },
  { key: "in-progress", label: "In Progress", color: "#eab308", pulse: true },
];

/* ── Badge ── */
function Badge({
  status,
  selected,
  onClick,
}: {
  status: Status;
  selected: boolean;
  onClick: () => void;
}) {
  const { label, color, pulse } = status;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-500 outline-none cursor-pointer"
      style={{
        background: `color-mix(in srgb, ${color} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 19%, transparent)`,
        color,
      }}
    >
      {/* Dot */}
      <motion.span
        className="block w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color }}
        {...(pulse
          ? {
              animate: { scale: [1, 1.3, 1] },
              transition: { repeat: Infinity, duration: 1.4, ease: "easeInOut" },
            }
          : {})}
      />
      {label}
      {selected && <Check className="w-3 h-3 ml-0.5" />}
    </button>
  );
}

/* ── Dropdown ── */
function StatusDropdown({
  anchor,
  selected,
  onSelect,
  onClose,
}: {
  anchor: DOMRect | null;
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      className="absolute z-50 mt-2 w-48 rounded-lg bg-card border border-border shadow-elevated-lg p-1"
      initial={{ opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {statuses.map((s) => {
        const active = s.key === selected;
        return (
          <button
            key={s.key}
            onClick={() => {
              onSelect(s.key);
              onClose();
            }}
            className="flex items-center gap-2 w-full rounded-md px-2.5 py-1.5 text-xs transition-all duration-500 hover:bg-muted text-foreground cursor-pointer"
          >
            <span
              className="block w-2 h-2 rounded-full shrink-0"
              style={{ background: s.color }}
            />
            <span className="flex-1 text-left">{s.label}</span>
            {active && <Check className="w-3 h-3 text-primary" />}
          </button>
        );
      })}
    </motion.div>
  );
}

/* ── Exported composite ── */
export function StatusBadges() {
  const [selected, setSelected] = useState("passed");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleBadgeClick(key: string, e: React.MouseEvent) {
    setSelected(key);
    setAnchorRect((e.currentTarget as HTMLElement).getBoundingClientRect());
    setDropdownOpen((prev) => !prev);
  }

  return (
    <div className="py-6 space-y-6">
      {/* Row of badges */}
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((s) => (
          <Badge
            key={s.key}
            status={s}
            selected={s.key === selected}
            onClick={(e?: any) => handleBadgeClick(s.key, e)}
          />
        ))}
      </div>

      {/* Interactive dropdown section */}
      <div className="relative inline-block" ref={containerRef}>
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-all duration-500 cursor-pointer"
          onClick={(e) => {
            setAnchorRect(e.currentTarget.getBoundingClientRect());
            setDropdownOpen((p) => !p);
          }}
        >
          Click to change status: <span className="font-medium text-foreground">{statuses.find((s) => s.key === selected)?.label}</span>
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <StatusDropdown
              anchor={anchorRect}
              selected={selected}
              onSelect={setSelected}
              onClose={() => setDropdownOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
