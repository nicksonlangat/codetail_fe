"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { generatePractice } from "@/lib/api/submissions";

const spring = { type: "spring" as const, stiffness: 500, damping: 35 };
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

const difficultyStyle: Record<string, { base: string; selected: string }> = {
  easy: {
    base: "text-difficulty-easy ring-difficulty-easy/20 bg-difficulty-easy/8",
    selected: "bg-difficulty-easy text-primary-foreground ring-difficulty-easy",
  },
  medium: {
    base: "text-difficulty-medium ring-difficulty-medium/20 bg-difficulty-medium/8",
    selected: "bg-difficulty-medium text-primary-foreground ring-difficulty-medium",
  },
  hard: {
    base: "text-difficulty-hard ring-difficulty-hard/20 bg-difficulty-hard/8",
    selected: "bg-difficulty-hard text-primary-foreground ring-difficulty-hard",
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
      setError(err.response?.data?.detail || "Failed to generate. Are you on Pro?");
    } finally {
      setGenerating(false);
    }
  };

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
                {/* Stack — segmented control with layoutId */}
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Stack</label>
                  <div className="flex gap-2">
                    {stacks.map((s) => (
                      <button key={s.id}
                        onClick={() => { setStack(s.id); setSelectedConcepts([]); }}
                        className="relative flex-1 text-[11px] font-semibold py-2 rounded-lg ring-1 ring-inset cursor-pointer ring-border/50 z-0">
                        {stack === s.id && (
                          <motion.div layoutId="stack-indicator"
                            className="absolute inset-0 bg-foreground rounded-lg"
                            transition={spring} />
                        )}
                        <span className={`relative z-10 ${stack === s.id ? "text-background" : "text-muted-foreground"}`}>
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty — colored segmented control with layoutId */}
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Difficulty</label>
                  <div className="flex gap-2">
                    {difficulties.map((d) => {
                      const isSelected = selectedDifficulty === d;
                      const style = difficultyStyle[d];
                      return (
                        <button key={d}
                          onClick={() => setSelectedDifficulty(d)}
                          className={`relative flex-1 text-[11px] font-semibold py-2 rounded-lg ring-1 ring-inset cursor-pointer z-0 ${style.base}`}>
                          {isSelected && (
                            <motion.div layoutId="difficulty-indicator"
                              className={`absolute inset-0 rounded-lg ${style.selected}`}
                              transition={spring} />
                          )}
                          <span className={`relative z-10 ${isSelected ? "text-primary-foreground" : ""}`}>
                            {d}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Type — segmented control with layoutId */}
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Type</label>
                  <div className="flex gap-2">
                    {types.map((t) => (
                      <button key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className="relative flex-1 text-[11px] font-semibold py-2 rounded-lg ring-1 ring-inset cursor-pointer ring-border/50 z-0">
                        {selectedType === t.id && (
                          <motion.div layoutId="type-indicator"
                            className="absolute inset-0 bg-foreground rounded-lg"
                            transition={spring} />
                        )}
                        <span className={`relative z-10 ${selectedType === t.id ? "text-background" : "text-muted-foreground"}`}>
                          {t.label}
                        </span>
                      </button>
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
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-md ring-1 ring-inset cursor-pointer ${
                              selected
                                ? "bg-foreground text-background ring-foreground"
                                : "text-muted-foreground ring-border/50 hover:ring-border hover:text-foreground"
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
