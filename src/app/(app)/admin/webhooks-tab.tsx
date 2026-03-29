"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAdminWebhooks, type WebhookEvent } from "@/lib/api/admin";

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

const STATUS_FILTERS = [
  { id: "", label: "All" },
  { id: "processed", label: "Processed" },
  { id: "processing", label: "Processing" },
  { id: "failed", label: "Failed" },
] as const;

export function WebhooksTab() {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: webhookList } = useQuery({
    queryKey: ["admin-webhooks", statusFilter, page],
    queryFn: () => getAdminWebhooks(statusFilter || undefined, page),
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h2 className="text-[13px] font-semibold flex-1">Webhook Events</h2>
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <motion.button key={f.id}
              whileTap={{ scale: 0.97 }} transition={spring}
              onClick={() => { setStatusFilter(f.id); setPage(1); }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-all duration-500 ${
                statusFilter === f.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}>
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_100px_1fr_100px] px-4 py-2 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
        <span>Event ID</span>
        <span>Type</span>
        <span>Status</span>
        <span>Error</span>
        <span>Time</span>
      </div>

      {/* Rows */}
      {webhookList?.events.map((e: WebhookEvent, i: number) => (
        <motion.div key={e.id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
          className="grid grid-cols-[1fr_1fr_100px_1fr_100px] items-center px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-300 text-[11px]"
        >
          <span className="font-mono tabular-nums text-muted-foreground truncate text-[10px]">{e.event_id}</span>
          <span className="font-medium text-foreground">{e.event_type}</span>
          <span>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${
              e.status === "processed"
                ? "bg-green-500/8 border border-green-500/19 text-green-500"
                : e.status === "failed"
                  ? "bg-destructive/8 border border-destructive/19 text-destructive"
                  : "bg-amber-500/8 border border-amber-500/19 text-amber-500"
            }`}>
              <span className={`w-1 h-1 rounded-full ${
                e.status === "processed" ? "bg-green-500" : e.status === "failed" ? "bg-destructive" : "bg-amber-500"
              }`} />
              {e.status}
            </span>
          </span>
          <span className="text-destructive/70 truncate text-[10px]">{e.error || "—"}</span>
          <span className="text-muted-foreground/50 font-mono tabular-nums text-[10px]">{timeAgo(e.created_at)}</span>
        </motion.div>
      ))}

      {webhookList?.events.length === 0 && (
        <div className="px-4 py-8 text-center text-[12px] text-muted-foreground/50">
          No webhook events found.
        </div>
      )}

      {/* Pagination */}
      {webhookList && webhookList.total > webhookList.per_page && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 text-[10px] text-muted-foreground">
          <span>{webhookList.total} events</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="px-2 py-0.5 rounded bg-muted hover:bg-secondary disabled:opacity-30 cursor-pointer transition-colors">Prev</button>
            <span className="px-2 py-0.5 font-mono">{page}/{Math.ceil(webhookList.total / webhookList.per_page)}</span>
            <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(webhookList.total / webhookList.per_page)}
              className="px-2 py-0.5 rounded bg-muted hover:bg-secondary disabled:opacity-30 cursor-pointer transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
