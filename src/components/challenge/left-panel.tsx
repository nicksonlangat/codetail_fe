"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, StickyNote } from "lucide-react";
import { ProblemDescription } from "./problem-description";
import { NotesEditor } from "./notes-editor";
import type { ChallengeContent } from "@/types";

type Tab = "description" | "notes";

interface ProblemMeta {
  title: string;
  difficulty: string;
  type: string;
  concept: string;
}

interface LeftPanelProps {
  content: ChallengeContent;
  meta: ProblemMeta;
  showHints: boolean;
  onToggleHints: () => void;
  isGenerated?: boolean;
  onEnriched?: (updated: any) => void;
  initialNotes?: string | null;
}

export function LeftPanel({ content, meta, showHints, onToggleHints, isGenerated = false, onEnriched, initialNotes }: LeftPanelProps) {
  const [active, setActive] = useState<Tab>("description");

  const diffColor = meta.difficulty === "easy"
    ? "bg-difficulty-easy/10 text-difficulty-easy"
    : meta.difficulty === "medium"
    ? "bg-difficulty-medium/10 text-difficulty-medium"
    : "bg-difficulty-hard/10 text-difficulty-hard";

  const typeLabel: Record<string, string> = {
    write_code: "Write Code",
    mcq: "Multiple Choice",
    fix_code: "Fix the Code",
    refactor: "Refactor",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 px-5 border-b border-border bg-muted/50 dark:bg-card/50 dark:border-border/40 flex-shrink-0">
        {([
          { id: "description" as Tab, label: "Description", icon: FileText },
          { id: "notes" as Tab, label: "Notes", icon: StickyNote },
        ]).map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium cursor-pointer transition-all duration-500 ${
                isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="left-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {active === "description" && (
          <ProblemDescription content={content} meta={meta} diffColor={diffColor} typeLabel={typeLabel[meta.type] ?? meta.type} showHints={showHints} onToggleHints={onToggleHints} isGenerated={isGenerated} onEnriched={onEnriched} />
        )}
        {active === "notes" && (
          <NotesEditor problemId={content.problemId} initialNotes={initialNotes} />
        )}
      </div>
    </div>
  );
}
