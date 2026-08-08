"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";

type CodeBlockProps = {
  code: string;
  output?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  language?: string;
  variant?: "vulnerable" | "fixed";
};

type TokenType = "keyword" | "string" | "comment" | "number" | "builtin" | "decorator" | "operator" | "plain";
type Token = { text: string; type: TokenType };
type MultilineState = null | '"""' | "'''";

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
  "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
  "while", "with", "yield",
]);

const BUILTINS = new Set([
  "abs", "all", "any", "bin", "bool", "bytes", "callable", "chr", "classmethod",
  "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter",
  "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "hex", "id",
  "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max", "min",
  "next", "object", "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed",
  "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple",
  "type", "vars", "zip",
]);

const COLORS: Record<TokenType, string> = {
  keyword: "text-brand-syntax-dark-keyword",
  string: "text-brand-syntax-dark-string",
  comment: "text-white/40 italic",
  number: "text-brand-syntax-dark-number",
  builtin: "text-brand-syntax-dark-builtin",
  decorator: "text-brand-syntax-dark-decorator",
  operator: "text-white/60",
  plain: "text-white/85",
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
    if (line[i] === "#" || line.slice(i, i + 2) === "//" || line.slice(i, i + 2) === "--") {
      tokens.push({ text: line.slice(i), type: "comment" });
      return [tokens, null];
    }

    if (line[i] === "@") {
      let j = i + 1;
      while (j < line.length && /[\w.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "decorator" });
      i = j;
      continue;
    }

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

    if (/[0-9]/.test(line[i]) || (line[i] === "." && /[0-9]/.test(line[i + 1] ?? ""))) {
      let j = i;
      while (j < line.length && /[0-9a-fA-FxXoObB_.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "number" });
      i = j;
      continue;
    }

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

const VARIANT_STYLES = {
  vulnerable: {
    border: "border-brand-destructive/30",
    pill: "bg-brand-destructive/15 text-brand-destructive",
    label: "Vulnerable",
  },
  fixed: {
    border: "border-brand-success/30",
    pill: "bg-brand-success/15 text-brand-success",
    label: "Fixed",
  },
} as const;

export function CodeBlock({
  code, output, showLineNumbers = true, highlightLines = [], language = "Python", variant,
}: CodeBlockProps) {
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = tokenize(code);
  const variantStyle = variant ? VARIANT_STYLES[variant] : null;

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`bg-brand-dark-bg border rounded-xl overflow-hidden shadow-lg mb-4 ${variantStyle ? variantStyle.border : "border-white/10"}`}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-brand-dark-surface">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-medium text-white/40">
            {language}
          </span>
          {variantStyle && (
            <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${variantStyle.pill}`}>
              {variantStyle.label}
            </span>
          )}
        </div>
        <button
          onClick={copyCode}
          className="p-1 rounded hover:bg-white/10 transition-all duration-500 cursor-pointer outline-none focus-visible:bg-white/10"
        >
          {copied ? (
            <Check className="size-3.5 text-brand-syntax-dark-string" />
          ) : (
            <Copy className="size-3.5 text-white/50" />
          )}
        </button>
      </div>

      <div className="relative">
        <pre className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
          {tokenizedLines.map((lineTokens, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            return (
              <div
                key={i}
                className={`flex ${isHighlighted ? "bg-white/5 -mx-4 px-4 rounded" : ""}`}
              >
                {showLineNumbers && (
                  <span className="shrink-0 w-8 text-right pr-4 text-white/25 select-none">
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

      {output && (
        <div className="border-t border-white/10">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="w-full px-4 py-2 text-[11px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-500 text-left flex items-center gap-2 cursor-pointer outline-none"
          >
            <span
              className={`size-1.5 rounded-full transition-colors ${showOutput ? "bg-brand-syntax-dark-string" : "bg-white/30"}`}
            />
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
                <div className="px-4 py-3 bg-brand-dark-surface font-mono text-[12px] text-white/70 border-t border-white/10">
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
