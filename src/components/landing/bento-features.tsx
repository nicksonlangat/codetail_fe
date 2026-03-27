"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Bot, CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

// Syntax highlight colors matching playground code-block
const c = {
  kw: "text-primary",             // keywords: class, def, return, from, import
  cls: "text-[hsl(38_85%_62%)]",  // class/function names (orange)
  str: "text-[hsl(142_60%_55%)]", // strings (green)
  fn: "text-[hsl(217_80%_68%)]",  // builtins/calls (blue)
  param: "text-[hsl(0_68%_70%)]", // params (salmon)
  op: "text-muted-foreground/60", // operators, punctuation
  txt: "text-foreground/70",      // identifiers
  dim: "text-muted-foreground/40", // comments, low emphasis
};

type Token = { text: string; color: string };
type CodeLine = { indent: number; tokens: Token[] };

const FILES: Record<string, CodeLine[]> = {
  "models.py": [
    { indent: 0, tokens: [{ text: "class", color: c.kw }, { text: " Order", color: c.cls }, { text: "(", color: c.op }, { text: "models.Model", color: c.fn }, { text: "):", color: c.op }] },
    { indent: 1, tokens: [{ text: "customer", color: c.txt }, { text: " = ", color: c.op }, { text: "models.ForeignKey", color: c.fn }, { text: "(", color: c.op }, { text: "User", color: c.cls }, { text: ", ", color: c.op }, { text: "on_delete", color: c.param }, { text: "=", color: c.op }, { text: "CASCADE", color: c.cls }, { text: ")", color: c.op }] },
    { indent: 1, tokens: [{ text: "status", color: c.txt }, { text: " = ", color: c.op }, { text: "models.CharField", color: c.fn }, { text: "(", color: c.op }, { text: "choices", color: c.param }, { text: "=", color: c.op }, { text: "Status.choices", color: c.txt }, { text: ")", color: c.op }] },
    { indent: 1, tokens: [{ text: "created_at", color: c.txt }, { text: " = ", color: c.op }, { text: "models.DateTimeField", color: c.fn }, { text: "(", color: c.op }, { text: "auto_now_add", color: c.param }, { text: "=", color: c.op }, { text: "True", color: c.kw }, { text: ")", color: c.op }] },
    { indent: 0, tokens: [] },
    { indent: 1, tokens: [{ text: "@property", color: c.fn }] },
    { indent: 1, tokens: [{ text: "def", color: c.kw }, { text: " total", color: c.cls }, { text: "(", color: c.op }, { text: "self", color: c.param }, { text: "):", color: c.op }] },
    { indent: 2, tokens: [{ text: "return", color: c.kw }, { text: " self.items.", color: c.txt }, { text: "aggregate", color: c.fn }, { text: "(", color: c.op }, { text: "Sum", color: c.fn }, { text: "(", color: c.op }, { text: "F", color: c.fn }, { text: "(", color: c.op }, { text: "'qty'", color: c.str }, { text: ") * ", color: c.op }, { text: "F", color: c.fn }, { text: "(", color: c.op }, { text: "'price'", color: c.str }, { text: ")))", color: c.op }] },
  ],
  "admin.py": [
    { indent: 0, tokens: [{ text: "from", color: c.kw }, { text: " django.contrib ", color: c.txt }, { text: "import", color: c.kw }, { text: " admin", color: c.fn }] },
    { indent: 0, tokens: [{ text: "from", color: c.kw }, { text: " .models ", color: c.txt }, { text: "import", color: c.kw }, { text: " Order", color: c.cls }] },
    { indent: 0, tokens: [] },
    { indent: 0, tokens: [{ text: "@", color: c.op }, { text: "admin.register", color: c.fn }, { text: "(", color: c.op }, { text: "Order", color: c.cls }, { text: ")", color: c.op }] },
    { indent: 0, tokens: [{ text: "class", color: c.kw }, { text: " OrderAdmin", color: c.cls }, { text: "(", color: c.op }, { text: "admin.ModelAdmin", color: c.fn }, { text: "):", color: c.op }] },
    { indent: 1, tokens: [{ text: "list_display", color: c.txt }, { text: " = [", color: c.op }, { text: "'customer'", color: c.str }, { text: ", ", color: c.op }, { text: "'status'", color: c.str }, { text: ", ", color: c.op }, { text: "'created_at'", color: c.str }, { text: "]", color: c.op }] },
    { indent: 1, tokens: [{ text: "list_filter", color: c.txt }, { text: " = [", color: c.op }, { text: "'status'", color: c.str }, { text: "]", color: c.op }] },
    { indent: 1, tokens: [{ text: "search_fields", color: c.txt }, { text: " = [", color: c.op }, { text: "'customer__email'", color: c.str }, { text: "]", color: c.op }] },
  ],
  "tests.py": [
    { indent: 0, tokens: [{ text: "from", color: c.kw }, { text: " django.test ", color: c.txt }, { text: "import", color: c.kw }, { text: " TestCase", color: c.cls }] },
    { indent: 0, tokens: [{ text: "from", color: c.kw }, { text: " .models ", color: c.txt }, { text: "import", color: c.kw }, { text: " Order", color: c.cls }] },
    { indent: 0, tokens: [] },
    { indent: 0, tokens: [{ text: "class", color: c.kw }, { text: " OrderTest", color: c.cls }, { text: "(", color: c.op }, { text: "TestCase", color: c.fn }, { text: "):", color: c.op }] },
    { indent: 1, tokens: [{ text: "def", color: c.kw }, { text: " test_total", color: c.cls }, { text: "(", color: c.op }, { text: "self", color: c.param }, { text: "):", color: c.op }] },
    { indent: 2, tokens: [{ text: "order", color: c.txt }, { text: " = ", color: c.op }, { text: "Order.objects.", color: c.txt }, { text: "create", color: c.fn }, { text: "(", color: c.op }, { text: "customer", color: c.param }, { text: "=", color: c.op }, { text: "self.user", color: c.txt }, { text: ")", color: c.op }] },
    { indent: 2, tokens: [{ text: "self.", color: c.txt }, { text: "assertEqual", color: c.fn }, { text: "(", color: c.op }, { text: "order.total", color: c.txt }, { text: ", ", color: c.op }, { text: "Decimal", color: c.fn }, { text: "(", color: c.op }, { text: "'0'", color: c.str }, { text: "))", color: c.op }] },
    { indent: 0, tokens: [] },
  ],
};

const REVIEW_ITEMS = [
  { good: true, text: "Correct ForeignKey with CASCADE" },
  { good: true, text: "TextChoices for status validation" },
  { good: false, text: "Use DecimalField for money, not Float" },
  { good: true, text: "Clean __str__ method" },
];

const HEATMAP_DATA = Array.from({ length: 77 }, (_, i) => {
  const r = ((i * 7 + 13) % 100) / 100;
  return r < 0.3 ? 0 : r < 0.55 ? 1 : r < 0.75 ? 2 : r < 0.9 ? 3 : 4;
});

export function BentoFeatures() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState("models.py");
  const [codeLine, setCodeLine] = useState<number | null>(null);
  const [streakHover, setStreakHover] = useState<number | null>(null);
  const [heatmapHover, setHeatmapHover] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-6 gap-3 auto-rows-[240px]">

      {/* 1. CODE EDITOR — 4 cols, taller */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        whileHover={{ y: -4 }} transition={spring}
        onHoverStart={() => setHoveredCell("code")} onHoverEnd={() => setHoveredCell(null)}
        className="col-span-4 row-span-1 rounded-xl border border-border bg-card overflow-hidden relative cursor-pointer"
      >
        {/* Glow */}
        <motion.div className="absolute inset-0 bg-primary/[0.02] rounded-xl pointer-events-none"
          animate={{ opacity: hoveredCell === "code" ? 1 : 0 }} />

        <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
          </div>
          <div className="flex gap-0 ml-2">
            {Object.keys(FILES).map((f) => (
              <motion.button key={f}
                onClick={() => setActiveFile(f)}
                whileTap={{ scale: 0.95 }}
                className={`relative text-[10px] px-2.5 py-0.5 font-mono cursor-pointer transition-colors duration-300 ${
                  activeFile === f ? "text-foreground/80" : "text-muted-foreground/30 hover:text-muted-foreground/50"
                }`}>
                {f}
                {activeFile === f && (
                  <motion.div layoutId="bento-file-tab"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeFile}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="px-4 py-2 font-mono text-[11px] leading-[1.9]">
            {(FILES[activeFile] ?? []).map((line, i) => (
              <motion.div key={i}
                className="flex items-center gap-0 rounded px-1 -mx-1 transition-colors duration-300"
                style={{ paddingLeft: `${line.indent * 16 + 4}px` }}
                onHoverStart={() => setCodeLine(i)} onHoverEnd={() => setCodeLine(null)}
                animate={{ backgroundColor: codeLine === i ? "hsl(164 70% 40% / 0.06)" : "transparent" }}
              >
                <span className="text-muted-foreground/20 w-4 text-right mr-3 select-none text-[9px]">{i + 1}</span>
                {line.tokens.length === 0 ? <br /> : line.tokens.map((t, j) => (
                  <span key={j} className={t.color}>{t.text}</span>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Typing cursor */}
        <motion.div className="absolute bottom-[60px] left-[180px] w-[2px] h-4 bg-primary rounded-full"
          animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} />

        {/* Fade overlay so code doesn't collide with label */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card via-card/95 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
          <p className="text-[13px] font-semibold">Not toy examples. Real models.</p>
          <p className="text-[10px] text-muted-foreground">Django, DRF, Python — multi-file editor, runs instantly</p>
        </div>
      </motion.div>

      {/* 2. AI REVIEW — 2 cols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ ...spring, delay: 0.06 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setHoveredCell("review")} onHoverEnd={() => setHoveredCell(null)}
        className="col-span-2 rounded-xl border border-border bg-card p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
      >
        <motion.div className="absolute inset-0 bg-primary/[0.02] rounded-xl pointer-events-none"
          animate={{ opacity: hoveredCell === "review" ? 1 : 0 }} />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <motion.div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }} transition={spring}>
              <Bot className="w-5 h-5 text-primary" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <motion.span className="text-xl font-bold font-mono text-primary"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.8 }}>87</motion.span>
                <span className="text-[10px] text-muted-foreground">/100</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                <motion.div className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }} whileInView={{ width: "87%" }} viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.5 }} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {REVIEW_ITEMS.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-1.5">
                {item.good
                  ? <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" />
                  : <XCircle className="w-3 h-3 text-destructive flex-shrink-0" />}
                <span className="text-[10px] text-muted-foreground truncate">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-[13px] font-semibold">Every submit gets reviewed.</p>
          <p className="text-[10px] text-muted-foreground">AI tells you what&apos;s wrong and why it matters in production</p>
        </div>
      </motion.div>

      {/* 3. STREAK — 2 cols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ ...spring, delay: 0.12 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setHoveredCell("streak")} onHoverEnd={() => setHoveredCell(null)}
        className="col-span-2 rounded-xl border border-border bg-card p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
      >
        <motion.div className="absolute inset-0 bg-primary/[0.02] rounded-xl pointer-events-none"
          animate={{ opacity: hoveredCell === "streak" ? 1 : 0 }} />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <motion.div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"
              animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <Flame className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <motion.span className="text-3xl font-bold font-mono"
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.4 }}>23</motion.span>
              <span className="text-[11px] text-muted-foreground ml-1">day streak</span>
            </div>
          </div>

          <div className="flex items-end gap-1.5">
            {[
              { day: "M", solved: 3, active: true },
              { day: "T", solved: 5, active: true },
              { day: "W", solved: 4, active: true },
              { day: "T", solved: 6, active: true },
              { day: "F", solved: 2, active: true },
              { day: "S", solved: 1, active: false },
              { day: "S", solved: 0, active: false },
            ].map((d, i) => {
              const heights = [16, 20, 18, 22, 14, 8, 0];
              return (
                <div key={i} className="relative flex flex-col items-center gap-1 flex-1"
                  onMouseEnter={() => setStreakHover(i)} onMouseLeave={() => setStreakHover(null)}>
                  <motion.div
                    className={`w-full rounded-sm ${d.active ? "bg-primary/70" : d.solved > 0 ? "bg-primary/25" : "bg-secondary"}`}
                    initial={{ height: 0 }}
                    whileInView={{ height: heights[i] }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{ scaleY: 1.2 }}
                  />
                  <span className="text-[8px] text-muted-foreground/40">{d.day}</span>

                  <AnimatePresence>
                    {streakHover === i && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute z-20 bottom-full mb-2 px-2 py-1 rounded-md bg-foreground text-background text-[9px] font-mono whitespace-nowrap pointer-events-none"
                      >
                        {d.solved} solved
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-foreground" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <p className="text-[13px] font-semibold">Miss a day, feel it.</p>
          <p className="text-[10px] text-muted-foreground">Streaks, freezes, and guilt-free momentum</p>
        </div>
      </motion.div>

      {/* 4. HEATMAP — 2 cols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ ...spring, delay: 0.18 }}
        whileHover={{ y: -4 }}
        className="col-span-2 rounded-xl border border-border bg-card p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
      >
        <div className="flex flex-wrap gap-[3px]">
          {HEATMAP_DATA.map((level, i) => {
            const cls = ["bg-secondary", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary/80"][level];
            const count = [0, 1, 3, 5, 8][level];
            return (
              <div key={i} className="relative"
                onMouseEnter={() => setHeatmapHover(i)} onMouseLeave={() => setHeatmapHover(null)}>
                <motion.div
                  className={`w-[11px] h-[11px] rounded-[2px] ${cls} cursor-pointer`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.008 }}
                  whileHover={{ scale: 1.6 }}
                />
                <AnimatePresence>
                  {heatmapHover === i && count > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-foreground text-background text-[9px] font-mono whitespace-nowrap pointer-events-none"
                    >
                      {count} solved
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div>
          <p className="text-[13px] font-semibold">Your work, visible.</p>
          <p className="text-[10px] text-muted-foreground">12 weeks of effort — every green square earned</p>
        </div>
      </motion.div>

      {/* 5. SPARKLINES — 2 cols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ ...spring, delay: 0.24 }}
        whileHover={{ y: -4 }}
        className="col-span-2 rounded-xl border border-border bg-card p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
      >
        <div className="space-y-3">
          {[
            { label: "Problems Solved", value: "47", data: [2, 4, 3, 7, 5, 8, 6, 9, 7, 11, 10, 12], color: "hsl(164 70% 40%)" },
            { label: "Accuracy", value: "84%", data: [60, 65, 70, 68, 75, 72, 80, 78, 82, 85, 83, 87], color: "hsl(142 60% 50%)" },
          ].map((m) => {
            const min = Math.min(...m.data);
            const max = Math.max(...m.data);
            const points = m.data.map((v, i) => {
              const x = (i / (m.data.length - 1)) * 80;
              const y = 22 - ((v - min) / (max - min || 1)) * 20;
              return `${x},${y}`;
            }).join(" ");
            const gradientPath = `M0,24 ${m.data.map((v, i) => {
              const x = (i / (m.data.length - 1)) * 80;
              const y = 22 - ((v - min) / (max - min || 1)) * 20;
              return `L${x},${y}`;
            }).join(" ")} L80,24 Z`;

            return (
              <div key={m.label} className="flex items-center gap-3 group/spark">
                <div className="flex-1">
                  <p className="text-[9px] text-muted-foreground/50">{m.label}</p>
                  <p className="text-[15px] font-bold font-mono">{m.value}</p>
                </div>
                <svg viewBox="0 0 80 24" className="w-20 h-6">
                  <defs>
                    <linearGradient id={`grad-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={m.color} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={m.color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path d={gradientPath} fill={`url(#grad-${m.label})`}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.6 }} />
                  <motion.polyline fill="none" stroke={m.color} strokeWidth="1.5" strokeLinecap="round"
                    points={points}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.4 }} />
                </svg>
              </div>
            );
          })}
        </div>

        <div>
          <p className="text-[13px] font-semibold">Numbers don&apos;t lie.</p>
          <p className="text-[10px] text-muted-foreground">Watch your accuracy climb week over week</p>
        </div>
      </motion.div>
    </div>
  );
}
