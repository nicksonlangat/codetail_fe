"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, House, Play } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const fullPath = [
  { label: "Home", icon: true },
  { label: "Paths", icon: false },
  { label: "Arrays & Strings", icon: false },
  { label: "Two Sum", icon: false },
];

const depthSequence = [1, 2, 3, 4, 3, 2];

export function BreadcrumbNav() {
  const [depth, setDepth] = useState(4);
  const [cycleIndex, setCycleIndex] = useState(0);

  const crumbs = fullPath.slice(0, depth);

  const simulateNav = () => {
    const nextIndex = (cycleIndex + 1) % depthSequence.length;
    setCycleIndex(nextIndex);
    setDepth(depthSequence[nextIndex]);
  };

  const navigateTo = (index: number) => {
    setDepth(index + 1);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb bar */}
      <div className="bg-card rounded-xl border border-border/50 px-4 py-3">
        <nav className="flex items-center gap-0 min-h-[20px] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <motion.div
                  key={`${crumb.label}-${i}`}
                  className="flex items-center gap-0 flex-shrink-0"
                  initial={{ opacity: 0, x: 8, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.95 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                  layout
                >
                  {/* Separator */}
                  {i > 0 && (
                    <ChevronRight className="w-3 h-3 text-muted-foreground/40 mx-1.5 flex-shrink-0" />
                  )}

                  {/* Crumb */}
                  <button
                    onClick={() => navigateTo(i)}
                    className={`
                      flex items-center gap-1.5 text-[12px] relative py-0.5 transition-all duration-500 cursor-pointer
                      ${isLast
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {crumb.icon && <House className="w-3 h-3" />}
                    <span>{crumb.label}</span>
                    {isLast && (
                      <motion.div
                        className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-primary rounded-full"
                        layoutId="breadcrumb-underline"
                        transition={spring}
                      />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>
      </div>

      {/* Depth indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {fullPath.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i < depth ? "bg-primary w-6" : "bg-muted w-3"
              }`}
              animate={{ width: i < depth ? 24 : 12 }}
              transition={spring}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-2">
            Depth {depth}/{fullPath.length}
          </span>
        </div>

        <motion.button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-500 cursor-pointer"
          whileTap={{ scale: 0.97 }}
          onClick={simulateNav}
        >
          <Play className="w-3 h-3" />
          Simulate Navigation
        </motion.button>
      </div>

      {/* Quick nav buttons */}
      <div className="flex flex-wrap gap-1.5">
        {fullPath.map((crumb, i) => (
          <button
            key={crumb.label}
            onClick={() => navigateTo(i)}
            className={`
              px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-500 cursor-pointer
              ${i < depth
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {crumb.label}
          </button>
        ))}
      </div>
    </div>
  );
}
