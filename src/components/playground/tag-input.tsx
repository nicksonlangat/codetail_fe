"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };
const MAX_TAGS = 8;

const tagColors = [
  "bg-primary/10 text-primary border-primary/20",
  "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "bg-green-500/10 text-green-600 border-green-500/20",
  "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "bg-amber-500/10 text-amber-700 border-amber-500/20",
];

interface Tag {
  id: number;
  label: string;
  colorIndex: number;
}

export function TagInput() {
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, label: "python", colorIndex: 0 },
    { id: 2, label: "arrays", colorIndex: 1 },
    { id: 3, label: "hash-map", colorIndex: 2 },
  ]);
  const [input, setInput] = useState("");
  const [shakeId, setShakeId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const counterRef = useRef(3);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  }, []);

  const addTag = useCallback(() => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    const existing = tags.find((t) => t.label === trimmed);
    if (existing) {
      setShakeId(existing.id);
      setTimeout(() => setShakeId(null), 500);
      setInput("");
      inputRef.current?.focus();
      return;
    }

    if (tags.length >= MAX_TAGS) {
      showMessage("Maximum 8 tags reached");
      setInput("");
      return;
    }

    const id = ++counterRef.current;
    const colorIndex = id % tagColors.length;
    setTags((prev) => [...prev, { id, label: trimmed, colorIndex }]);
    setInput("");
    inputRef.current?.focus();
  }, [input, tags, showMessage]);

  const removeTag = useCallback((id: number) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1].id);
    }
  };

  return (
    <div className="space-y-3">
      {/* Input area */}
      <div className="bg-card rounded-xl border border-border/50 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {tags.map((tag) => (
              <motion.span
                key={tag.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: shakeId === tag.id ? [0, -4, 4, -4, 4, 0] : 0,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={shakeId === tag.id ? { duration: 0.4 } : spring}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${tagColors[tag.colorIndex]}`}
              >
                {tag.label}
                <button
                  onClick={() => removeTag(tag.id)}
                  className="hover:opacity-70 transition-all duration-500 cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length >= MAX_TAGS ? "Max tags reached" : "Add tag..."}
            disabled={tags.length >= MAX_TAGS}
            className="flex-1 min-w-[100px] bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground/50 outline-none py-0.5"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
          {tags.length}/{MAX_TAGS} tags
        </span>

        <AnimatePresence>
          {message && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={spring}
              className="text-[10px] text-amber-600 font-medium"
            >
              {message}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <p className="text-[10px] text-muted-foreground/50">
        Press <kbd className="px-1 py-0.5 rounded bg-muted text-[9px] font-mono">Enter</kbd> to add
        &middot; <kbd className="px-1 py-0.5 rounded bg-muted text-[9px] font-mono">Backspace</kbd> to remove last
      </p>
    </div>
  );
}
