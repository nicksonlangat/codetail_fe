"use client";

import { motion } from "framer-motion";
import { Send, RotateCw, ChevronRight } from "lucide-react";
import type { ChallengeContent } from "@/types";
import { McqOptions } from "./mcq-options";

interface McqPanelProps {
  content: ChallengeContent | undefined;
  selectedOption: string | null;
  onSelect: (id: string) => void;
  mcqSubmitted: boolean;
  mcqCorrect: boolean;
  handleSubmit: () => void;
  handleRetake: () => void;
  nextProblem: { id: string } | null;
  navigateTo: (id: string) => void;
}

export function McqPanel({
  content,
  selectedOption,
  onSelect,
  mcqSubmitted,
  mcqCorrect,
  handleSubmit,
  handleRetake,
  nextProblem,
  navigateTo,
}: McqPanelProps) {
  return (
    <div className="h-full overflow-y-auto">
      {content?.options && (
        <McqOptions
          options={content.options}
          selectedOption={selectedOption}
          onSelect={onSelect}
          submitted={mcqSubmitted}
          correctOptionId={content.correctOptionId}
          explanation={content.explanation}
        />
      )}
      {!mcqSubmitted && (
        <div className="px-5 pb-5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="flex items-center gap-1.5 text-[12px] font-medium text-primary-foreground px-4 py-2 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-40 transition-all duration-75"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Answer
          </motion.button>
        </div>
      )}
      {mcqSubmitted && (
        <div className="flex items-center gap-2 px-5 pb-5">
          <button
            onClick={handleRetake}
            className="flex items-center gap-1 text-[11px] font-medium text-foreground px-2.5 py-1.5 rounded-md ring-1 ring-border/60 hover:bg-secondary transition-colors duration-75"
          >
            <RotateCw className="w-3 h-3" />
            Try Again
          </button>
          {nextProblem && (
            <button
              onClick={() => navigateTo(nextProblem.id)}
              className="flex items-center gap-1 text-[11px] font-medium text-primary-foreground px-2.5 py-1.5 rounded-md bg-primary hover:bg-primary/90 transition-colors duration-75"
            >
              Next Challenge
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
