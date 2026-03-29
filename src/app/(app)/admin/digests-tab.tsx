"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Send } from "lucide-react";
import { getAdminDigests, triggerDailyDigest, type AdminDigest } from "@/lib/api/admin";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function DigestsTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: digestList } = useQuery({
    queryKey: ["admin-digests", search, page],
    queryFn: () => getAdminDigests(search || undefined, page),
  });

  const digestMutation = useMutation({
    mutationFn: triggerDailyDigest,
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h2 className="text-[13px] font-semibold flex-1">Digest History</h2>
        <div className="flex items-center gap-2">
          {digestMutation.isSuccess && <span className="text-[10px] text-primary">Triggered!</span>}
          <motion.button whileTap={{ scale: 0.97 }} transition={spring}
            onClick={() => digestMutation.mutate()}
            disabled={digestMutation.isPending}
            className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50">
            <Send className="w-3 h-3" />
            {digestMutation.isPending ? "Sending..." : "Trigger Digest"}
          </motion.button>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border">
            <Search className="w-3 h-3 text-muted-foreground" />
            <input type="text" placeholder="Search by email or name..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/40 outline-none w-48" />
          </div>
        </div>
      </div>

      {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_80px_80px_80px_80px] px-4 py-2 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
          <span>Recipient</span>
          <span>Email</span>
          <span>Stack</span>
          <span>Problems</span>
          <span>Attempted</span>
          <span>Sent</span>
        </div>

        {/* Rows */}
        {digestList?.digests.map((d: AdminDigest, i: number) => (
          <motion.div key={d.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            className="grid grid-cols-[1fr_1fr_80px_80px_80px_80px] items-center px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-300 text-[11px]"
          >
            <span className="font-medium truncate text-foreground">{d.user_name}</span>
            <span className="text-muted-foreground truncate">{d.user_email}</span>
            <span className="text-[10px] font-semibold text-primary">{d.stack}</span>
            <span className="font-mono tabular-nums">{d.problem_count}</span>
            <span className={`font-mono tabular-nums ${d.attempted_count > 0 ? "text-green-500" : "text-muted-foreground/40"}`}>
              {d.attempted_count}
            </span>
            <span className="text-muted-foreground/50 font-mono tabular-nums text-[10px]">{timeAgo(d.sent_at)}</span>
          </motion.div>
        ))}

        {digestList?.digests.length === 0 && (
          <div className="px-4 py-8 text-center text-[12px] text-muted-foreground/50">
            No digests sent yet.
          </div>
        )}

        {/* Pagination */}
        {digestList && digestList.total > digestList.per_page && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 text-[10px] text-muted-foreground">
            <span>{digestList.total} digests</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-2 py-0.5 rounded bg-muted hover:bg-secondary disabled:opacity-30 cursor-pointer transition-colors">Prev</button>
              <span className="px-2 py-0.5 font-mono">{page}/{Math.ceil(digestList.total / digestList.per_page)}</span>
              <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(digestList.total / digestList.per_page)}
                className="px-2 py-0.5 rounded bg-muted hover:bg-secondary disabled:opacity-30 cursor-pointer transition-colors">Next</button>
            </div>
          </div>
        )}
    </div>
  );
}
