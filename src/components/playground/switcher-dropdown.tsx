"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Plus, Search } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

interface Workspace {
  id: string;
  name: string;
  role: "Owner" | "Member" | "Viewer";
  avatar: string;
}

const workspaces: Workspace[] = [
  { id: "1", name: "Alex's Workspace", role: "Owner", avatar: "A" },
  { id: "2", name: "Team Alpha", role: "Member", avatar: "T" },
  { id: "3", name: "Study Group", role: "Member", avatar: "S" },
  { id: "4", name: "Interview Prep", role: "Viewer", avatar: "I" },
];

const roleBadge: Record<string, string> = {
  Owner: "bg-primary/15 text-primary",
  Member: "bg-blue-500/15 text-blue-600",
  Viewer: "bg-muted text-muted-foreground",
};

export function SwitcherDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(workspaces[0]);
  const [search, setSearch] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (ws: Workspace) => {
    setSelected(ws);
    setFlash(ws.id);
    setTimeout(() => setFlash(null), 600);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="py-4 flex justify-center">
      <div ref={ref} className="relative w-[280px]">
        {/* Trigger */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={spring}
          onClick={() => setOpen(!open)}
          className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-border"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
            {selected.avatar}
          </div>
          <span className="flex-1 text-left text-[13px] font-medium text-foreground truncate">
            {selected.name}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={spring}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={spring}
              className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-card border border-border/50 shadow-lg overflow-hidden z-20"
            >
              {/* Search */}
              <div className="p-2 border-b border-border/30">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
                  <Search className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search workspaces..."
                    className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground/40 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Workspace list */}
              <div className="py-1 relative">
                {filtered.map((ws) => (
                  <div key={ws.id} className="relative">
                    {/* Sliding highlight */}
                    {hovered === ws.id && (
                      <motion.div
                        layoutId="ws-highlight"
                        className="absolute inset-x-1 inset-y-0 rounded-lg bg-muted"
                        transition={spring}
                      />
                    )}
                    <button
                      onClick={() => handleSelect(ws)}
                      onMouseEnter={() => setHovered(ws.id)}
                      onMouseLeave={() => setHovered(null)}
                      className={`cursor-pointer relative z-10 w-full flex items-center gap-3 px-3 py-2 text-left transition-all duration-500 ${
                        flash === ws.id ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {ws.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-medium text-foreground truncate block">
                          {ws.name}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${roleBadge[ws.role]}`}
                      >
                        {ws.role}
                      </span>
                      {selected.id === ws.id && (
                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      )}
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="px-3 py-4 text-center text-[11px] text-muted-foreground">
                    No workspaces found
                  </p>
                )}
              </div>

              {/* Create button */}
              <div className="border-t border-border/30 p-1">
                <button className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-500 hover:bg-muted">
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[12px] text-muted-foreground font-medium">
                    Create workspace
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
