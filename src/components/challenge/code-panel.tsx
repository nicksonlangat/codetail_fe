"use client";

import { motion } from "framer-motion";
import { Send, RotateCcw, ChevronDown, Bug } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { ChallengeType, FeedbackStatus, Feedback } from "@/types";
import { CodeEditor } from "./code-editor";
import { FeedbackPanel } from "./feedback-panel";

interface CodePanelProps {
  code: string;
  onCodeChange: (c: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onReset: () => void;
  onSubmit: () => void;
  feedbackStatus: FeedbackStatus;
  feedback: Feedback | null;
  challengeType: ChallengeType;
}

export function CodePanel({
  code,
  onCodeChange,
  onKeyDown,
  onReset,
  onSubmit,
  feedbackStatus,
  feedback,
  challengeType,
}: CodePanelProps) {
  const lines = code.split("\n");

  return (
    <ResizablePanelGroup orientation="vertical">
      <ResizablePanel defaultSize={70} minSize={30}>
        <div className="flex flex-col h-full min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 h-9 border-b border-border/40 bg-card/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-medium text-foreground bg-secondary px-2.5 py-1 rounded-md">
                Python 3
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </span>
              {challengeType === "fix-code" && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-destructive/80 bg-destructive/10 px-2 py-1 rounded-md">
                  <Bug className="w-3 h-3" />
                  Contains bugs
                </span>
              )}
            </div>
            <button
              onClick={onReset}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-75"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <CodeEditor
            code={code}
            onChange={onCodeChange}
            onKeyDown={onKeyDown}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-3 h-10 border-t border-border/60 bg-card/50 flex-shrink-0">
            <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
              Ln {lines.length}, Col 1
            </span>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onSubmit}
              disabled={feedbackStatus === "evaluating"}
              className="flex items-center gap-1.5 text-[10px] font-medium text-primary-foreground px-3 py-1.5 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all duration-75"
            >
              <Send className="w-3 h-3" />
              {challengeType === "fix-code"
                ? "Submit Fix"
                : "Submit for Review"}
            </motion.button>
          </div>
        </div>
      </ResizablePanel>

      {feedbackStatus !== "idle" && (
        <>
          <ResizableHandle
            withHandle
            className="bg-border/40 hover:bg-primary/20 transition-colors duration-150 data-[resize-handle-active]:bg-primary/30"
          />
          <ResizablePanel defaultSize={30} minSize={10} maxSize={60}>
            <FeedbackPanel feedback={feedback} status={feedbackStatus} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
