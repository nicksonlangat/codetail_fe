"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Lightbulb, Bot, BookOpen } from "lucide-react";
import type { ChallengeExample } from "@/types";
import { TestCasesPanel, type TestCaseResult } from "./test-cases-panel";

type Tab = "tests" | "hints" | "review" | "solution";

const tabs: { id: Tab; label: string; icon: typeof FlaskConical }[] = [
  { id: "tests", label: "Test Cases", icon: FlaskConical },
  { id: "hints", label: "Hints", icon: Lightbulb },
  { id: "review", label: "AI Review", icon: Bot },
  { id: "solution", label: "Solution", icon: BookOpen },
];

interface BottomPanelProps {
  examples: ChallengeExample[];
  testResults: TestCaseResult[];
  running: boolean;
}

export function BottomPanel({ examples, testResults, running }: BottomPanelProps) {
  const [active, setActive] = useState<Tab>("tests");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 px-2 border-b border-border/40 bg-card/50 flex-shrink-0">
        {tabs.map((tab) => {
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
                  layoutId="bottom-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {active === "tests" && (
          <TestCasesPanel examples={examples} results={testResults} running={running} />
        )}

        {active === "hints" && (
          <div className="p-4 space-y-3">
            <p className="text-[12px] text-muted-foreground">
              Stuck? Click below to get a contextual hint from AI based on your current code.
            </p>
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500">
              <Lightbulb className="w-3 h-3" />
              Get Hint
            </button>
          </div>
        )}

        {active === "review" && (
          <div className="p-4 space-y-3">
            <p className="text-[12px] text-muted-foreground">
              Submit your code first, then get detailed AI feedback on your approach, style, and correctness.
            </p>
            <button className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500">
              <Bot className="w-3 h-3" />
              Request AI Review
            </button>
          </div>
        )}

        {active === "solution" && (
          <div className="p-4 space-y-3">
            <p className="text-[12px] text-muted-foreground">
              Try solving the problem first. The solution will be available after 3 attempts or when you solve it.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40">
              <BookOpen className="w-3 h-3" />
              Locked — solve or attempt 3 times to unlock
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
