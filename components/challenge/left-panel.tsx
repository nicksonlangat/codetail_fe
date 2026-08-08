"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, StickyNote } from "lucide-react";
import { NotesEditor } from "@/components/editors/notes-editor";
import { ProblemDescription } from "./problem-description";
import type { ProblemDetail } from "@/lib/api/problems";

const TAB_SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const LEFT_TABS = [
  { id: "description", label: "Description", icon: FileText },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;

type LeftTab = (typeof LEFT_TABS)[number]["id"];

interface LeftPanelProps {
  problem: ProblemDetail;
  notes: string;
  onNotesChange: (html: string) => void;
}

export function LeftPanel({ problem, notes, onNotesChange }: LeftPanelProps) {
  const [tab, setTab] = useState<LeftTab>("description");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-5 h-11 px-6 border-b border-brand-border shrink-0">
        {LEFT_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`relative flex items-center gap-1.5 h-full text-xs font-medium cursor-pointer outline-none transition-all duration-500 ${
              tab === id ? "text-brand-text" : "text-brand-text-muted hover:text-brand-text"
            }`}
          >
            <Icon className="size-3.5" /> {label}
            {tab === id && (
              <motion.span
                layoutId="challenge-left-tab-underline"
                transition={TAB_SPRING}
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "description" && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={TAB_SPRING}
              className="h-full overflow-y-auto"
            >
              <ProblemDescription problem={problem} />
            </motion.div>
          )}

          {tab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={TAB_SPRING}
              className="h-full"
            >
              <NotesEditor content={notes} onChange={onNotesChange} />
            </motion.div>
          )}
        </AnimatePresence>

        {tab === "description" && (
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}
