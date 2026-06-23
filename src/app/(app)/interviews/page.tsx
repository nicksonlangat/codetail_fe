"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Clock, ClipboardList, Trash2,
  ToggleLeft, ToggleRight, ArrowRight, WandSparkles, Users,
} from "lucide-react";
import Link from "next/link";
import {
  listInterviews, deleteInterview, updateInterview,
  type InterviewResponse,
} from "@/lib/api/interviews";
import { useState } from "react";

const SP  = { type: "spring" as const, stiffness: 300, damping: 30 };
const SP2 = { type: "spring" as const, stiffness: 400, damping: 25 };

// Level colour palette — matches the four seeded templates
const LEVEL: Record<string, { accent: string; badge: string; label: string; order: number }> = {
  "Junior Django Developer":    { accent: "#1FAD87", badge: "#1FAD8720", label: "Junior",    order: 0 },
  "Mid-level Django Developer": { accent: "#FBBF24", badge: "#FBBF2420", label: "Mid-level", order: 1 },
  "Senior Django Developer":    { accent: "#F97316", badge: "#F9731620", label: "Senior",    order: 2 },
  "Principal Django Developer": { accent: "#A78BFA", badge: "#A78BFA20", label: "Principal", order: 3 },
};

function lvl(title: string) {
  return LEVEL[title] ?? { accent: "#8C95A3", badge: "#8C95A320", label: "Custom", order: 99 };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function InterviewsPage() {
  const qc = useQueryClient();
  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ["interviews"],
    queryFn: listInterviews,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInterview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["interviews"] }),
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      updateInterview(id, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["interviews"] }),
  });

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const templates = interviews
    .filter((iv) => iv.is_template)
    .sort((a, b) => (lvl(a.title).order) - (lvl(b.title).order));
  const mine = interviews.filter((iv) => !iv.is_template);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="h-7 w-44 rounded-lg bg-muted animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-52 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50">
            Technical hiring
          </p>
          <h1 className="text-2xl font-black tracking-tight">Interviews</h1>
          <p className="text-[13px] text-muted-foreground max-w-sm leading-relaxed">
            Send assessments, track progress, and make faster hiring decisions.
          </p>
        </div>
        <Link href="/interviews/new">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP2}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500"
          >
            <Plus className="w-3.5 h-3.5" />
            New Interview
          </motion.button>
        </Link>
      </div>

      {/* ── Starter Templates ───────────────────────────────────────── */}
      {templates.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <WandSparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">
              Starter templates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((iv, i) => (
              <motion.div
                key={iv.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SP, delay: i * 0.06 }}
              >
                <TemplateCard iv={iv} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── My Interviews ───────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">
            My interviews
          </span>
          {mine.length > 0 && (
            <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground tabular-nums">
              {mine.length}
            </span>
          )}
        </div>

        {mine.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-border/50 text-center">
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center mb-3">
              <ClipboardList className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-[13px] font-semibold">No interviews yet</p>
            <p className="text-[12px] text-muted-foreground mt-1 max-w-xs leading-relaxed">
              Use a starter template above or build a custom pack from scratch.
            </p>
            <Link href="/interviews/new" className="mt-5">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP2}
                className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500"
              >
                <Plus className="w-3.5 h-3.5" />
                Create interview
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {mine.map((iv, i) => (
              <motion.div
                key={iv.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SP, delay: i * 0.04 }}
              >
                <InterviewRow
                  iv={iv}
                  onDelete={() => setConfirmDelete(iv.id)}
                  onToggle={() =>
                    toggleMutation.mutate({ id: iv.id, is_active: !iv.is_active })
                  }
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Delete confirm ──────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmDelete && (
          <DeleteConfirmModal
            onConfirm={() => {
              deleteMutation.mutate(confirmDelete);
              setConfirmDelete(null);
            }}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({ iv }: { iv: InterviewResponse }) {
  const { accent, badge, label } = lvl(iv.title);

  return (
    <Link href={`/interviews/${iv.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={SP}
        className="group relative flex flex-col h-full rounded-xl bg-muted overflow-hidden cursor-pointer transition-all duration-500"
      >
        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Level badge */}
          <span
            className="self-start text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{ background: badge, color: accent }}
          >
            {label}
          </span>

          {/* Title & description */}
          <div className="flex-1 space-y-2">
            <p className="text-[14px] font-bold leading-snug tracking-tight">{iv.title}</p>
            {iv.description && (
              <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-3">
                {iv.description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <ClipboardList className="w-3 h-3" />
                <span className="font-mono tabular-nums">{iv.problem_count}</span> problems
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-mono tabular-nums">{iv.time_limit_minutes}</span>m
              </span>
            </div>
            <ArrowRight
              className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
              style={{ color: accent }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Interview row ─────────────────────────────────────────────────────────────

function InterviewRow({
  iv, onDelete, onToggle,
}: {
  iv: InterviewResponse;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border/60 bg-card hover:border-border transition-all duration-500">
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <ClipboardList className="w-3.5 h-3.5 text-primary" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold truncate">{iv.title}</p>
          <span
            className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              iv.is_active
                ? "bg-green-500/10 text-green-500"
                : "bg-muted text-muted-foreground/50"
            }`}
          >
            {iv.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ClipboardList className="w-3 h-3" />
            <span className="font-mono tabular-nums">{iv.problem_count}</span>{" "}
            {iv.problem_count === 1 ? "problem" : "problems"}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="font-mono tabular-nums">{iv.time_limit_minutes}</span>m
          </span>
        </div>
      </div>

      {/* Actions — reveal on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <motion.button
          whileTap={{ scale: 0.95 }} transition={SP2}
          onClick={onToggle}
          title={iv.is_active ? "Deactivate" : "Activate"}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500"
        >
          {iv.is_active
            ? <ToggleRight className="w-4 h-4 text-primary" />
            : <ToggleLeft className="w-4 h-4" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }} transition={SP2}
          onClick={onDelete}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all duration-500"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Manage */}
      <Link href={`/interviews/${iv.id}`}>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP2}
          className="flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500 shrink-0"
        >
          Manage <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </Link>
    </div>
  );
}

// ── Delete confirm modal ──────────────────────────────────────────────────────

function DeleteConfirmModal({
  onConfirm, onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card border border-border rounded-2xl p-6 w-80 space-y-4"
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={SP}
      >
        <p className="text-[14px] font-semibold">Delete interview?</p>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          This permanently deletes the interview and all candidate sessions. It cannot be undone.
        </p>
        <div className="flex gap-2 justify-end pt-1">
          <motion.button
            whileTap={{ scale: 0.97 }} transition={SP2}
            onClick={onCancel}
            className="text-[12px] font-medium px-3 py-1.5 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }} transition={SP2}
            onClick={onConfirm}
            className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer transition-all duration-500"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
