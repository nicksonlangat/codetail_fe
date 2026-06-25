"use client";

import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp, UserPlus, Users, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { deleteCandidateResult, type CandidateSession } from "@/lib/api/interviews";
import { SendResultsModal } from "./send-results-modal";
import { RowMenu, formatRelative } from "./row-menu";

const STATUS: Record<string, { pill: string; dot: string; label: string }> = {
  pending:     { pill: "bg-muted text-muted-foreground",     dot: "bg-muted-foreground/40", label: "Pending"     },
  in_progress: { pill: "bg-yellow-500/10 text-yellow-500",   dot: "bg-yellow-500",          label: "In Progress" },
  completed:   { pill: "bg-green-500/10 text-green-500",     dot: "bg-green-500",           label: "Completed"   },
  expired:     { pill: "bg-destructive/10 text-destructive", dot: "bg-destructive",         label: "Expired"     },
};

const AVATAR_COLORS = [
  "bg-rose-500/15 text-rose-400", "bg-primary/15 text-primary",
  "bg-amber-500/15 text-amber-400", "bg-green-500/15 text-green-400",
  "bg-purple-500/15 text-purple-400", "bg-cyan-500/15 text-cyan-400",
];

type SortField = "name" | "score" | "invitedAt";
type SortDir   = "asc" | "desc";

function formatExpiry(d: Date | null, status: string): { label: string; urgent: boolean } | null {
  if (!d || status === "completed" || status === "expired") return null;
  const ms = d.getTime() - Date.now();
  if (ms < 0) return null;
  const h = Math.floor(ms / 3_600_000);
  const urgent = h < 24;
  const label = h < 1 ? "< 1h left" : h < 24 ? `${h}h left` : `${Math.floor(h / 24)}d left`;
  return { label, urgent };
}

interface Row {
  session: CandidateSession;
  id: string; name: string; email: string; status: string;
  score: number | null; submitted: number; total: number; timeMin: number;
  invitedLabel: string; invitedTs: number;
  expiry: { label: string; urgent: boolean } | null;
}

function EmptyState({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-md border border-dashed border-border/50 text-center gap-3">
      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
        <Users className="w-4 h-4 text-muted-foreground/40" />
      </div>
      <div className="space-y-1">
        <p className="text-[13px] font-semibold">No candidates yet</p>
        <p className="text-[12px] text-muted-foreground max-w-xs leading-relaxed">
          Send your first assessment link and track results here.
        </p>
      </div>
      <button onClick={onInvite}
        className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-300">
        <UserPlus className="w-3.5 h-3.5" /> Invite Candidate
      </button>
    </div>
  );
}

interface Props {
  sessions: CandidateSession[];
  totalProblems: number;
  interviewId: string;
  onSelect: (s: CandidateSession) => void;
  onInvite: () => void;
  onChanged: () => void;
}

export function CandidatesTable({ sessions, totalProblems, interviewId, onSelect, onInvite, onChanged }: Props) {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField]       = useState<SortField>("invitedAt");
  const [sortDir, setSortDir]           = useState<SortDir>("desc");
  const [sendResultsSession, setSendResultsSession] = useState<CandidateSession | null>(null);

  const removeMutation = useMutation({
    mutationFn: (sessionId: string) => deleteCandidateResult(interviewId, sessionId),
    onSuccess: () => { onChanged(); toast.success("Candidate removed"); },
    onError: () => toast.error("Failed to remove candidate"),
  });

  const rows: Row[] = useMemo(() => sessions.map(s => ({
    session: s,
    id: s.id,
    name:  s.candidate_name || s.candidate_email,
    email: s.candidate_email,
    status: s.status,
    score: s.status === "completed" ? s.overall_score : null,
    submitted: s.submissions.length,
    total: totalProblems,
    timeMin: Math.round(s.submissions.reduce((a, sub) => a + sub.time_spent_seconds, 0) / 60),
    invitedLabel: formatRelative(new Date(s.created_at)),
    invitedTs: new Date(s.created_at).getTime(),
    expiry: formatExpiry(s.expires_at ? new Date(s.expires_at) : null, s.status),
  })), [sessions, totalProblems]);

  const avgScore = useMemo(() => {
    const scored = rows.filter(r => r.score !== null);
    return scored.length ? Math.round(scored.reduce((a, r) => a + r.score!, 0) / scored.length) : null;
  }, [rows]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: rows.length };
    rows.forEach(r => { c[r.status] = (c[r.status] ?? 0) + 1; });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    let r = rows;
    if (search) r = r.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "All") r = r.filter(c => c.status === statusFilter.toLowerCase().replace(/ /g, "_"));
    return [...r].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name")      cmp = a.name.localeCompare(b.name);
      if (sortField === "score")     cmp = (a.score ?? -1) - (b.score ?? -1);
      if (sortField === "invitedAt") cmp = a.invitedTs - b.invitedTs;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, search, statusFilter, sortField, sortDir]);

  if (sessions.length === 0) return <EmptyState onInvite={onInvite} />;

  function toggleSort(f: SortField) {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronDown className="size-3 text-muted-foreground/20" />;
    return sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />;
  }

  const STATUS_FILTERS = [
    { key: "All", label: "All" },
    { key: "in_progress", label: "In Progress" },
    { key: "pending",     label: "Pending"     },
    { key: "completed",   label: "Completed"   },
    { key: "expired",     label: "Expired"     },
  ];

  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="size-3.5 absolute left-3 top-2.5 text-muted-foreground/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates…"
            className="w-full py-2 pl-9 pr-8 rounded-md bg-muted text-[13px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-300" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-muted-foreground/50 hover:text-muted-foreground cursor-pointer">
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <button onClick={onInvite}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-all duration-300">
          <UserPlus className="size-3.5" /> Invite
        </button>
      </div>

      {/* Status filter — always visible */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_FILTERS.map(({ key, label }) => {
          const count = counts[key] ?? 0;
          const active = statusFilter === key;
          return (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-all duration-200 ${
                active ? "bg-primary/10 text-primary ring-1 ring-primary/25" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {label}
              {count > 0 && (
                <span className={`text-[10px] font-mono tabular-nums ${active ? "text-primary/70" : "text-muted-foreground/50"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
        {avgScore !== null && (
          <span className="ml-auto text-[11px] text-muted-foreground/50 font-mono tabular-nums">
            avg {avgScore}%
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-border/50">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border/50 bg-muted/40">
              <th onClick={() => toggleSort("name")} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                <span className="inline-flex items-center gap-1">Candidate <SortIcon field="name" /></span>
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Status</th>
              <th onClick={() => toggleSort("score")} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                <span className="inline-flex items-center gap-1">
                  Score {avgScore !== null && <span className="normal-case tracking-normal font-normal opacity-50">/ avg {avgScore}%</span>}
                  <SortIcon field="score" />
                </span>
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Submitted</th>
              <th className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Time</th>
              <th onClick={() => toggleSort("invitedAt")} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-wider font-semibold text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                <span className="inline-flex items-center gap-1">Invited <SortIcon field="invitedAt" /></span>
              </th>
              <th className="px-3 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-[12px] text-muted-foreground">No candidates match your filter</td></tr>
            ) : filtered.map((row, i) => {
              const st = STATUS[row.status] ?? STATUS.pending;
              const initials = row.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
              const isInProgress = row.status === "in_progress";
              const scoreColor = row.score == null ? "" :
                row.score >= 90 ? "text-green-500" :
                row.score >= 70 ? "text-primary" :
                row.score >= 50 ? "text-yellow-500" : "text-destructive";
              const aboveAvg = avgScore !== null && row.score !== null && row.score > avgScore;

              return (
                <tr key={row.id} onClick={() => onSelect(row.session)}
                  className={`border-b border-border/30 cursor-pointer transition-all duration-150 group ${
                    isInProgress ? "bg-yellow-500/[0.03] hover:bg-yellow-500/[0.06]" :
                    row.status === "expired" ? "opacity-60 hover:opacity-80 hover:bg-muted/30" :
                    "hover:bg-muted/40"
                  }`}>
                  {/* In-progress accent bar */}
                  <td className="px-4 py-3 relative">
                    {isInProgress && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-yellow-500" />
                    )}
                    <div className="flex items-center gap-2.5">
                      <div className={`size-7 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[12px] truncate group-hover:text-primary transition-colors duration-150">{row.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md ${st.pill}`}>
                      <span className={`size-1.5 rounded-full ${isInProgress ? "animate-pulse" : ""} ${st.dot}`} />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {row.score != null ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[13px] font-bold tabular-nums ${scoreColor}`}>{row.score}%</span>
                        {aboveAvg && <span className="text-[9px] text-green-500 font-medium">↑ avg</span>}
                        {avgScore !== null && row.score !== null && row.score < avgScore && (
                          <span className="text-[9px] text-muted-foreground/50 font-medium">↓ avg</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-muted-foreground">
                    {row.submitted > 0 ? `${row.submitted}/${row.total}` : <span className="text-muted-foreground/30">—</span>}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-muted-foreground">
                    {row.timeMin > 0 ? `${row.timeMin}m` : <span className="text-muted-foreground/30">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-muted-foreground">{row.invitedLabel}</p>
                    {row.expiry && (
                      <p className={`flex items-center gap-1 text-[10px] font-medium mt-0.5 ${row.expiry.urgent ? "text-destructive" : "text-muted-foreground/50"}`}>
                        {row.expiry.urgent && <AlertTriangle className="size-2.5" />}
                        {row.expiry.label}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <RowMenu
                      canSendResults={row.status === "completed"}
                      sentAt={row.session.results_sent_at}
                      removing={removeMutation.isPending && removeMutation.variables === row.id}
                      onRemove={() => removeMutation.mutate(row.id)}
                      onSendResults={() => setSendResultsSession(row.session)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {sendResultsSession && (
          <SendResultsModal
            session={sendResultsSession}
            interviewId={interviewId}
            onClose={() => setSendResultsSession(null)}
            onSent={onChanged}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
