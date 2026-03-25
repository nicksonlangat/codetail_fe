"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ChallengeContent, Feedback, FeedbackStatus } from "@/types";
import { generateFeedback } from "../services/feedback";
import { saveCode as apiSaveCode } from "@/lib/api/progress";
import { submitMcq } from "@/lib/api/submissions";

const STORAGE_PREFIX = "codetail-code-";

interface UseChallengeParams {
  content: ChallengeContent | undefined;
  savedCode?: string | null;
}

export function useChallenge({ content, savedCode }: UseChallengeParams) {
  const [code, setCode] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState<string | null>(null);
  const [mcqExplanation, setMcqExplanation] = useState<string | null>(null);
  const [mcqSubmitting, setMcqSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const problemId = content?.problemId;
  const storageKey = problemId ? `${STORAGE_PREFIX}${problemId}` : null;

  // Load code: savedCode from API > localStorage > starter code
  useEffect(() => {
    if (!content || initialized) return;

    if (savedCode) {
      setCode(savedCode);
    } else {
      const local = storageKey ? localStorage.getItem(storageKey) : null;
      setCode(local ?? content.starterCode ?? "");
    }
    setInitialized(true);
  }, [content, savedCode, initialized, storageKey]);

  // Auto-save (debounced 1s)
  useEffect(() => {
    if (!problemId || !storageKey || !initialized) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      localStorage.setItem(storageKey, code);
      apiSaveCode(problemId, code).catch(() => {});
    }, 1000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [code, problemId, storageKey, initialized]);

  const challengeType = content?.type ?? "code";

  const handleSubmit = useCallback(async () => {
    if (challengeType === "mcq") {
      if (!selectedOption || !problemId || mcqSubmitting) return;
      setMcqSubmitting(true);
      try {
        const result = await submitMcq(problemId, selectedOption);
        setMcqCorrectAnswer(result.correct_answer);
        setMcqExplanation(result.explanation ?? null);
        setMcqSubmitted(true);
      } catch {
        // Silently fail — user can retry
      } finally {
        setMcqSubmitting(false);
      }
      return;
    }
    setFeedbackStatus("evaluating");
    setFeedback(null);
    setTimeout(() => {
      const result = generateFeedback(code, content?.problemId ?? "");
      setFeedback(result);
      setFeedbackStatus(result.status);
    }, 2200);
  }, [challengeType, code, content?.problemId, selectedOption, problemId, mcqSubmitting]);

  const handleReset = useCallback(() => {
    setCode(content?.starterCode ?? "");
    if (storageKey) localStorage.removeItem(storageKey);
    if (problemId) apiSaveCode(problemId, content?.starterCode ?? "").catch(() => {});
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
  }, [content?.starterCode, storageKey, problemId]);

  const handleRetake = useCallback(() => {
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
    setMcqCorrectAnswer(null);
    setMcqExplanation(null);
  }, []);

  const resetForNavigation = useCallback(() => {
    setCode("");
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
    setMcqCorrectAnswer(null);
    setMcqExplanation(null);
    setShowHints(false);
    setInitialized(false);
  }, []);

  const toggleHints = useCallback(() => {
    setShowHints((prev) => !prev);
  }, []);

  const mcqCorrect = mcqCorrectAnswer ? selectedOption === mcqCorrectAnswer : false;

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
    mcqSubmitting,
    mcqCorrect,
    mcqCorrectAnswer,
    mcqExplanation,
    challengeType,
    handleSubmit,
    handleReset,
    handleRetake,
    handleKeyDown: undefined,
    resetForNavigation,
  };
}
