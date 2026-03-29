"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { getAdminSubscriptions, type AdminSubscription } from "@/lib/api/admin";

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

export function SubscriptionsTab() {
  const [page, setPage] = useState(1);

  const { data: subs } = useQuery({
    queryKey: ["admin-subscriptions", page],
    queryFn: () => getAdminSubscriptions(page),
  });

  const list = subs ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h2 className="text-[13px] font-semibold flex-1">Subscriptions</h2>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_80px_80px_100px_100px] px-4 py-2 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
        <span>Email</span>
        <span>Plan</span>
        <span>Status</span>
        <span>Billing</span>
        <span>Created</span>
      </div>

      {/* Rows */}
      {list.map((s: AdminSubscription, i: number) => (
        <motion.div key={s.id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
          className="grid grid-cols-[1fr_80px_80px_100px_100px] items-center px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-300 text-[11px]"
        >
          <span className="text-muted-foreground truncate">{s.user_email}</span>
          <span className="text-[10px] font-semibold text-primary">{s.plan}</span>
          <span className={`text-[10px] font-medium ${
            s.status === "active" ? "text-green-500" : s.status === "cancelled" ? "text-destructive" : "text-muted-foreground"
          }`}>
            {s.status}
          </span>
          <span className="text-muted-foreground/70 text-[10px]">{s.billing_cycle}</span>
          <span className="text-muted-foreground/50 font-mono tabular-nums text-[10px]">{timeAgo(s.created_at)}</span>
        </motion.div>
      ))}

      {list.length === 0 && (
        <div className="px-4 py-8 text-center text-[12px] text-muted-foreground/50">
          No subscriptions yet.
        </div>
      )}
    </div>
  );
}
