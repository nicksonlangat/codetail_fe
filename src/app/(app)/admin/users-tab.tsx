"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield, CheckCircle2, XCircle } from "lucide-react";
import { getAdminUsers, type AdminUser } from "@/lib/api/admin";
import { UserDetailModal } from "./user-detail-modal";

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

export function UsersTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: userList } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: () => getAdminUsers(search || undefined, page),
  });

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <h2 className="text-[13px] font-semibold flex-1">Users</h2>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border">
            <Search className="w-3 h-3 text-muted-foreground" />
            <input type="text" placeholder="Search by email or name..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/40 outline-none w-48" />
          </div>
        </div>

        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_60px_60px_60px_80px] px-4 py-2 bg-muted/30 border-b border-border/50 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
          <span>Name</span>
          <span>Email</span>
          <span>Tier</span>
          <span>Verified</span>
          <span>Role</span>
          <span>Joined</span>
        </div>

        {/* Rows */}
        {userList?.users.map((u: AdminUser, i: number) => (
          <motion.div key={u.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
            onClick={() => setSelectedUserId(u.id)}
            className="grid grid-cols-[1fr_1fr_60px_60px_60px_80px] items-center px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 cursor-pointer transition-colors duration-300 text-[11px]"
          >
            <span className={`font-medium truncate ${u.is_banned ? "text-destructive/60 line-through" : "text-foreground"}`}>{u.name}</span>
            <span className="text-muted-foreground truncate">{u.email}</span>
            <span className={`text-[10px] font-semibold ${u.tier === "pro" ? "text-primary" : "text-muted-foreground/50"}`}>
              {u.tier}
            </span>
            <span>
              {u.is_verified ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-muted-foreground/30" />}
            </span>
            <span>
              {u.is_admin ? <Shield className="w-3 h-3 text-primary" /> : <span className="text-muted-foreground/20">—</span>}
            </span>
            <span className="text-muted-foreground/50 font-mono tabular-nums text-[10px]">{timeAgo(u.created_at)}</span>
          </motion.div>
        ))}

        {/* Pagination */}
        {userList && userList.total > userList.per_page && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 text-[10px] text-muted-foreground">
            <span>{userList.total} users</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-2 py-0.5 rounded bg-muted hover:bg-secondary disabled:opacity-30 cursor-pointer transition-colors">Prev</button>
              <span className="px-2 py-0.5 font-mono">{page}/{Math.ceil(userList.total / userList.per_page)}</span>
              <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(userList.total / userList.per_page)}
                className="px-2 py-0.5 rounded bg-muted hover:bg-secondary disabled:opacity-30 cursor-pointer transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedUserId && (
          <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
