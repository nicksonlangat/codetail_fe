"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wand2, Loader2, Terminal, Wrench, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { generatePractice } from "@/lib/api/submissions";
import { getPathUnits } from "@/lib/api/paths";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";
import { useAuthStore } from "@/stores/auth-store";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const stacks = [
  { id: "django", label: "Django" },
  { id: "python", label: "Python" },
];

const types = [
  { id: "write_code", label: "Write",    icon: Terminal,  desc: "Build from scratch" },
  { id: "fix_code",   label: "Debug",    icon: Wrench,    desc: "Find & fix bugs"    },
  { id: "refactor",   label: "Refactor", icon: RefreshCw, desc: "Improve quality"    },
];

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
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugForUnits = pathSlug || (stack === "python" ? "python-fundamentals" : null);

  const { data: units } = useQuery({
    queryKey: ["path-units", slugForUnits],
    queryFn: () => getPathUnits(slugForUnits!),
    enabled: open && !!slugForUnits,
    staleTime: 60_000,
  });

  useEffect(() => { setSelectedUnit(null); }, [stack, pathSlug]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
        unit: selectedUnit ?? undefined,
      });
      onClose();
      router.push(`/challenge/${slug}/${problem.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || "Failed to generate problem. Please try again.");
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
          {/* Overlay — dark, no blur */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/65"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4"
          >
            <div className="w-full max-w-md pointer-events-auto bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">

              {/* Top accent line */}
              <div className="h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Wand2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h2 className="text-[14px] font-semibold text-foreground tracking-tight">Generate Challenge</h2>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 pl-9.5">
                    AI creates a unique problem tailored to your selection.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted cursor-pointer transition-all duration-200 shrink-0 mt-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-px bg-border/60 mx-6" />

              <div className="px-6 py-5 space-y-5">

                {/* Stack */}
                {!pathSlug && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Stack</span>
                    <div className="flex gap-2">
                      {stacks.map((s) => (
                        <motion.button
                          key={s.id}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={spring}
                          onClick={() => setStack(s.id)}
                          className={`flex-1 text-[12px] font-semibold py-2 rounded-lg cursor-pointer transition-all duration-200 border ${
                            stack === s.id
                              ? "bg-primary/8 border-primary/30 text-primary"
                              : "bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {s.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Problem type — icon cards */}
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Problem type</span>
                  <div className="grid grid-cols-3 gap-2">
                    {types.map((t) => {
                      const Icon = t.icon;
                      const active = selectedType === t.id;
                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={spring}
                          onClick={() => setSelectedType(t.id)}
                          className={`flex flex-col items-center gap-2 px-2 py-3.5 rounded-xl cursor-pointer transition-all duration-200 border text-center ${
                            active
                              ? "bg-primary/8 border-primary/30 text-primary"
                              : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <div>
                            <p className={`text-[11px] font-semibold leading-tight ${active ? "text-primary" : ""}`}>
                              {t.label}
                            </p>
                            <p className={`text-[9px] leading-tight mt-0.5 ${active ? "text-primary/60" : "text-muted-foreground/50"}`}>
                              {t.desc}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Unit picker */}
                {units && units.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">Focus unit</span>
                      <span className="text-[10px] text-muted-foreground/30">optional</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                      {units.map((u) => (
                        <motion.button
                          key={u.unit}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
                          onClick={() => setSelectedUnit(selectedUnit === u.unit ? null : u.unit)}
                          className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                            selectedUnit === u.unit
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                          }`}
                        >
                          {u.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="text-[11px] text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={spring}
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-xl shadow-sm cursor-pointer transition-all duration-200"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Crafting your problem…</>
                  ) : (
                    <><Wand2 className="w-4 h-4" /> Generate Challenge</>
                  )}
                </motion.button>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
