"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Check, X, WandSparkles, ChevronDown, ChevronUp } from "lucide-react";
import { createInterviewProblem, type ProblemBrief, type CreateInterviewProblemRequest } from "@/lib/api/interviews";
import { MarkdownContent } from "@/components/ui/markdown-content";

const DIFF_COLORS: Record<string, string> = {
  easy: "text-difficulty-easy",
  medium: "text-difficulty-medium",
  hard: "text-difficulty-hard",
};

const TYPE_LABELS: Record<string, string> = {
  write_code: "Write Code",
  fix_code: "Fix Code",
  refactor: "Refactor",
  mcq: "MCQ",
};

const STARTERS = [
  "One hard Python problem on nested dictionaries",
  "A medium Django views problem and an MCQ on ORM",
  "Two FastAPI problems: one refactor, one write_code",
  "A Python fix_code problem on list comprehensions",
];

type SuggestionSpec = CreateInterviewProblemRequest & { _toolCallId: string };

interface SuggestionCardProps {
  spec: SuggestionSpec;
  status: "pending" | "saving" | "saved" | "rejected";
  onApprove: () => void;
  onReject: () => void;
}

function SuggestionCard({ spec, status, onApprove, onReject }: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border overflow-hidden transition-all duration-300 ${
        status === "saved"
          ? "border-green-500/30 bg-green-500/5 opacity-60"
          : status === "rejected"
          ? "border-border/30 bg-muted/20 opacity-40"
          : "border-border/60 bg-card"
      }`}
    >
      <div className="p-3.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold leading-tight">{spec.title}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {spec.stack}
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {TYPE_LABELS[spec.type] ?? spec.type}
              </span>
              <span className={`text-[10px] font-semibold ${DIFF_COLORS[spec.difficulty] ?? ""}`}>
                {spec.difficulty}
              </span>
              {spec.concept && (
                <span className="text-[10px] text-muted-foreground/60">{spec.concept}</span>
              )}
            </div>
          </div>

          {status === "saved" && <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
          {status === "rejected" && <X className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />}
        </div>

        {/* Expandable preview */}
        {status === "pending" && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-300"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Hide" : "Preview"}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-muted/40 rounded-lg p-2.5 mt-1">
                    <MarkdownContent>{spec.description}</MarkdownContent>
                  </div>

                  {spec.starter_code && (
                    <div className="mt-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Starter code</p>
                      <MarkdownContent>{`\`\`\`python\n${spec.starter_code}\n\`\`\``}</MarkdownContent>
                    </div>
                  )}

                  {spec.test_cases && spec.test_cases.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {spec.test_cases.length} test cases
                      </p>
                      {spec.test_cases.map((tc, i) => (
                        <div key={i} className="font-mono text-[10px] text-muted-foreground/70 bg-muted/30 rounded px-2 py-1">
                          in: {tc.input} → {tc.expected}
                        </div>
                      ))}
                    </div>
                  )}

                  {spec.mcq_options && spec.mcq_options.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Options</p>
                      {spec.mcq_options.map((opt) => (
                        <div key={opt.id} className={`text-[11px] px-2 py-1.5 rounded-lg ${opt.id === spec.correct_answer ? "bg-green-500/10 ring-1 ring-green-500/30 text-green-700 dark:text-green-400" : "bg-muted/30 text-muted-foreground"}`}>
                          <span className="font-semibold mr-1.5">{opt.id}.</span>{opt.label}
                          {opt.code && <MarkdownContent>{`\`\`\`python\n${opt.code}\n\`\`\``}</MarkdownContent>}
                        </div>
                      ))}
                    </div>
                  )}

                  {spec.hints && spec.hints.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Hints</p>
                      {spec.hints.map((h, i) => (
                        <p key={i} className="text-[11px] text-muted-foreground pl-2 border-l-2 border-border">{h}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Action buttons */}
        {status === "pending" && (
          <div className="flex gap-1.5 pt-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-300"
            >
              <Check className="w-3 h-3" /> Add to interview
            </motion.button>
            <button
              onClick={onReject}
              className="px-3 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-destructive ring-1 ring-border/60 hover:ring-destructive/40 cursor-pointer transition-all duration-300"
            >
              Reject
            </button>
          </div>
        )}

        {status === "saving" && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Saving…
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AiProblemPanel({ onProblemAdded }: { onProblemAdded: (p: ProblemBrief) => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [statuses, setStatuses] = useState<Record<string, "pending" | "saving" | "saved" | "rejected">>({});
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleApprove = async (spec: SuggestionSpec) => {
    setStatuses((prev) => ({ ...prev, [spec._toolCallId]: "saving" }));
    try {
      const brief = await createInterviewProblem(spec);
      setStatuses((prev) => ({ ...prev, [spec._toolCallId]: "saved" }));
      onProblemAdded(brief);
    } catch {
      setStatuses((prev) => ({ ...prev, [spec._toolCallId]: "pending" }));
    }
  };

  const handleReject = (toolCallId: string) => {
    setStatuses((prev) => ({ ...prev, [toolCallId]: "rejected" }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <WandSparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-[12px] font-medium">Describe the problems you need</p>
            </div>
            <div className="space-y-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="w-full text-left text-[11px] text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 cursor-pointer transition-all duration-300"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {msg.role === "user" && (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-3 py-2 rounded-xl bg-primary text-primary-foreground text-[12px] leading-relaxed">
                  {msg.parts.filter((p) => p.type === "text").map((p, i) => (
                    <span key={i}>{p.type === "text" ? p.text : ""}</span>
                  ))}
                </div>
              </div>
            )}

            {msg.role === "assistant" && (
              <div className="space-y-2">
                {msg.parts.map((part, i) => {
                  if (part.type === "text" && part.text) {
                    return <MarkdownContent key={i}>{part.text}</MarkdownContent>;
                  }

                  if (part.type === "tool-suggest_problem") {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const inv = part as any;
                    if (inv.state !== "output-available") return null;
                    const spec: SuggestionSpec = { ...(inv.output as CreateInterviewProblemRequest), _toolCallId: inv.toolCallId };
                    const st = statuses[inv.toolCallId] ?? "pending";
                    return (
                      <SuggestionCard
                        key={i}
                        spec={spec}
                        status={st}
                        onApprove={() => handleApprove(spec)}
                        onReject={() => handleReject(inv.toolCallId)}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Generating…</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border/50 flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Describe the problems you need…"
          rows={2}
          className="flex-1 text-[12px] bg-background border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none transition-all duration-300"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 shrink-0"
        >
          {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </motion.button>
      </form>
    </div>
  );
}
