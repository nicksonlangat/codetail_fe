"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, ClipboardList, Users, Clock, Trash2, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { listInterviews, deleteInterview, updateInterview, type InterviewResponse } from "@/lib/api/interviews";
import { useState } from "react";

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Interviews</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Create assessments, invite candidates, review results.
          </p>
        </div>
        <Link href="/interviews/new">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500"
          >
            <Plus className="w-3.5 h-3.5" />
            New Interview
          </motion.button>
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ClipboardList className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-[14px] font-medium text-foreground">No interviews yet</p>
          <p className="text-[12px] text-muted-foreground mt-1 max-w-xs">
            Create your first interview pack and invite candidates to assess their Python and Django skills.
          </p>
          <Link href="/interviews/new" className="mt-5">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-500"
            >
              <Plus className="w-3.5 h-3.5" />
              Create first interview
            </motion.button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {interviews.map((iv) => (
            <InterviewRow
              key={iv.id}
              iv={iv}
              onDelete={() => setConfirmDelete(iv.id)}
              onToggle={() => toggleMutation.mutate({ id: iv.id, is_active: !iv.is_active })}
            />
          ))}
        </div>
      )}

      {confirmDelete && (
        <DeleteConfirmModal
          onConfirm={() => {
            deleteMutation.mutate(confirmDelete);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function InterviewRow({
  iv,
  onDelete,
  onToggle,
}: {
  iv: InterviewResponse;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border/60 bg-card hover:border-border transition-all duration-500 group"
    >
      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
        <ClipboardList className="w-4 h-4 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-foreground truncate">{iv.title}</p>
          {iv.role && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
              {iv.role}
            </span>
          )}
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
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
            {iv.problem_count} {iv.problem_count === 1 ? "problem" : "problems"}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {iv.time_limit_minutes} min
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500"
          title={iv.is_active ? "Deactivate" : "Activate"}
        >
          {iv.is_active ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4" />}
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-all duration-500"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <Link href={`/interviews/${iv.id}`}>
        <button className="flex items-center gap-1 text-[12px] font-medium px-2.5 py-1.5 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500 shrink-0">
          Manage <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </motion.div>
  );
}

function DeleteConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-card border border-border rounded-2xl p-6 w-80 space-y-4">
        <p className="text-[14px] font-semibold">Delete interview?</p>
        <p className="text-[12px] text-muted-foreground">
          This will permanently delete the interview and all candidate sessions. This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="text-[12px] font-medium px-3 py-1.5 rounded-lg ring-1 ring-border/60 hover:bg-secondary cursor-pointer transition-all duration-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer transition-all duration-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
