"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import Link from "next/link";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

/* ── Syntax highlighting ── */
const colors = {
  keyword: "hsl(164 70% 55%)",
  builtin: "hsl(217 80% 68%)",
  string: "hsl(38 85% 62%)",
  number: "hsl(142 60% 55%)",
  comment: "hsl(220 9% 46%)",
  punct: "hsl(220 14% 50%)",
  default: "hsl(220 14% 75%)",
};

type Token = { text: string; color: string };
const KEYWORDS = /\b(def|for|if|in|return|and|or|not|while|else|elif|class|import|from|as|with|try|except|finally|raise|yield|lambda|pass|break|continue|True|False|None)\b/;
const BUILTINS = /\b(enumerate|range|len|print|int|str|list|dict|set|type|map|filter|zip|sorted|reversed|sum|min|max|abs|any|all|isinstance)\b/;
const NUMBERS = /\b\d+\.?\d*\b/;
const STRINGS = /(["'])(?:(?=(\\?))\2.)*?\1/;
const COMMENTS = /#.*/;

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;
  while (rest.length > 0) {
    const ws = rest.match(/^(\s+)/);
    if (ws) { tokens.push({ text: ws[1], color: colors.default }); rest = rest.slice(ws[1].length); continue; }
    let matched = false;
    for (const [regex, color] of [[COMMENTS, colors.comment], [STRINGS, colors.string], [KEYWORDS, colors.keyword], [BUILTINS, colors.builtin], [NUMBERS, colors.number]] as [RegExp, string][]) {
      const m = rest.match(regex);
      if (m && m.index === 0) { tokens.push({ text: m[0], color }); rest = rest.slice(m[0].length); matched = true; break; }
    }
    if (!matched) {
      if ("()[]{}:,=+-*/.".includes(rest[0])) { tokens.push({ text: rest[0], color: colors.punct }); rest = rest.slice(1); }
      else { const id = rest.match(/^[a-zA-Z_]\w*/); if (id) { tokens.push({ text: id[0], color: colors.default }); rest = rest.slice(id[0].length); } else { tokens.push({ text: rest[0], color: colors.default }); rest = rest.slice(1); } }
    }
  }
  return tokens;
}

/* ── Data ── */
const codeLines = [
  "def two_sum(nums, target):",
  "    seen = {}",
  "    for i, num in enumerate(nums):",
  "        complement = target - num",
  "        if complement in seen:",
  "            return [seen[complement], i]",
  "        seen[num] = i",
  "    return []",
];

const stats = [
  { label: "Problems", value: "150+" },
  { label: "Paths", value: "12" },
  { label: "Stacks", value: "5" },
];

function ShowcasePanel() {
  const highlighted = useMemo(() => codeLines.map(tokenize), []);

  return (
    <div className="hidden lg:flex flex-col justify-between h-full bg-[hsl(220,20%,4%)] text-white p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">codetail</span>
        </div>
        <p className="text-[11px] text-white/40 mt-1">Master the craft of coding</p>
      </div>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="text-[9px] text-white/20 ml-2 font-mono">two_sum.py</span>
            </div>
            {highlighted.map((tokens, i) => (
              <motion.div
                key={i}
                className="flex"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: 0.3 + i * 0.1 }}
              >
                <span className="w-6 text-right text-[10px] text-white/15 font-mono mr-3 select-none leading-5">
                  {i + 1}
                </span>
                <span className="text-[11px] font-mono leading-5 whitespace-pre">
                  {tokens.map((tok, j) => (
                    <span key={j} style={{ color: tok.color }}>{tok.text}</span>
                  ))}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 1.3 }}
          >
            <p className="text-[10px] text-primary/80 font-medium">AI Review</p>
            <p className="text-[10px] text-white/40 mt-0.5">
              Clean O(n) solution using hash map. Good variable naming.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 1.5 + i * 0.1 }}
          >
            <span className="text-[18px] font-bold text-white tabular-nums">{s.value}</span>
            <span className="text-[10px] text-white/30 ml-1">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-[480px] flex-shrink-0">
        <ShowcasePanel />
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        <motion.div
          className="w-full max-w-[440px] px-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
