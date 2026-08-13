"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  WandSparkles, Building2, Briefcase, Download, Trash2,
  ArrowRight, TrendingUp, CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  tailorResume, listTailoredResumes, deleteTailoredResume,
  type TailoredResume,
} from "@/lib/api/resume";
import apiClient from "@/lib/api/client";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };

function ScorePill({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80 ? "text-brand-success bg-brand-success/10 border-brand-success/20" :
    score >= 60 ? "text-brand-warning bg-brand-warning/10 border-brand-warning/20" :
                  "text-brand-destructive bg-brand-destructive/10 border-brand-destructive/20";
  return (
    <div className={`flex flex-col items-center px-4 py-3 rounded-xl border ${color}`}>
      <span className="text-2xl font-bold font-mono">{score}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide mt-0.5 opacity-70">{label}</span>
    </div>
  );
}

function ScoreDelta({ before, after }: { before: number; after: number }) {
  const delta = after - before;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING}
      className="flex items-center gap-4"
    >
      <ScorePill score={before} label="Before" />
      <div className="flex flex-col items-center gap-1">
        <ArrowRight className="size-4 text-brand-text-subtle" />
        {delta > 0 && (
          <span className="text-[10px] font-semibold text-brand-success">+{delta} pts</span>
        )}
      </div>
      <ScorePill score={after} label="After" />
    </motion.div>
  );
}

function TailoredCard({
  item,
  onDelete,
  expanded,
  onToggle,
}: {
  item: TailoredResume;
  onDelete: () => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const delta = item.ats_score_after - item.ats_score_before;

  async function handleDownload() {
    try {
      const res = await apiClient.get(`/resume/tailored/${item.id}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.company}_${item.job_title}.pdf`.replace(/\s+/g, "_");
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={ENTRANCE}
      className="border border-brand-border rounded-xl overflow-hidden bg-white"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-brand-surface transition-all duration-300"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="size-4 text-brand-primary" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[13px] font-semibold text-brand-text truncate">{item.job_title}</p>
            <p className="text-[11px] text-brand-text-muted truncate">{item.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {delta > 0 && (
            <span className="text-[11px] font-semibold text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full">
              +{delta} ATS
            </span>
          )}
          <span className="text-[10px] text-brand-text-subtle">
            {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          {expanded ? (
            <ChevronUp className="size-3.5 text-brand-text-subtle" />
          ) : (
            <ChevronDown className="size-3.5 text-brand-text-subtle" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-brand-border pt-4 space-y-4">
              <ScoreDelta before={item.ats_score_before} after={item.ats_score_after} />

              {item.changes.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-wide mb-2">
                    What changed
                  </p>
                  <ul className="space-y-1.5">
                    {item.changes.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-brand-success shrink-0 mt-0.5" />
                        <span className="text-[12px] text-brand-text">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING}
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-primary text-white text-[12px] font-semibold cursor-pointer transition-all duration-300 hover:bg-brand-primary-hover"
                >
                  <Download className="size-3.5" />
                  Download PDF
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING}
                  onClick={onDelete}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border text-brand-text-muted text-[12px] font-medium cursor-pointer transition-all duration-300 hover:border-brand-destructive hover:text-brand-destructive"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function TailorTab() {
  const [jd, setJd] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: tailored = [], isLoading: listLoading } = useQuery({
    queryKey: ["tailored-resumes"],
    queryFn: listTailoredResumes,
  });

  const tailorMutation = useMutation({
    mutationFn: () => tailorResume(jd),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tailored-resumes"] });
      setJd("");
      setExpandedId(result.id);
      toast.success(`Tailored for ${result.company} — ATS score up ${result.ats_score_after - result.ats_score_before} points`);
    },
    onError: () => toast.error("Tailoring failed. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTailoredResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tailored-resumes"] });
      toast.success("Deleted");
    },
  });

  const canSubmit = jd.trim().length >= 50 && !tailorMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
      {/* Left — JD input */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <WandSparkles className="size-4 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-brand-text">Tailor to a job</h3>
            <p className="text-[12px] text-brand-text-muted mt-0.5">
              Paste any job description. AI rewrites your resume to match the role and beat ATS filters.
            </p>
          </div>
        </div>

        <div className="relative flex-1">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder={`Paste the full job description here…\n\nExample:\n  We're looking for a Senior Backend Engineer with 5+ years in Python, strong knowledge of distributed systems, experience with Kubernetes…`}
            className="w-full h-72 lg:h-full min-h-60 resize-none rounded-xl border border-brand-border bg-brand-surface px-4 py-3.5 text-[13px] text-brand-text placeholder:text-brand-text-subtle leading-relaxed outline-none transition-all duration-300 focus:bg-white focus:border-brand-primary/60"
          />
          <div className="absolute bottom-3 right-3 text-[10px] text-brand-text-subtle font-mono">
            {jd.length} chars
          </div>
        </div>

        <motion.button
          whileHover={canSubmit ? { y: -1 } : {}}
          whileTap={canSubmit ? { scale: 0.985 } : {}}
          transition={SPRING}
          onClick={() => tailorMutation.mutate()}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-brand-primary text-white text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:bg-brand-primary-hover disabled:opacity-40 disabled:cursor-default shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
        >
          {tailorMutation.isPending ? (
            <>
              <Spinner size="sm" /> Tailoring your resume…
            </>
          ) : (
            <>
              <WandSparkles className="size-3.5" />
              Tailor my resume
              <TrendingUp className="size-3.5 opacity-70" />
            </>
          )}
        </motion.button>

        {tailorMutation.isPending && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] text-brand-text-subtle text-center"
          >
            Reading the job description and rewriting your bullets. This takes ~15 seconds.
          </motion.p>
        )}
      </div>

      {/* Right — history */}
      <div className="lg:col-span-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="size-3.5 text-brand-text-subtle" />
            <span className="text-[12px] font-semibold text-brand-text-muted uppercase tracking-wide">
              Saved versions
            </span>
          </div>
          {tailored.length > 0 && (
            <span className="text-[11px] text-brand-text-subtle bg-brand-surface px-2 py-0.5 rounded-full border border-brand-border">
              {tailored.length}
            </span>
          )}
        </div>

        {listLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-brand-surface animate-pulse" />
            ))}
          </div>
        ) : tailored.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center mb-3">
              <Briefcase className="size-5 text-brand-text-subtle" />
            </div>
            <p className="text-[13px] font-medium text-brand-text">No tailored resumes yet</p>
            <p className="text-[11px] text-brand-text-subtle mt-1">
              Paste a JD and tailor your first version
            </p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-[520px] pr-0.5">
            <AnimatePresence>
              {tailored.map((item) => (
                <TailoredCard
                  key={item.id}
                  item={item}
                  expanded={expandedId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  onDelete={() => deleteMutation.mutate(item.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
