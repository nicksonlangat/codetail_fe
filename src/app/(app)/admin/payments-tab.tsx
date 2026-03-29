"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAdminPayments, type AdminPayment } from "@/lib/api/admin";

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

export function PaymentsTab() {
  const [page, setPage] = useState(1);

  const { data: payments } = useQuery({
    queryKey: ["admin-payments", page],
    queryFn: () => getAdminPayments(page),
  });

  const list = payments ?? [];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <h2 className="text-[13px] font-semibold flex-1">Payments</h2>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_80px_80px_80px_100px] px-4 py-2 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
        <span>Email</span>
        <span>Amount</span>
        <span>Currency</span>
        <span>Status</span>
        <span>Date</span>
      </div>

      {/* Rows */}
      {list.map((p: AdminPayment, i: number) => (
        <motion.div key={p.id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
          className="grid grid-cols-[1fr_80px_80px_80px_100px] items-center px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-300 text-[11px]"
        >
          <span className="text-muted-foreground truncate">{p.user_email}</span>
          <span className="font-mono tabular-nums font-medium">${p.amount.toFixed(2)}</span>
          <span className="text-muted-foreground/50 text-[10px] uppercase">{p.currency}</span>
          <span className={`text-[10px] font-medium ${
            p.status === "completed" ? "text-green-500" : p.status === "failed" ? "text-destructive" : "text-muted-foreground"
          }`}>
            {p.status}
          </span>
          <span className="text-muted-foreground/50 font-mono tabular-nums text-[10px]">{timeAgo(p.created_at)}</span>
        </motion.div>
      ))}

      {list.length === 0 && (
        <div className="px-4 py-8 text-center text-[12px] text-muted-foreground/50">
          No payments yet.
        </div>
      )}
    </div>
  );
}
