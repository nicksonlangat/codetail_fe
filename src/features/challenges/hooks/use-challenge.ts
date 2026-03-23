"use client";

import { useState, useCallback } from "react";
import type { ChallengeContent, Feedback, FeedbackStatus } from "@/types";
import { generateFeedback } from "../services/feedback";

interface UseChallengeParams {
  content: ChallengeContent | undefined;
}

export function useChallenge({ content }: UseChallengeParams) {
  const [code, setCode] = useState(
    content?.starterCode ?? "# Write your solution here\n",
  );
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState(false);

  const challengeType = content?.type ?? "code";

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newCode =
          code.substring(0, start) + "    " + code.substring(end);
        setCode(newCode);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 4;
        });
      }
    },
    [code],
  );

  const handleSubmit = useCallback(() => {
    if (challengeType === "mcq") {
      setMcqSubmitted(true);
      return;
    }
    setFeedbackStatus("evaluating");
    setFeedback(null);
    setTimeout(() => {
      const result = generateFeedback(code, content?.problemId ?? "");
      setFeedback(result);
      setFeedbackStatus(result.status);
    }, 2200);
  }, [challengeType, code, content?.problemId]);

  const handleReset = useCallback(() => {
    setCode(content?.starterCode ?? "# Write your solution here\n");
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
  }, [content?.starterCode]);

  const handleRetake = useCallback(() => {
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
  }, []);

  const resetForNavigation = useCallback(() => {
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
    setShowHints(false);
  }, []);

  const toggleHints = useCallback(() => {
    setShowHints((prev) => !prev);
  }, []);

  const mcqCorrect = content?.correctOptionId === selectedOption;

  return {
    code,
    setCode,
    feedbackStatus,
    feedback,
    showHints,
    toggleHints,
    selectedOption,
    setSelectedOption,
    mcqSubmitted,
    mcqCorrect,
    challengeType,
    handleSubmit,
    handleReset,
    handleRetake,
    handleKeyDown,
    resetForNavigation,
  };
}
