"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  output?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
};

// ── Tokenizer ────────────────────────────────────────────────────────────────

type TokenType = "keyword" | "string" | "comment" | "number" | "builtin" | "decorator" | "operator" | "plain";
type Token = { text: string; type: TokenType };
type MultilineState = null | '"""' | "'''";

const KEYWORDS = new Set(["False","None","True","and","as","assert","async","await","break",
  "class","continue","def","del","elif","else","except","finally","for","from","global",
  "if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try",
  "while","with","yield"]);

const BUILTINS = new Set(["abs","all","any","bin","bool","bytes","callable","chr","classmethod",
  "compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter",
  "float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id",
  "input","int","isinstance","issubclass","iter","len","list","locals","map","max","min",
  "next","object","oct","open","ord","pow","print","property","range","repr","reversed",
  "round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple",
  "type","vars","zip"]);

const COLORS: Record<TokenType, string> = {
  keyword:   "text-violet-600 dark:text-violet-400",
  string:    "text-emerald-600 dark:text-emerald-400",
  comment:   "text-muted-foreground/55 italic",
  number:    "text-orange-500 dark:text-orange-400",
  builtin:   "text-sky-600 dark:text-sky-400",
  decorator: "text-yellow-600 dark:text-yellow-400",
  operator:  "text-foreground/60",
  plain:     "text-foreground/85",
};

function tokenizeLine(line: string, state: MultilineState): [Token[], MultilineState] {
  const tokens: Token[] = [];

  if (state) {
    const closeIdx = line.indexOf(state);
    if (closeIdx === -1) return [[{ text: line || " ", type: "string" }], state];
    tokens.push({ text: line.slice(0, closeIdx + 3), type: "string" });
    const [rest, nextState] = tokenizeLine(line.slice(closeIdx + 3), null);
    return [[...tokens, ...rest], nextState];
  }

  let i = 0;
  while (i < line.length) {
    // Comment
    if (line[i] === "#") {
      tokens.push({ text: line.slice(i), type: "comment" });
      return [tokens, null];
    }

    // Decorator
    if (line[i] === "@") {
      let j = i + 1;
      while (j < line.length && /[\w.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "decorator" });
      i = j;
      continue;
    }

    // String prefix (f, r, b, u, fr, rb, etc.)
    let prefixLen = 0;
    if (/[fFrRbBuU]/.test(line[i])) {
      if (line[i + 1] === '"' || line[i + 1] === "'") prefixLen = 1;
      else if (/[fFrRbB]/.test(line[i + 1]) && (line[i + 2] === '"' || line[i + 2] === "'")) prefixLen = 2;
    }
    const qStart = i + prefixLen;
    if (qStart < line.length && (line[qStart] === '"' || line[qStart] === "'")) {
      const q = line[qStart];
      const isTriple = line.slice(qStart, qStart + 3) === q.repeat(3);
      if (isTriple) {
        const closeIdx = line.indexOf(q.repeat(3), qStart + 3);
        if (closeIdx === -1) {
          tokens.push({ text: line.slice(i), type: "string" });
          return [tokens, q.repeat(3) as MultilineState];
        }
        tokens.push({ text: line.slice(i, closeIdx + 3), type: "string" });
        i = closeIdx + 3;
      } else {
        let j = qStart + 1;
        while (j < line.length) {
          if (line[j] === "\\") { j += 2; continue; }
          if (line[j] === q) { j++; break; }
          j++;
        }
        tokens.push({ text: line.slice(i, j), type: "string" });
        i = j;
      }
      continue;
    }

    // Number
    if (/[0-9]/.test(line[i]) || (line[i] === "." && /[0-9]/.test(line[i + 1] ?? ""))) {
      let j = i;
      while (j < line.length && /[0-9a-fA-FxXoObB_.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "number" });
      i = j;
      continue;
    }

    // Identifier / keyword / builtin
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const word = line.slice(i, j);
      const type: TokenType = KEYWORDS.has(word) ? "keyword" : BUILTINS.has(word) ? "builtin" : "plain";
      tokens.push({ text: word, type });
      i = j;
      continue;
    }

    tokens.push({ text: line[i], type: "operator" });
    i++;
  }

  return [tokens, null];
}

function tokenize(code: string): Token[][] {
  const lines = code.split("\n");
  const result: Token[][] = [];
  let state: MultilineState = null;
  for (const line of lines) {
    const [tokens, nextState] = tokenizeLine(line, state);
    result.push(tokens);
    state = nextState;
  }
  return result;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CodeBlock({ code, output, showLineNumbers = true, highlightLines = [] }: CodeBlockProps) {
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = tokenize(code);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-secondary/30">
        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">
          Python
        </span>
        <button onClick={copyCode} className="p-1 rounded hover:bg-secondary transition-all duration-500 cursor-pointer">
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
          {tokenizedLines.map((lineTokens, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            return (
              <div key={i} className={cn("flex", isHighlighted && "bg-primary/5 -mx-4 px-4 rounded")}>
                {showLineNumbers && (
                  <span className="flex-shrink-0 w-8 text-right pr-4 text-muted-foreground/35 select-none">
                    {lineNum}
                  </span>
                )}
                <span>
                  {lineTokens.map((tok, j) => (
                    <span key={j} className={COLORS[tok.type]}>
                      {tok.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      </div>

      {/* Output toggle */}
      {output && (
        <div className="border-t border-border/60">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="w-full px-4 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-500 text-left flex items-center gap-2 cursor-pointer"
          >
            <span className={cn("w-1.5 h-1.5 rounded-full transition-colors", showOutput ? "bg-green-500" : "bg-muted-foreground/40")} />
            {showOutput ? "Hide output" : "Show output"}
          </button>
          <AnimatePresence>
            {showOutput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-muted/50 font-mono text-[12px] text-muted-foreground border-t border-border/60">
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
