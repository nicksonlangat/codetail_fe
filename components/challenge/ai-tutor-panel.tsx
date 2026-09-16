"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, ShieldCheck, ChevronRight, Code2, BookOpen, Lock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { assistTutor } from "@/lib/api/ai-tutor";
import { getErrorMessage } from "@/lib/api/client";
import type { ProblemDetail } from "@/lib/api/problems";

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 28 };
const BTN_SPRING   = { type: "spring" as const, stiffness: 400, damping: 25 };
const SOLUTION_THRESHOLD = 3;

type Message = {
  role: "user" | "assistant";
  text: string;
  mode?: "hint" | "review" | "solution";
};

interface AiTutorPanelProps {
  problem: ProblemDetail;
  attempts: number;
  alreadySolved: boolean;
  getCode: () => string;
}

export function AiTutorPanel({ problem, attempts, alreadySolved, getCode }: AiTutorPanelProps) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I know exactly which problem you are on. Ask me anything about it and I will guide you without handing you the answer.",
    },
  ]);
  const [input, setInput]       = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const textareaRef             = useRef<HTMLTextAreaElement>(null);

  const solutionUnlocked = alreadySolved || attempts >= SOLUTION_THRESHOLD;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 80);
  }, [open]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  async function ask(mode: "hint" | "review" | "solution", message?: string) {
    if (thinking) return;

    const userLabel =
      mode === "review"   ? "Review my code"  :
      mode === "solution" ? "Show me the solution" :
      message ?? "";

    setMessages((prev) => [...prev, { role: "user", text: userLabel, mode }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setThinking(true);

    try {
      const res = await assistTutor(problem.id, {
        mode,
        message: mode === "hint" ? message : undefined,
        code:    mode !== "hint" ? getCode() : undefined,
      });
      setMessages((prev) => [...prev, { role: "assistant", text: res.reply, mode }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: getErrorMessage(err, "Something went wrong. Try again."), mode },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = input.trim();
      if (text) ask("hint", text);
    }
  }

  function sendHint() {
    const text = input.trim();
    if (text) ask("hint", text);
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={PANEL_SPRING}
            className="w-[360px] bg-white border border-brand-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
            style={{ maxHeight: "540px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-brand-border shrink-0">
              <div className="size-6 rounded-lg bg-brand-text flex items-center justify-center shrink-0">
                <Sparkles className="size-3.5 text-white" />
              </div>
              <p className="flex-1 text-[13px] font-semibold text-brand-text">AI Tutor</p>
              <button
                onClick={() => setOpen(false)}
                className="size-6 flex items-center justify-center rounded-lg text-brand-text-muted hover:text-brand-text hover:bg-brand-surface cursor-pointer outline-none transition-all duration-500"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Context strip */}
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-surface border-b border-brand-border shrink-0">
              <ShieldCheck className="size-3 text-brand-primary shrink-0" />
              <div className="flex items-center gap-1 text-[11px] text-brand-text-muted min-w-0">
                <span className="font-medium text-brand-text truncate">{problem.unit.replace(/-/g, " ")}</span>
                <ChevronRight className="size-3 shrink-0" />
                <span className="truncate capitalize">{problem.title}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-brand-text text-white rounded-2xl rounded-br-sm"
                        : "bg-brand-surface text-brand-text rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-brand-surface rounded-2xl rounded-bl-sm px-3 py-3 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-brand-text-subtle animate-bounce [animation-delay:0ms]" />
                    <span className="size-1.5 rounded-full bg-brand-text-subtle animate-bounce [animation-delay:120ms]" />
                    <span className="size-1.5 rounded-full bg-brand-text-subtle animate-bounce [animation-delay:240ms]" />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Action buttons */}
            <div className="px-3 pt-2 pb-1 flex gap-2 shrink-0">
              <button
                onClick={() => ask("review")}
                disabled={thinking}
                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium text-brand-text-muted border border-brand-border rounded-lg py-1.5 cursor-pointer outline-none transition-all duration-500 hover:border-brand-primary/40 hover:text-brand-text hover:bg-brand-surface/50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Code2 className="size-3" />
                Review my code
              </button>
              <button
                onClick={() => solutionUnlocked && ask("solution")}
                disabled={thinking || !solutionUnlocked}
                title={!solutionUnlocked ? `Unlocks after ${SOLUTION_THRESHOLD} attempts (${attempts}/${SOLUTION_THRESHOLD})` : undefined}
                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium text-brand-text-muted border border-brand-border rounded-lg py-1.5 cursor-pointer outline-none transition-all duration-500 hover:border-brand-primary/40 hover:text-brand-text hover:bg-brand-surface/50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {solutionUnlocked ? <BookOpen className="size-3" /> : <Lock className="size-3" />}
                {solutionUnlocked ? "Show solution" : `Solution (${attempts}/${SOLUTION_THRESHOLD})`}
              </button>
            </div>

            {/* Input */}
            <div className="border-t border-brand-border px-3 py-3 flex items-end gap-2 shrink-0">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={onKeyDown}
                placeholder="Ask about this problem..."
                rows={1}
                className="flex-1 resize-none bg-brand-surface rounded-lg px-3 py-2 text-[13px] text-brand-text placeholder:text-brand-text-subtle outline-none focus:bg-white focus:ring-1 focus:ring-brand-primary/30 transition-all duration-500 leading-relaxed"
                style={{ minHeight: "36px", maxHeight: "120px" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={BTN_SPRING}
                onClick={sendHint}
                disabled={!input.trim() || thinking}
                className="size-9 shrink-0 flex items-center justify-center rounded-lg bg-brand-text text-white cursor-pointer outline-none transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-85"
              >
                {thinking ? <Spinner size="xs" className="text-white" /> : <Send className="size-3.5" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={BTN_SPRING}
        onClick={() => setOpen((v) => !v)}
        className="size-11 flex items-center justify-center rounded-xl bg-brand-text text-white shadow-lg cursor-pointer outline-none transition-all duration-500 hover:opacity-85 relative"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.15 }}>
              <X className="size-4" />
            </motion.span>
          ) : (
            <motion.span key="spark" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -45 }} transition={{ duration: 0.15 }}>
              <Sparkles className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-xl ring-2 ring-brand-text/20 animate-ping pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
