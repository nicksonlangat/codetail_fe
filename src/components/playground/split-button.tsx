"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ChevronDown,
  RefreshCw,
  FileCode,
  Bug,
  Check,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const options = [
  { id: "all", label: "Run All Tests", icon: Play },
  { id: "failed", label: "Run Failed Tests", icon: RefreshCw },
  { id: "current", label: "Run Current File", icon: FileCode },
  { id: "debug", label: "Debug Mode", icon: Bug },
];

export function SplitButton() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedOption = options.find((o) => o.id === selected)!;

  return (
    <div className="space-y-8 py-6">
      {/* Split button */}
      <div className="flex justify-center">
        <div className="relative inline-flex" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            onClick={() => {}}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-medium rounded-l-lg transition-all duration-500"
          >
            <selectedOption.icon className="w-3.5 h-3.5" />
            {selectedOption.label}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            onClick={() => setOpen(!open)}
            className="cursor-pointer flex items-center px-2 py-2 bg-primary text-white border-l border-white/20 rounded-r-lg transition-all duration-500"
          >
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={spring}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={spring}
                className="absolute top-full mt-1.5 right-0 w-52 bg-card border border-border/40 rounded-lg shadow-lg overflow-hidden z-20"
              >
                {options.map((option) => {
                  const Icon = option.icon;
                  const isSelected = option.id === selected;
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => {
                        setSelected(option.id);
                        setOpen(false);
                      }}
                      onMouseEnter={() => setHoveredId(option.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="cursor-pointer relative w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-foreground transition-all duration-500"
                    >
                      {hoveredId === option.id && (
                        <motion.div
                          layoutId="split-highlight"
                          className="absolute inset-0 bg-muted"
                          transition={spring}
                        />
                      )}
                      <span className="relative flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={spring}
                          className="relative ml-auto"
                        >
                          <Check className="w-3 h-3 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Button group */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 text-center">
          Button Group
        </p>
        <div className="flex justify-center">
          <div className="inline-flex border border-border/40 rounded-lg overflow-hidden">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
              className="cursor-pointer px-3 py-2 bg-card text-muted-foreground hover:text-foreground hover:bg-muted text-xs transition-all duration-500"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
              onClick={() => setPlaying(!playing)}
              className="cursor-pointer px-3 py-2 bg-card text-muted-foreground hover:text-foreground hover:bg-muted text-xs border-x border-border/40 transition-all duration-500"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={playing ? "pause" : "play"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={spring}
                >
                  {playing ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
              className="cursor-pointer px-3 py-2 bg-card text-muted-foreground hover:text-foreground hover:bg-muted text-xs transition-all duration-500"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
