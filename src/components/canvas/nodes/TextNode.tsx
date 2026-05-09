"use client";
import { useState, useRef, useEffect } from "react";
import type { NodeProps } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextNode({ id, data, selected }: NodeProps) {
  const d = data as { text?: string };
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(d.text ?? "Note...");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    updateNodeData(id, { text: value });
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onDoubleClick={() => setEditing(true)}
      className={cn(
        "min-w-[140px] max-w-[240px] rounded-xl border bg-yellow-500/5 px-3 py-2.5 shadow-sm cursor-pointer",
        selected ? "border-yellow-400/60" : "border-yellow-400/20"
      )}
    >
      {editing ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Escape" && commit()}
          className="w-full resize-none bg-transparent text-[11px] leading-relaxed text-foreground outline-none"
          rows={3}
        />
      ) : (
        <p className="text-[11px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
          {value || "Double-click to edit"}
        </p>
      )}
    </motion.div>
  );
}
