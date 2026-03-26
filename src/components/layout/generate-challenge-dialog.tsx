"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { generatePractice } from "@/lib/api/submissions";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { useAuthStore } from "@/stores/auth-store";

const chipSpring = { type: "spring" as const, stiffness: 400, damping: 25 };

const stacks = [
  { id: "django", label: "Django" },
  { id: "python", label: "Python" },
];

const types = [
  { id: "write_code", label: "Write Code" },
  { id: "fix_code", label: "Fix Code" },
  { id: "refactor", label: "Refactor" },
];

const difficulties = ["easy", "medium", "hard"] as const;

const difficultyStyle: Record<string, { idle: string; active: string }> = {
  easy: {
    idle: "border-border/40 text-muted-foreground hover:text-foreground",
    active: "text-green-500 border-green-500/30 bg-green-500/5 border-current",
  },
  medium: {
    idle: "border-border/40 text-muted-foreground hover:text-foreground",
    active: "text-orange-500 border-orange-500/30 bg-orange-500/5 border-current",
  },
  hard: {
    idle: "border-border/40 text-muted-foreground hover:text-foreground",
    active: "text-red-500 border-red-500/30 bg-red-500/5 border-current",
  },
};

const concepts: Record<string, string[]> = {
  django: [
    "Models", "Fields", "Relationships", "Managers", "QuerySets",
    "Views", "URLs", "Templates", "Forms", "Middleware", "Signals",
    "Serializers", "ViewSets", "Permissions", "Authentication", "Filtering",
    "Clean Architecture",
  ],
  python: [
    "Functions", "Data Structures", "Comprehensions", "Generators",
    "OOP", "Decorators", "Async", "Error Handling", "File I/O",
  ],
};

interface GenerateChallengeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function GenerateChallengeDialog({ open, onClose }: GenerateChallengeDialogProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const isPro = user?.tier === "pro";
  const [stack, setStack] = useState("django");
  const [selectedType, setSelectedType] = useState("write_code");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleConcept = (concept: string) => {
    setSelectedConcepts((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept]
    );
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const problem = await generatePractice({
        stack,
        difficulty: selectedDifficulty,
        problem_type: selectedType,
        concept: selectedConcepts[0] ?? undefined,
      });
      onClose();
      router.push(`/challenge/practice-${stack}/${problem.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate problem. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (!isPro) {
    return (
      <UpgradeModal
        open={open}
        onClose={onClose}
        trigger="Generate unlimited AI challenges with a Pro subscription."
      />
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-foreground/15 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto bg-card border border-border/60 rounded-xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Generate Challenge</h2>
                </div>
                <button onClick={onClose}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors duration-75">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 pb-5 space-y-5">
                {/* Stack */}
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Stack</label>
                  <div className="flex gap-2">
                    {stacks.map((s) => (
                      <motion.button key={s.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={chipSpring}
                        onClick={() => { setStack(s.id); setSelectedConcepts([]); }}
                        className={`flex-1 text-[12px] font-medium py-2 rounded-lg cursor-pointer transition-all duration-500 ${
                          stack === s.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}>
                        {s.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Difficulty</label>
                  <div className="flex gap-2">
                    {difficulties.map((d) => {
                      const isSelected = selectedDifficulty === d;
                      const style = difficultyStyle[d];
                      return (
                        <motion.button key={d}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={chipSpring}
                          onClick={() => setSelectedDifficulty(d)}
                          className={`flex-1 py-2 rounded-lg border text-[12px] font-medium cursor-pointer transition-all duration-500 ${
                            isSelected ? style.active : style.idle
                          }`}>
                          {d}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Type</label>
                  <div className="flex gap-2">
                    {types.map((t) => (
                      <motion.button key={t.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={chipSpring}
                        onClick={() => setSelectedType(t.id)}
                        className={`flex-1 text-[12px] font-medium py-2 rounded-lg cursor-pointer transition-all duration-500 ${
                          selectedType === t.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}>
                        {t.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Concepts — animated chips with whileHover/whileTap */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
                      Topics <span className="normal-case text-muted-foreground/60">(optional)</span>
                    </label>
                    {selectedConcepts.length > 0 && (
                      <button onClick={() => setSelectedConcepts([])}
                        className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        Clear
                      </button>
                    )}
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.div className="flex flex-wrap gap-1.5" layout>
                      {(concepts[stack] ?? []).map((c) => {
                        const selected = selectedConcepts.includes(c);
                        return (
                          <motion.button key={c}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={chipSpring}
                            onClick={() => toggleConcept(c)}
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-all duration-500 ${
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}>
                            {c}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[11px] text-destructive">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Generate */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={chipSpring}
                  onClick={handleGenerate} disabled={generating}
                  className="w-full flex items-center justify-center gap-2 text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-70 py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors duration-100">
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating challenge...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </motion.button>

                <p className="text-[10px] text-muted-foreground text-center">
                  AI will create a unique problem tailored to your selection
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
