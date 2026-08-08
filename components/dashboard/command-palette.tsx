"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, WandSparkles, Database, Clock,
  LayoutDashboard, Route, Network, Settings,
} from "lucide-react";
import { StackTile } from "./stack-tile";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

type CommandItem = {
  id: string;
  label: string;
  category: "Navigation" | "Stacks" | "Actions" | "Recent";
  shortcut?: string;
  icon?: typeof Clock;
  stack?: string;
};

const COMMANDS: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "D", category: "Navigation" },
  { id: "paths", label: "Paths", icon: Route, shortcut: "P", category: "Navigation" },
  { id: "system-design", label: "System Design", icon: Network, shortcut: "S", category: "Navigation" },
  { id: "python", label: "Python Path", stack: "python", category: "Stacks" },
  { id: "django", label: "Django Path", stack: "django", category: "Stacks" },
  { id: "fastapi", label: "FastAPI Path", stack: "fastapi", category: "Stacks" },
  { id: "sql", label: "SQL Path", icon: Database, category: "Stacks" },
  { id: "ask-ai", label: "Ask AI", icon: WandSparkles, shortcut: "⌘J", category: "Actions" },
  { id: "settings", label: "Settings", icon: Settings, shortcut: ",", category: "Actions" },
  { id: "two-sum", label: "Two Sum", icon: Clock, category: "Recent" },
  { id: "valid-parens", label: "Valid Parentheses", icon: Clock, category: "Recent" },
];

// Only mounted while the palette is open (see CommandPalette below), so
// query/activeIdx start fresh on every open with no manual reset — no
// effect, no ref-diffing, just ordinary useState initializers.
function PaletteBody({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  useLockBodyScroll(true);

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  const categories = [...new Set(filtered.map((c) => c.category))];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const flatLength = filtered.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatLength - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered.length, onClose]
  );

  let itemIndex = -1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-brand-text/40 z-50 flex justify-center pt-[15vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={SP}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-fit rounded-xl border border-brand-border bg-white shadow-xl overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-border">
          <Search className="size-4 text-brand-text-subtle shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search paths, problems, actions..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-brand-text-subtle"
          />
          <span className="text-[10px] font-mono text-brand-text-subtle bg-brand-surface px-1.5 py-1 rounded-md shrink-0">
            Esc
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-brand-text-subtle">No results found</p>
          ) : (
            categories.map((cat) => (
              <div key={cat}>
                <p className="px-3.5 pt-2 pb-1 text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
                  {cat}
                </p>
                {filtered
                  .filter((c) => c.category === cat)
                  .map((item) => {
                    itemIndex++;
                    const idx = itemIndex;
                    const isActive = idx === activeIdx;
                    return (
                      <div key={item.id} className="relative px-1.5">
                        {isActive && (
                          <motion.div
                            layoutId="cmd-highlight"
                            className="absolute inset-x-1.5 inset-y-0 rounded-lg bg-brand-surface"
                            transition={SP}
                          />
                        )}
                        <button
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={onClose}
                          className="cursor-pointer relative z-10 w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg transition-all duration-500"
                        >
                          {item.stack ? (
                            <StackTile stack={item.stack} className="size-5 shrink-0" />
                          ) : item.icon ? (
                            <item.icon className="size-4 text-brand-text-subtle shrink-0" />
                          ) : null}
                          <span className="flex-1 text-left text-brand-text">{item.label}</span>
                          {item.shortcut && (
                            <span className="text-[10px] font-mono text-brand-text-subtle px-1.5 py-0.5 rounded bg-brand-surface border border-brand-border">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <PaletteBody onClose={onClose} />}</AnimatePresence>;
}
