"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const colors = [
  { name: "Primary", hsl: "164 70% 40%", cls: "bg-primary" },
  { name: "Success", hsl: "142 71% 45%", cls: "bg-green-500" },
  { name: "Warning", hsl: "38 92% 50%", cls: "bg-orange-500" },
  { name: "Destructive", hsl: "0 84% 60%", cls: "bg-red-500" },
  { name: "Info", hsl: "217 91% 60%", cls: "bg-blue-500" },
];

const opacities = [100, 60, 30, 10] as const;

function Swatch({
  color,
  opacity,
}: {
  color: (typeof colors)[number];
  opacity: number;
}) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const value = `hsl(${color.hsl} / ${opacity}%)`;

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const opacitySuffix = opacity < 100 ? `/${opacity}` : "";
  const bgClass = `${color.cls}${opacitySuffix ? `/${opacity}` : ""}`;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.12, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={spring}
        onClick={copy}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="cursor-pointer w-12 h-12 rounded-lg relative overflow-hidden transition-all duration-500"
        style={{
          backgroundColor: `hsl(${color.hsl} / ${opacity / 100})`,
        }}
      >
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={spring}
              className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && !copied && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[9px] font-mono rounded whitespace-nowrap z-10"
          >
            {value}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="space-y-8 py-6">
      {/* Color grid */}
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Brand Colors
        </p>
        <div className="space-y-3">
          {colors.map((color) => (
            <div key={color.name} className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-muted-foreground w-20 shrink-0">
                {color.name}
              </span>
              <div className="flex gap-2">
                {opacities.map((op) => (
                  <Swatch key={`${color.name}-${op}`} color={color} opacity={op} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Surface hierarchy */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Surface Hierarchy
        </p>
        <div className="bg-background border border-border/40 rounded-xl p-4">
          <span className="text-[10px] font-mono text-muted-foreground/50">
            bg-background
          </span>
          <div className="bg-card rounded-lg p-4 mt-2">
            <span className="text-[10px] font-mono text-muted-foreground/50">
              bg-card
            </span>
            <div className="bg-muted rounded-md p-4 mt-2">
              <span className="text-[10px] font-mono text-muted-foreground/50">
                bg-muted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Text color scale */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50">
          Text Scale
        </p>
        <div className="space-y-2">
          <p className="text-sm text-foreground font-medium">
            text-foreground — Primary content
          </p>
          <p className="text-sm text-muted-foreground">
            text-muted-foreground — Secondary content
          </p>
          <p className="text-sm text-muted-foreground/50">
            text-muted-foreground/50 — Tertiary content
          </p>
        </div>
      </div>
    </div>
  );
}
