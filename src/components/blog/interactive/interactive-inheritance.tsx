"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ClassNode = {
  name: string;
  parent: string | null;
  attrs: string[];
  methods: string[];
  color: "blue" | "orange" | "purple" | "green";
};

const classes: ClassNode[] = [
  {
    name: "Animal",
    parent: null,
    attrs: ["self.name", "self.sound"],
    methods: ["__init__(name, sound)", "speak()", "__repr__()"],
    color: "blue",
  },
  {
    name: "Dog",
    parent: "Animal",
    attrs: ["self.name", "self.sound", "self.breed"],
    methods: ["__init__(name, breed)", "fetch()"],
    color: "orange",
  },
  {
    name: "Cat",
    parent: "Animal",
    attrs: ["self.name", "self.sound", "self.indoor"],
    methods: ["__init__(name, indoor)", "speak()  ← overrides Animal", "purr()"],
    color: "purple",
  },
  {
    name: "GuideDog",
    parent: "Dog",
    attrs: ["self.name", "self.sound", "self.breed", "self.handler"],
    methods: ["__init__(name, breed, handler)", "guide()"],
    color: "green",
  },
];

const colorCls: Record<string, string> = {
  blue:   "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  orange: "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  purple: "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  green:  "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
};

function getMro(name: string): string[] {
  const chain: string[] = [];
  let current: string | null = name;
  while (current) {
    chain.push(current);
    const node = classes.find(c => c.name === current);
    current = node?.parent ?? null;
  }
  chain.push("object");
  return chain;
}

function getInherited(cls: ClassNode): string[] {
  const inherited: string[] = [];
  let parentName = cls.parent;
  while (parentName) {
    const parent = classes.find(c => c.name === parentName);
    if (!parent) break;
    const overridden = new Set(cls.methods.map(m => m.split("(")[0].trim()));
    for (const m of parent.methods) {
      const mname = m.split("(")[0].split("←")[0].trim();
      if (!overridden.has(mname) && !inherited.some(i => i.startsWith(mname))) {
        inherited.push(`${m}  ← from ${parent.name}`);
      }
    }
    parentName = parent.parent;
  }
  return inherited;
}

export function InteractiveInheritance() {
  const [selected, setSelected] = useState("Dog");

  const cls = classes.find(c => c.name === selected)!;
  const mro = getMro(selected);
  const inherited = getInherited(cls);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="bg-muted/50 px-4 py-2 border-b border-border text-[12px] font-mono text-muted-foreground">
        Inheritance explorer
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {classes.map(c => (
            <motion.button
              key={c.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(c.name)}
              className={`px-3 py-1.5 text-[12px] font-mono rounded-lg border transition-colors cursor-pointer ${
                selected === c.name ? colorCls[c.color] : "border-border bg-muted/30 text-foreground"
              }`}
            >
              {c.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-muted-foreground">MRO:</span>
              {mro.map((name, i) => (
                <span key={name} className="flex items-center gap-1">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    name === selected ? colorCls[cls.color] : "border-border bg-muted/30 text-muted-foreground"
                  }`}>
                    {name}
                  </span>
                  {i < mro.length - 1 && (
                    <span className="text-muted-foreground text-[10px]">→</span>
                  )}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className={`border rounded-lg p-3 ${colorCls[cls.color]}`}>
                <div className="text-[11px] font-semibold font-mono mb-2">
                  class {cls.name}{cls.parent ? `(${cls.parent})` : ""}:
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                  Defined here
                </div>
                <div className="space-y-1">
                  {cls.methods.map(m => (
                    <div key={m} className="text-[11px] font-mono">{m}</div>
                  ))}
                </div>
                {inherited.length > 0 && (
                  <>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-1.5">
                      Inherited
                    </div>
                    <div className="space-y-1">
                      {inherited.map(m => (
                        <div key={m} className="text-[11px] font-mono opacity-70">{m}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="border border-border rounded-lg p-3 bg-muted/10">
                <div className="text-[11px] font-semibold mb-2">Instance attributes</div>
                <div className="space-y-1">
                  {cls.attrs.map(a => (
                    <div key={a} className="text-[11px] font-mono text-muted-foreground">{a}</div>
                  ))}
                </div>
                <div className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
                  {cls.parent
                    ? `super().__init__() called in ${cls.name}.__init__`
                    : "Base class — no super() call needed"}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
