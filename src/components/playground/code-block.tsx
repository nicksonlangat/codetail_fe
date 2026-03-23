"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, Check } from "lucide-react";

const CODE_LINES = [
  "def two_sum(nums, target):",
  "    seen = {}",
  "    for i, num in enumerate(nums):",
  "        complement = target - num",
  "        if complement in seen:",
  "            return [seen[complement], i]",
  "        seen[num] = i",
  "    return []",
];

const LANG = "python";

/* ── Syntax highlighting colors ── */
const colors = {
  keyword: "hsl(164 70% 55%)",       // teal — def, for, if, in, return
  builtin: "hsl(217 80% 68%)",       // blue — enumerate
  string: "hsl(38 85% 62%)",         // orange — strings
  number: "hsl(142 60% 55%)",        // green — numbers
  comment: "hsl(220 9% 46%)",        // gray — comments
  punct: "hsl(220 14% 60%)",         // light gray — brackets, colon
  default: "hsl(220 14% 85%)",       // base text
  param: "hsl(0 68% 70%)",           // salmon — function params
};

type Token = { text: string; color: string };

const KEYWORDS = /\b(def|for|if|in|return|and|or|not|while|else|elif|class|import|from|as|with|try|except|finally|raise|yield|lambda|pass|break|continue|True|False|None)\b/;
const BUILTINS = /\b(enumerate|range|len|print|int|str|list|dict|set|type|map|filter|zip|sorted|reversed|sum|min|max|abs|any|all|isinstance)\b/;
const NUMBERS = /\b\d+\.?\d*\b/;
const STRINGS = /(["'])(?:(?=(\\?))\2.)*?\1/;
const COMMENTS = /#.*/;

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    // Leading whitespace
    const ws = remaining.match(/^(\s+)/);
    if (ws) {
      tokens.push({ text: ws[1], color: colors.default });
      remaining = remaining.slice(ws[1].length);
      continue;
    }

    let matched = false;
    const rules: [RegExp, string][] = [
      [COMMENTS, colors.comment],
      [STRINGS, colors.string],
      [KEYWORDS, colors.keyword],
      [BUILTINS, colors.builtin],
      [NUMBERS, colors.number],
    ];

    for (const [regex, color] of rules) {
      const m = remaining.match(regex);
      if (m && m.index === 0) {
        tokens.push({ text: m[0], color });
        remaining = remaining.slice(m[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Punctuation
      if ("()[]{}:,=+-*/.".includes(remaining[0])) {
        tokens.push({ text: remaining[0], color: colors.punct });
        remaining = remaining.slice(1);
      } else {
        // Identifier or other
        const id = remaining.match(/^[a-zA-Z_]\w*/);
        if (id) {
          tokens.push({ text: id[0], color: colors.default });
          remaining = remaining.slice(id[0].length);
        } else {
          tokens.push({ text: remaining[0], color: colors.default });
          remaining = remaining.slice(1);
        }
      }
    }
  }

  return tokens;
}

export function CodeBlock() {
  const [copied, setCopied] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const highlighted = useMemo(() => CODE_LINES.map(tokenize), []);

  function handleCopy() {
    const text = CODE_LINES.join("\n");
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="py-6 flex justify-center">
      <div className="relative w-full max-w-lg rounded-xl overflow-hidden bg-[hsl(220,16%,9%)] border border-[hsl(220,13%,18%)]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(220,13%,18%)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[hsl(220,9%,46%)]">
            {LANG}
          </span>
          <motion.button
            className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(220,9%,55%)] hover:text-[hsl(220,14%,85%)] hover:bg-[hsl(220,16%,13%)] transition-all duration-500 cursor-pointer"
            onClick={handleCopy}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check className="w-3.5 h-3.5 text-primary" />
                </motion.span>
              ) : (
                <motion.span
                  key="clipboard"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Code area */}
        <div className="px-0 py-3 overflow-x-auto">
          {highlighted.map((tokens, i) => (
            <motion.div
              key={i}
              className="flex cursor-pointer transition-all duration-500"
              style={{
                background: hoveredLine === i ? "hsl(220, 16%, 13%)" : "transparent",
              }}
              onMouseEnter={() => setHoveredLine(i)}
              onMouseLeave={() => setHoveredLine(null)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.15 + i * 0.05,
              }}
            >
              <span className="w-10 shrink-0 text-right pr-4 text-[hsl(220,10%,35%)] text-xs font-mono select-none leading-6">
                {i + 1}
              </span>
              <span className="text-xs font-mono leading-6 pr-4 whitespace-pre">
                {tokens.map((tok, j) => (
                  <span key={j} style={{ color: tok.color }}>{tok.text}</span>
                ))}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
