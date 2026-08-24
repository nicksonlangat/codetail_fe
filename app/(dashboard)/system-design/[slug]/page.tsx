"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, Crown, Lock, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getChallengeBySlug } from "@/content/system-design-challenges/registry";
import { useAuthStore } from "@/stores/auth-store";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const DIFFICULTY_STYLES = {
  Medium: "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
  Hard: "bg-brand-destructive/10 text-brand-destructive border-brand-destructive/20",
  Expert: "bg-purple-50 text-purple-600 border-purple-200",
};

function Spinner() {
  return (
    <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function SystemDesignChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const challenge = getChallengeBySlug(slug);
  if (!challenge) notFound();

  const user = useAuthStore((s) => s.user);
  const isPaid = user?.tier === "pro" || user?.tier === "premium";

  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(challenge.sections.map((s) => [s.id, ""]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const filledCount = Object.values(answers).filter((v) => v.trim().length > 0).length;
  const allFilled = filledCount === challenge.sections.length;

  async function handleSubmit() {
    if (!isPaid || submitting) return;
    setSubmitting(true);
    // AI review wired up in next iteration
    await new Promise((r) => setTimeout(r, 1500));
    setFeedback({
      architecture: "Your architecture is solid. Consider adding an event bus between the API and dispatcher to decouple them further and allow replay on failure.",
      "data-model": "Good call on Redis for preferences. One gap: how do you handle preference cache invalidation when a user updates their settings mid fan-out?",
      "api-design": "Idempotency keys are the right call. Make sure your POST /notifications endpoint returns a 202 Accepted, not 200 — the notification isn't delivered yet at that point.",
      scaling: "Fan-out-on-write is a good choice here. Watch out for celebrity users with 5M followers — you may want a hybrid approach for outliers.",
      tradeoffs: "Strong reasoning on at-least-once delivery. You could mention how you'd handle the dedup store's growth over time — TTL-based eviction after 24h is a common pattern.",
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      <Link
        href="/system-design"
        className="inline-flex items-center gap-1.5 text-[12px] text-brand-text-muted hover:text-brand-text transition-all duration-500 mb-6 cursor-pointer"
      >
        <ArrowLeft className="size-3.5" />
        All challenges
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-2xl">{challenge.icon}</span>
            <h1 className="text-xl font-bold text-brand-text">{challenge.title}</h1>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[challenge.difficulty]}`}
            >
              {challenge.difficulty}
            </span>
          </div>
          <p className="text-sm text-brand-text-muted">{challenge.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-brand-text-subtle shrink-0">
          <Clock className="size-3.5" />
          ~{challenge.estimatedMinutes} min
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Brief */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
          <div className="rounded-xl border border-brand-border bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-primary mb-3">
              The Brief
            </h2>
            <p className="text-[13px] text-brand-text leading-6">{challenge.brief}</p>
          </div>

          <div className="rounded-xl border border-brand-border bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-3">
              Scale
            </h2>
            <div className="space-y-2">
              {challenge.scale.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] text-brand-text-muted">{s.label}</span>
                  <span className="text-[12px] font-semibold font-mono text-brand-text">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-brand-border bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-3">
              Requirements
            </h2>
            <ul className="space-y-2">
              {challenge.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-[12px] text-brand-text leading-5">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-brand-border bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted mb-3">
              Constraints
            </h2>
            <ul className="space-y-2">
              {challenge.constraints.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-brand-text-subtle shrink-0 mt-1.5" />
                  <span className="text-[12px] text-brand-text-muted leading-5">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Canvas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] text-brand-text-muted">
              {filledCount} of {challenge.sections.length} sections filled
            </p>
            <div className="flex gap-1">
              {challenge.sections.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1 w-8 rounded-full transition-all duration-500 ${
                    answers[s.id]?.trim() ? "bg-brand-primary" : "bg-brand-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {challenge.sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SP, delay: i * 0.06 }}
              className="rounded-xl border border-brand-border bg-white overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-brand-text">
                    {i + 1}. {section.title}
                  </h3>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">{section.prompt}</p>
                </div>
                {answers[section.id]?.trim() && (
                  <CheckCircle2 className="size-4 text-brand-primary shrink-0" />
                )}
              </div>

              <textarea
                value={answers[section.id]}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [section.id]: e.target.value }))
                }
                placeholder={section.placeholder}
                rows={5}
                className="w-full px-5 py-4 text-[13px] text-brand-text leading-6 placeholder:text-brand-text-subtle resize-none outline-none bg-transparent transition-all duration-500 focus:bg-brand-surface/40"
              />

              <AnimatePresence>
                {submitted && feedback[section.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={SP}
                    className="border-t border-brand-primary/20 bg-brand-primary/5 px-5 py-4"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="size-3.5 text-brand-primary shrink-0 mt-0.5" />
                      <p className="text-[12px] text-brand-text leading-5">{feedback[section.id]}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          <div className="pt-2">
            {isPaid ? (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || submitted}
                whileHover={{ scale: submitting || submitted ? 1 : 1.02 }}
                whileTap={{ scale: submitting || submitted ? 1 : 0.98 }}
                transition={SP}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Spinner /> Reviewing your design...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="size-4" /> Review complete
                  </>
                ) : (
                  <>
                    <Send className="size-4" /> Submit for AI review
                  </>
                )}
              </motion.button>
            ) : (
              <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-brand-border bg-brand-surface/50">
                <Lock className="size-4 text-brand-text-subtle shrink-0" />
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-brand-text">AI review is a Pro feature</p>
                  <p className="text-[11px] text-brand-text-muted mt-0.5">
                    Fill in your design free. Upgrade to get feedback on your trade-offs.
                  </p>
                </div>
                <Link
                  href="/billing"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-primary text-white text-[12px] font-semibold cursor-pointer transition-all duration-500 hover:bg-brand-primary-hover shrink-0"
                >
                  <Crown className="size-3.5" /> Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
