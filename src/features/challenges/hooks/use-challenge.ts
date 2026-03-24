"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChallengeContent, Feedback, FeedbackStatus } from "@/types";
import { generateFeedback } from "../services/feedback";

interface UseChallengeParams {
  content: ChallengeContent | undefined;
}

export function useChallenge({ content }: UseChallengeParams) {
  const [code, setCode] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Set starter code when content loads
  useEffect(() => {
    if (content && !initialized) {
      setCode(content.starterCode || "");
      setInitialized(true);
    }
  }, [content, initialized]);

  const challengeType = content?.type ?? "code";

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
    setCode(content?.starterCode ?? "");
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
    setCode("");
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
    setShowHints(false);
    setInitialized(false);
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
    handleKeyDown: undefined, // Monaco handles its own keyboard
    resetForNavigation,
  };
}
