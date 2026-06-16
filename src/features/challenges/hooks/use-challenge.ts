"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ChallengeContent, Feedback, FeedbackStatus } from "@/types";
import { generateFeedback } from "../services/feedback";
import { saveCode as apiSaveCode } from "@/lib/api/progress";
import { submitMcq } from "@/lib/api/submissions";

const STORAGE_PREFIX = "codetail-code-";

interface UseChallengeParams {
  content: ChallengeContent | undefined;
  savedCode?: string | null;
  initialMcqStatus?: string | undefined; // undefined = still loading
  initialMcqAnswer?: string | null;
  onBadgesEarned?: (badges: string[], xpEarned: number) => void;
}

export function useChallenge({ content, savedCode, initialMcqStatus, initialMcqAnswer, onBadgesEarned }: UseChallengeParams) {
  const [code, setCode] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [mcqWasSolved, setMcqWasSolved] = useState(false);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState<string | null>(null);
  const [mcqExplanation, setMcqExplanation] = useState<string | null>(null);
  const [mcqSubmitting, setMcqSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mcqRestoreRef = useRef(false);

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

  // Restore MCQ state once BOTH progress and content have loaded.
  // progress often resolves before the heavier problem query, so we must wait
  // for content.type too — otherwise the ref locks out the real restore.
  useEffect(() => {
    if (mcqRestoreRef.current) return;
    if (initialMcqStatus === undefined || !content?.type) return; // wait for both
    if (content.type === "mcq" && (initialMcqStatus === "solved" || initialMcqStatus === "attempted")) {
      setMcqSubmitted(true);
      if (initialMcqStatus === "solved") setMcqWasSolved(true);
      if (initialMcqAnswer) setSelectedOption(initialMcqAnswer);
    }
    mcqRestoreRef.current = true;
  }, [initialMcqStatus, content?.type, initialMcqAnswer]);

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
        if (result.correct) onBadgesEarned?.(result.newly_earned_badges ?? [], result.xp_earned ?? 0);
      } catch (err: any) {
        const detail = err?.response?.data?.detail ?? "Could not submit answer. Please try again.";
        toast.error(detail);
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
    setMcqWasSolved(false);
    setMcqCorrectAnswer(null);
    setMcqExplanation(null);
  }, []);

  const resetForNavigation = useCallback(() => {
    setCode("");
    setFeedback(null);
    setFeedbackStatus("idle");
    setSelectedOption(null);
    setMcqSubmitted(false);
    setMcqWasSolved(false);
    setMcqCorrectAnswer(null);
    setMcqExplanation(null);
    setShowHints(false);
    setInitialized(false);
    mcqRestoreRef.current = false;
  }, []);

  const toggleHints = useCallback(() => {
    setShowHints((prev) => !prev);
  }, []);

  const mcqCorrect = mcqWasSolved || (mcqCorrectAnswer ? selectedOption === mcqCorrectAnswer : false);

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
