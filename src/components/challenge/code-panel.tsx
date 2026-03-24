"use client";

import { motion } from "framer-motion";
import { Play, Send, RotateCcw, Bug } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { ChallengeType, ChallengeExample } from "@/types";
import { CodeEditor } from "./code-editor";
import { BottomPanel } from "./bottom-panel";
import type { TestCaseResult } from "./test-cases-panel";

interface CodePanelProps {
  code: string;
  onCodeChange: (c: string) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
  examples: ChallengeExample[];
  testResults: TestCaseResult[];
  challengeType: ChallengeType;
}

export function CodePanel({
  code,
  onCodeChange,
  onReset,
  onRun,
  onSubmit,
  running,
  examples,
  testResults,
  challengeType,
}: CodePanelProps) {
  return (
    <ResizablePanelGroup orientation="vertical" className="h-full">
      {/* Top: Editor */}
      <ResizablePanel defaultSize={60} minSize={20}>
        <div className="flex flex-col h-full min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 h-9 border-b border-border/40 bg-card/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">Python</span>
              <span className="text-[10px] text-muted-foreground/40 font-mono">main.py</span>
              {challengeType === "fix-code" && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-destructive/80 bg-destructive/10 px-2 py-0.5 rounded-md">
                  <Bug className="w-3 h-3" />
                  Contains bugs
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={onReset}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500"
                title="Reset code">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onRun} disabled={running}
                className="flex items-center gap-1.5 text-[11px] font-medium text-foreground px-2.5 py-1 rounded-md ring-1 ring-border/60 hover:bg-secondary disabled:opacity-50 cursor-pointer transition-all duration-500">
                <Play className="w-3 h-3" />
                Run
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onSubmit} disabled={running}
                className="flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground px-2.5 py-1 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500">
                <Send className="w-3 h-3" />
                Submit
              </motion.button>
            </div>
          </div>

          <CodeEditor code={code} onChange={onCodeChange} />
        </div>
      </ResizablePanel>

      <ResizableHandle className="h-1 bg-border/40 hover:bg-primary/30 transition-colors cursor-row-resize" />

      {/* Bottom: Test Cases */}
      <ResizablePanel defaultSize={40} minSize={15}>
        <BottomPanel examples={examples} testResults={testResults} running={running} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
