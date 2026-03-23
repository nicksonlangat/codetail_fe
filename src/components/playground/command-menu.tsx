"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Code2,
  Route,
  Settings,
  Send,
  Play,
  Palette,
  RotateCcw,
  Clock,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  category: string;
}

const commands: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "D", category: "Navigation" },
  { id: "problems", label: "Problems", icon: Code2, shortcut: "P", category: "Navigation" },
  { id: "paths", label: "Paths", icon: Route, shortcut: "L", category: "Navigation" },
  { id: "settings", label: "Settings", icon: Settings, shortcut: ",", category: "Navigation" },
  { id: "submit", label: "Submit Solution", icon: Send, shortcut: "\u2318\u21A9", category: "Actions" },
  { id: "run", label: "Run Tests", icon: Play, shortcut: "\u2318R", category: "Actions" },
  { id: "theme", label: "Toggle Theme", icon: Palette, category: "Actions" },
  { id: "reset", label: "Reset Code", icon: RotateCcw, category: "Actions" },
  { id: "twosum", label: "Two Sum", icon: Clock, category: "Recent" },
  { id: "parens", label: "Valid Parentheses", icon: Clock, category: "Recent" },
];

export function CommandMenu() {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const categories = [...new Set(filtered.map((c) => c.category))];

  const flatItems = categories.flatMap((cat) =>
    filtered.filter((c) => c.category === cat)
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatItems[activeIdx]) {
        setFlash(flatItems[activeIdx].id);
        setTimeout(() => setFlash(null), 300);
      }
    },
    [flatItems, activeIdx]
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setActiveIdx(0);
  };

  let itemIndex = -1;

  return (
    <div className="py-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={spring}
        className="w-full max-w-md rounded-xl border border-border bg-card shadow-lg overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/50">
          <Search className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />
          <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0">
            \u2318K
          </span>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-1">
          {flatItems.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground/50">No results found</p>
            </div>
          ) : (
            categories.map((cat) => {
              const items = filtered.filter((c) => c.category === cat);
              return (
                <div key={cat}>
                  <p className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider font-medium text-muted-foreground/40">
                    {cat}
                  </p>
                  {items.map((item) => {
                    itemIndex++;
                    const idx = itemIndex;
                    const isActive = idx === activeIdx;
                    const isFlash = flash === item.id;
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="relative px-1.5">
                        {isActive && (
                          <motion.div
                            layoutId="cmd-highlight"
                            className="absolute inset-x-1.5 inset-y-0 rounded-lg bg-muted"
                            transition={spring}
                          />
                        )}
                        <button
                          onClick={() => {
                            setActiveIdx(idx);
                            setFlash(item.id);
                            setTimeout(() => setFlash(null), 300);
                          }}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={`cursor-pointer relative z-10 w-full flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-lg transition-all duration-500 ${
                            isFlash
                              ? "bg-primary/10 text-primary"
                              : "text-foreground"
                          }`}
                        >
                          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.shortcut && (
                            <span className="text-[10px] font-mono text-muted-foreground/40 px-1.5 py-0.5 rounded bg-muted/50 border border-border/30">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
