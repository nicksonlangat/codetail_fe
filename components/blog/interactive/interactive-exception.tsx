"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

type ExcNode = {
  name: string;
  parent: string | null;
  desc: string;
};

const NODES: ExcNode[] = [
  { name: "BaseException", parent: null, desc: "Root of all exceptions" },
  { name: "Exception", parent: "BaseException", desc: "Base for regular exceptions, this is what you normally catch" },
  { name: "ValueError", parent: "Exception", desc: "Argument has the right type but wrong value" },
  { name: "TypeError", parent: "Exception", desc: "Operation applied to wrong type" },
  { name: "KeyError", parent: "Exception", desc: "Dict key not found" },
  { name: "AttributeError", parent: "Exception", desc: "Attribute does not exist on the object" },
  { name: "RuntimeError", parent: "Exception", desc: "Generic runtime error" },
  { name: "StopIteration", parent: "Exception", desc: "Iterator has no more items" },
  { name: "OSError", parent: "Exception", desc: "OS-level error (also aliased as IOError)" },
  { name: "FileNotFoundError", parent: "OSError", desc: "File or directory not found" },
  { name: "PermissionError", parent: "OSError", desc: "Insufficient permissions" },
  { name: "SystemExit", parent: "BaseException", desc: "Raised by sys.exit(), not caught by except Exception" },
  { name: "KeyboardInterrupt", parent: "BaseException", desc: "User pressed Ctrl-C, not caught by except Exception" },
  { name: "GeneratorExit", parent: "BaseException", desc: "Generator or coroutine is closed" },
];

function getDescendants(name: string): Set<string> {
  const result = new Set<string>([name]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of NODES) {
      if (node.parent && result.has(node.parent) && !result.has(node.name)) {
        result.add(node.name);
        changed = true;
      }
    }
  }
  return result;
}

const TREE_ORDER = [
  "BaseException",
  "Exception",
  "ValueError", "TypeError", "KeyError", "AttributeError",
  "RuntimeError", "StopIteration", "OSError",
  "FileNotFoundError", "PermissionError",
  "SystemExit", "KeyboardInterrupt", "GeneratorExit",
];

function getDepth(name: string): number {
  let depth = 0;
  let current: string | null = name;
  while (current) {
    const parent = NODES.find((n) => n.name === current)?.parent ?? null;
    if (parent) depth++;
    current = parent;
  }
  return depth;
}

export function InteractiveException() {
  const [active, setActive] = useState<string | null>(null);

  const caught = active ? getDescendants(active) : null;
  const activeNode = active ? NODES.find((n) => n.name === active) : null;

  return (
    <div className="bg-white border border-brand-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle">
          Exception Hierarchy
        </span>
        <AnimatePresence>
          {active && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
              onClick={() => setActive(null)}
              className="text-[10px] text-brand-text-muted hover:text-brand-text transition-all duration-500 cursor-pointer outline-none"
            >
              reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[11px] text-brand-text-subtle mb-4">
        Click an exception class to see what{" "}
        <span className="font-mono">except ExcType</span> would catch.
      </p>

      <div className="space-y-1 mb-4">
        {TREE_ORDER.map((name) => {
          const depth = getDepth(name);
          const isCaught = caught ? caught.has(name) : false;
          const isActive = name === active;
          const isDimmed = caught !== null && !isCaught;

          return (
            <motion.button
              key={name}
              onClick={() => setActive(active === name ? null : name)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING}
              animate={{ opacity: isDimmed ? 0.3 : 1 }}
              style={{ paddingLeft: `${depth * 20 + 8}px` }}
              className={`w-full text-left py-1 pr-3 rounded-md text-[12px] font-mono transition-all duration-300 cursor-pointer outline-none flex items-center gap-2 ${
                isActive
                  ? "bg-brand-primary/10 text-brand-primary"
                  : isCaught && caught
                  ? "bg-brand-success/8 text-brand-success"
                  : "text-brand-text/70 hover:text-brand-text hover:bg-brand-surface/50"
              }`}
            >
              {depth > 0 && (
                <span className="text-brand-text-subtle select-none text-[10px]">
                  {"└─"}
                </span>
              )}
              <span>{name}</span>
              {isCaught && caught && !isActive && (
                <span className="ml-auto text-[9px] text-brand-success">caught</span>
              )}
              {isActive && (
                <span className="ml-auto text-[9px] text-brand-primary">selected</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeNode && caught && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-surface/50 rounded-lg p-3">
              <p className="text-[11px] text-brand-text-subtle mb-1.5">{activeNode.desc}</p>
              <code className="text-[11px] font-mono text-brand-primary block">
                except {active}: ...
              </code>
              <p className="text-[10px] text-brand-text-subtle mt-1.5">
                catches {caught.size} exception{caught.size !== 1 ? "s" : ""}:{" "}
                {[...caught].join(", ")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
