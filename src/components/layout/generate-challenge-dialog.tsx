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

interface TopicGroup {
  label: string;
  topics: string[];
}

const topicGroups: Record<string, TopicGroup[]> = {
  python: [
    { label: "Basics", topics: ["Strings", "Numbers", "Booleans", "Lists", "Tuples", "Dicts", "Sets"] },
    { label: "Intermediate", topics: ["List Comprehensions", "Generators", "Iterators", "Decorators", "Context Managers"] },
    { label: "Advanced", topics: ["OOP", "Async", "Metaclasses", "Descriptors"] },
    { label: "Patterns", topics: ["Error Handling", "File I/O", "Recursion", "Sorting", "Searching"] },
  ],
  django: [
    { label: "Models", topics: ["Fields", "Relationships", "Inheritance", "Managers", "QuerySets", "Migrations"] },
    { label: "Views & Routing", topics: ["Function Views", "Class-Based Views", "URLs", "Middleware"] },
    { label: "Forms & Templates", topics: ["Forms", "Validation", "Templates", "Signals"] },
    { label: "REST Framework", topics: ["Serializers", "ViewSets", "Permissions", "Authentication", "Filtering", "Pagination"] },
    { label: "Architecture", topics: ["Service Layer", "Clean Architecture", "Testing", "Admin"] },
  ],
};

interface GenerateChallengeDialogProps {
  open: boolean;
  onClose: () => void;
  pathSlug?: string;
  pathStack?: string;
}

export function GenerateChallengeDialog({ open, onClose, pathSlug, pathStack }: GenerateChallengeDialogProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const isPro = user?.tier === "pro";
  const [stack, setStack] = useState(pathStack || "django");
  const [selectedType, setSelectedType] = useState("write_code");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groups = topicGroups[stack] ?? [];
  const activeGroup = groups.find((g) => g.label === selectedLevel);

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
      const slug = pathSlug || (stack === "django" ? "django-models" : "python-fundamentals");
      const problem = await generatePractice({
        path_slug: slug,
        problem_type: selectedType,
        concept: selectedTopic ?? undefined,
      });
      onClose();
      router.push(`/challenge/${slug}/${problem.id}`);
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-foreground/15 backdrop-blur-[2px]"
            onClick={onClose}
          />

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

              <div className="px-5 pb-5 space-y-4">
                {/* Stack */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Stack</label>
                  <div className="flex gap-2">
                    {stacks.map((s) => (
                      <motion.button key={s.id}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={chipSpring}
                        onClick={() => { setStack(s.id); setSelectedLevel(null); setSelectedTopic(null); }}
                        className={`flex-1 text-[12px] font-medium py-2 rounded-lg cursor-pointer transition-all duration-500 ${
                          stack === s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}>
                        {s.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Type</label>
                  <div className="flex gap-2">
                    {types.map((t) => (
                      <motion.button key={t.id}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={chipSpring}
                        onClick={() => setSelectedType(t.id)}
                        className={`flex-1 text-[12px] font-medium py-2 rounded-lg cursor-pointer transition-all duration-500 ${
                          selectedType === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}>
                        {t.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Level</label>
                  <div className="flex flex-wrap gap-1.5">
                    {groups.map((g) => (
                      <motion.button key={g.label}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={chipSpring}
                        onClick={() => { setSelectedLevel(selectedLevel === g.label ? null : g.label); setSelectedTopic(null); }}
                        className={`text-[11px] font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500 ${
                          selectedLevel === g.label ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}>
                        {g.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Topics — appears when a level is selected */}
                <AnimatePresence mode="wait">
                  {activeGroup && (
                    <motion.div
                      key={activeGroup.label}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
                            Topic <span className="normal-case text-muted-foreground/60">(optional)</span>
                          </label>
                          {selectedTopic && (
                            <button onClick={() => setSelectedTopic(null)}
                              className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeGroup.topics.map((t) => (
                            <motion.button key={t}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              transition={chipSpring}
                              onClick={() => setSelectedTopic(selectedTopic === t ? null : t)}
                              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg cursor-pointer transition-all duration-500 ${
                                selectedTopic === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                              }`}>
                              {t}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-[11px] text-destructive">{error}</motion.p>
                  )}
                </AnimatePresence>

                {/* Generate */}
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={chipSpring}
                  onClick={handleGenerate} disabled={generating}
                  className="w-full flex items-center justify-center gap-2 text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-70 py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors duration-100">
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating challenge...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generate</>
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
