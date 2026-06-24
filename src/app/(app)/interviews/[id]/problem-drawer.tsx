"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Copy, Check, ChevronDown, Lightbulb, Code2,
  Wrench, HelpCircle, RefreshCcw, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import python from "highlight.js/lib/languages/python";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";

const lowlight = createLowlight();
lowlight.register("python", python);

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const DRAWER   = { type: "spring" as const, stiffness: 220, damping: 30 };

const diffColor: Record<string, string> = {
  easy:   "bg-green-500/10 text-difficulty-easy   border border-green-500/20",
  medium: "bg-orange-500/10 text-difficulty-medium border border-orange-500/20",
  hard:   "bg-red-500/10   text-difficulty-hard   border border-red-500/20",
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  write_code: { label: "Code",     icon: <Code2      className="w-3 h-3" />, color: "text-blue-500"    },
  fix_code:   { label: "Fix",      icon: <Wrench     className="w-3 h-3" />, color: "text-orange-500"  },
  mcq:        { label: "MCQ",      icon: <HelpCircle className="w-3 h-3" />, color: "text-purple-500"  },
  refactor:   { label: "Refactor", icon: <RefreshCcw className="w-3 h-3" />, color: "text-emerald-500" },
};

interface McqOption  { id: string; label: string; code: string | null; }
interface ProblemFile { name: string; language: string; starter_code: string; }

interface FullProblem {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  stack: string;
  unit: string;
  concept: string;
  description: string;
  function_signature: string | null;
  starter_code: string;
  examples: { input: string; output: string; explanation?: string | null }[];
  hints: string[];
  mcq_options: McqOption[];
  files: ProblemFile[];
}

interface Props {
  problem: FullProblem;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  navigating?: boolean;
  onClose: () => void;
}

function makeCodeDoc(code: string) {
  return {
    type: "doc",
    content: [{ type: "codeBlock", attrs: { language: "python" }, content: [{ type: "text", text: code }] }],
  };
}

function CodeHighlight({ code }: { code: string }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ codeBlock: false }), CodeBlockLowlight.configure({ lowlight })],
    content: makeCodeDoc(code),
    editable: false,
    immediatelyRender: false,
  });
  useEffect(() => { if (editor) editor.commands.setContent(makeCodeDoc(code)); }, [editor, code]);
  if (!editor) return null;
  return <EditorContent editor={editor} />;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <button onClick={copy} className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-300">
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function HintsAccordion({ hints }: { hints: string[] }) {
  const [open, setOpen] = useState(false);
  if (!hints.length) return null;
  return (
    <div className="rounded-md border border-border/50 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-all duration-300 text-left">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="flex-1 text-[12px] font-medium">Hints</span>
        <span className="text-[10px] text-muted-foreground/50 font-mono">{hints.length}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE_OUT }}>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }} className="overflow-hidden">
            <div className="border-t border-border/40 px-4 py-3 space-y-2">
              {hints.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-[10px] font-mono text-amber-500/60 shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="text-[12px] text-foreground/85 leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProblemDrawer({ problem, index, total, onPrev, onNext, navigating, onClose }: Props) {
  const tc = typeConfig[problem.type];
  const [activeFile, setActiveFile] = useState(0);

  useEffect(() => { setActiveFile(0); }, [problem.id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); onPrev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
    if (e.key === "Escape")     { onClose(); }
  }, [onPrev, onNext, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const hasFiles = problem.files?.length > 0;
  const hasMcq   = problem.mcq_options?.length > 0;
  const currentFile = problem.files?.[activeFile];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={DRAWER} onClick={e => e.stopPropagation()}
        className="w-full max-w-[600px] bg-background border-l border-foreground/15 h-full flex flex-col shadow-2xl shadow-black/40">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[28px] font-bold text-muted-foreground/10 tabular-nums leading-none select-none w-8 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              {(problem.stack || problem.unit) && (
                <p className="text-[10px] text-muted-foreground/60 mb-0.5 truncate">
                  {problem.stack && <span className="capitalize">{problem.stack}</span>}
                  {problem.stack && problem.unit && <span className="mx-1">›</span>}
                  {problem.unit && <span>{problem.unit}</span>}
                </p>
              )}
              <p className="text-[14px] font-semibold leading-tight truncate">{problem.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md capitalize ${diffColor[problem.difficulty] ?? "bg-muted text-muted-foreground"}`}>
                  {problem.difficulty}
                </span>
                {tc && <span className={`flex items-center gap-1 text-[10px] font-medium ${tc.color}`}>{tc.icon} {tc.label}</span>}
                {problem.concept && <span className="text-[10px] text-muted-foreground/70">{problem.concept}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-3">
            <motion.button onClick={onPrev} disabled={index === 0 || navigating}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 cursor-pointer transition-all duration-300">
              <ChevronLeft className="w-3.5 h-3.5" />
            </motion.button>
            <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums w-8 text-center select-none">{index + 1}/{total}</span>
            <motion.button onClick={onNext} disabled={index === total - 1 || navigating}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 cursor-pointer transition-all duration-300">
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
            <div className="w-px h-4 bg-border/50 mx-1" />
            <motion.button onClick={onClose}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-all duration-300">
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 space-y-6">

            <div className="text-[13px] text-foreground/90 leading-relaxed">
              <TipTapRenderer content={problem.description} />
            </div>

            {problem.function_signature && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Function Signature</p>
                <div className="font-mono text-[12px] bg-muted border border-border/50 rounded-md p-3.5 overflow-x-auto">
                  <span className="text-primary">def</span>{" "}
                  <span className="text-foreground">{problem.function_signature.replace(/^(def|class)\s+/, "")}</span>
                </div>
              </div>
            )}

            {problem.examples?.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Examples</p>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="rounded-md border border-border/50 bg-muted p-3.5 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">Example {i + 1}</p>
                    <div className="font-mono text-[11px] space-y-0.5 leading-relaxed">
                      <p><span className="text-muted-foreground/80 select-none">Input: </span><span className="text-foreground">{ex.input}</span></p>
                      <p><span className="text-muted-foreground/80 select-none">Output: </span><span className="text-primary font-medium">{ex.output}</span></p>
                    </div>
                    {ex.explanation && <p className="text-[11px] text-foreground/80 leading-relaxed">{ex.explanation}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* MCQ choices */}
            {hasMcq && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Choices</p>
                {problem.mcq_options.map(opt => (
                  <div key={opt.id} className="flex gap-3 rounded-md border border-border/50 p-3.5">
                    <span className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-muted text-muted-foreground/80 select-none mt-0.5">
                      {opt.id.toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-[12px] text-foreground/90 leading-relaxed">{opt.label}</p>
                      {opt.code && (
                        <pre className="font-mono text-[11px] bg-muted border border-border/50 rounded-md px-3 py-2 overflow-x-auto leading-relaxed text-foreground/80 whitespace-pre">
                          {opt.code}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Multi-file (Django) */}
            {hasFiles && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Files</p>
                  {currentFile && <CopyButton text={currentFile.starter_code} />}
                </div>
                <div className="rounded-md border border-border/50 overflow-hidden">
                  <div className="flex border-b border-border/50 bg-muted/40 overflow-x-auto">
                    {problem.files.map((f, i) => (
                      <button key={f.name} onClick={() => setActiveFile(i)}
                        className={`px-3.5 py-2 text-[11px] font-mono shrink-0 cursor-pointer transition-all duration-300 border-b-2 ${
                          activeFile === i ? "text-foreground border-primary" : "text-muted-foreground/70 border-transparent hover:text-foreground"
                        }`}>
                        {f.name}
                      </button>
                    ))}
                  </div>
                  {currentFile && <CodeHighlight code={currentFile.starter_code} />}
                </div>
              </div>
            )}

            {/* Single-file starter code */}
            {!hasFiles && problem.starter_code && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Starter Code</p>
                  <CopyButton text={problem.starter_code} />
                </div>
                <CodeHighlight code={problem.starter_code} />
              </div>
            )}

            <HintsAccordion hints={problem.hints ?? []} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
