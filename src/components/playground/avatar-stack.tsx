"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

const users = [
  "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn",
];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = ((hash % 360) + 360) % 360;
  return `hsl(${h}, 55%, 50%)`;
}

function Avatar({
  name,
  index,
  isHovered,
  stackHovered,
  expanded,
}: {
  name: string;
  index: number;
  isHovered: boolean;
  stackHovered: boolean;
  expanded: boolean;
}) {
  const color = hashColor(name);
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{
        marginLeft: expanded ? 0 : index === 0 ? 0 : -8,
        zIndex: isHovered ? 20 : 10 - index,
      }}
      animate={{
        marginLeft: expanded ? 0 : stackHovered ? 4 : index === 0 ? 0 : -8,
        y: isHovered && !expanded ? -4 : 0,
      }}
      transition={spring}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-background transition-all duration-500"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: -4, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={spring}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap z-30"
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AvatarStack() {
  const [expanded, setExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [stackHovered, setStackHovered] = useState(false);

  const visibleUsers = expanded ? users : users.slice(0, 5);
  const remaining = users.length - 5;

  return (
    <div className="py-6 space-y-6">
      {/* Compact stack */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
          Compact Stack
        </p>
        <div
          className="flex items-center"
          onMouseEnter={() => setStackHovered(true)}
          onMouseLeave={() => {
            setStackHovered(false);
            setHoveredIndex(null);
          }}
        >
          {visibleUsers.map((name, i) => (
            <div
              key={name}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Avatar
                name={name}
                index={i}
                isHovered={hoveredIndex === i}
                stackHovered={stackHovered}
                expanded={expanded}
              />
            </div>
          ))}

          {!expanded && (
            <motion.button
              className="ml-1 w-9 h-9 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold flex items-center justify-center cursor-pointer border-2 border-background"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={() => setExpanded(true)}
              style={{ marginLeft: stackHovered ? 4 : -8 }}
            >
              +{remaining}
            </motion.button>
          )}
        </div>
      </div>

      {/* Expanded grid */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
              All Members
            </p>
            <div className="grid grid-cols-4 gap-3">
              {users.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
                    style={{ backgroundColor: hashColor(name) }}
                  >
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{name}</span>
                </motion.div>
              ))}
            </div>
            <motion.button
              className="mt-3 text-[11px] text-primary font-medium cursor-pointer transition-all duration-500 hover:underline"
              onClick={() => setExpanded(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
            >
              Collapse
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
