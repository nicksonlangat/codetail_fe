"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Crown, CreditCard, TrendingUp, Search, Shield, Send, CheckCircle2, XCircle, X, Ban, Trash2, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { getPlatformStats, getAdminUsers, getAdminUserDetail, changeUserTier, banUser, deleteUser, triggerDailyDigest, type AdminUser, type AdminUserDetail } from "@/lib/api/admin";

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

/* ── User Detail Modal ── */
function UserDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => getAdminUserDetail(userId),
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const tierMutation = useMutation({
    mutationFn: (tier: string) => changeUserTier(userId, tier),
    onSuccess: invalidateAll,
  });

  const banMutation = useMutation({
    mutationFn: () => banUser(userId),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => { invalidateAll(); onClose(); },
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isOwnAccount = user?.is_admin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />

      <motion.div
        className="relative w-full max-w-[480px] mx-4 rounded-2xl border border-border bg-card overflow-hidden max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={spring}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500 z-10">
          <X className="w-4 h-4" />
        </button>

        {isLoading || !user ? (
          <div className="p-8 text-center text-muted-foreground text-[12px]">Loading...</div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  user.is_banned ? "bg-destructive/20" : "bg-gradient-to-br from-primary/80 to-primary"
                }`}>
                  <span className={`text-sm font-semibold ${user.is_banned ? "text-destructive" : "text-primary-foreground"}`}>
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-semibold">{user.name}</h2>
                    {user.is_admin && <Shield className="w-3 h-3 text-primary" />}
                    {user.is_banned && <span className="text-[9px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">Banned</span>}
                  </div>
                  <p className="text-[12px] text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Solved</p>
                  <p className="text-[16px] font-bold font-mono">{user.problems_solved}</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Attempted</p>
                  <p className="text-[16px] font-bold font-mono">{user.problems_attempted}</p>
                </div>
              </div>

              <div className="space-y-0">
                {[
                  { label: "Joined", value: formatDate(user.created_at) },
                  { label: "Last Active", value: formatDate(user.updated_at) },
                  { label: "Verified", value: user.is_verified ? "Yes" : "No" },
                  { label: "Current Tier", value: user.tier.toUpperCase() },
                  ...(user.subscription ? [
                    { label: "Subscription", value: `${user.subscription.plan} (${user.subscription.status})` },
                    { label: "Billing", value: user.subscription.billing_cycle || "N/A" },
                    { label: "Period Ends", value: user.subscription.current_period_end ? formatDate(user.subscription.current_period_end) : "N/A" },
                  ] : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <span className="text-[11px] text-muted-foreground">{row.label}</span>
                    <span className="text-[11px] font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions — not for admin's own account */}
            {!isOwnAccount && (
              <div className="px-6 pb-5 space-y-4">
                {/* Tier */}
                <div>
                  <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-2">Change Tier</p>
                  <div className="flex items-center gap-2">
                    {["free", "pro"].map((t) => (
                      <motion.button key={t}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}
                        onClick={() => { if (t !== user.tier) tierMutation.mutate(t); }}
                        disabled={tierMutation.isPending}
                        className={`flex-1 text-[12px] font-medium py-2 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50 ${
                          user.tier === t
                            ? t === "pro" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        }`}>
                        {t === "pro" ? "Pro" : "Free"}
                      </motion.button>
                    ))}
                  </div>
                  {tierMutation.isSuccess && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-[10px] text-primary mt-1.5">Tier updated. Email sent.</motion.p>
                  )}
                </div>

                {/* Ban + Delete */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                  <motion.button
                    whileTap={{ scale: 0.97 }} transition={spring}
                    onClick={() => banMutation.mutate()}
                    disabled={banMutation.isPending}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium py-2 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50 ${
                      user.is_banned
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "bg-warning/10 text-warning hover:bg-warning/15"
                    }`}>
                    <Ban className="w-3 h-3" />
                    {user.is_banned ? "Unban" : "Ban User"}
                  </motion.button>

                  {!confirmDelete ? (
                    <motion.button
                      whileTap={{ scale: 0.97 }} transition={spring}
                      onClick={() => setConfirmDelete(true)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/15 cursor-pointer transition-all duration-500">
                      <Trash2 className="w-3 h-3" />
                      Delete User
                    </motion.button>
                  ) : (
                    <motion.button
                      initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                      whileTap={{ scale: 0.97 }} transition={spring}
                      onClick={() => deleteMutation.mutate()}
                      disabled={deleteMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold py-2 rounded-lg bg-destructive text-destructive-foreground cursor-pointer transition-all duration-500 disabled:opacity-50">
                      <AlertTriangle className="w-3 h-3" />
                      {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ── Main Admin Page ── */
export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user && !user.is_admin) router.replace("/dashboard");
  }, [user, router]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getPlatformStats,
    enabled: !!user?.is_admin,
  });

  const { data: userList } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: () => getAdminUsers(search || undefined, page),
    enabled: !!user?.is_admin,
  });

  const digestMutation = useMutation({
    mutationFn: triggerDailyDigest,
  });

  if (!user?.is_admin) return null;

  const statCards = [
    { label: "Total Users", value: stats?.total_users ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pro Users", value: stats?.pro_users ?? 0, icon: Crown, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Subs", value: stats?.active_subscriptions ?? 0, icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Revenue", value: `$${stats?.total_revenue?.toFixed(0) ?? 0}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-primary" />
          <h1 className="text-[15px] font-semibold tracking-tight">Admin Dashboard</h1>
        </div>
        <p className="text-[12px] text-muted-foreground">Platform overview and user management.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</span>
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                </div>
              </div>
              <span className="text-xl font-bold font-mono tabular-nums">{s.value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Signups chart */}
      {stats?.signups_per_day && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-[12px] font-semibold mb-3">Signups — Last 30 days</h2>
          <div className="flex items-end gap-[3px] h-20">
            {stats.signups_per_day.map((d, i) => {
              const max = Math.max(...stats.signups_per_day.map((x) => x.count), 1);
              const h = (d.count / max) * 100;
              return (
                <motion.div key={d.date}
                  className="flex-1 bg-primary/60 hover:bg-primary rounded-t-sm cursor-pointer transition-colors duration-300 group relative"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(h, 2)}%` }}
                  transition={{ delay: 0.3 + i * 0.015, type: "spring", stiffness: 300, damping: 20 }}
                  title={`${d.date}: ${d.count}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-muted-foreground/40 font-mono">{stats.signups_per_day[0]?.date.slice(5)}</span>
            <span className="text-[9px] text-muted-foreground/40 font-mono">{stats.signups_per_day[stats.signups_per_day.length - 1]?.date.slice(5)}</span>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.97 }} transition={spring}
          onClick={() => digestMutation.mutate()}
          disabled={digestMutation.isPending}
          className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500 disabled:opacity-50">
          <Send className="w-3 h-3" />
          {digestMutation.isPending ? "Sending..." : "Trigger Daily Digest"}
        </motion.button>
        {digestMutation.isSuccess && <span className="text-[10px] text-primary">Triggered!</span>}
      </div>

      {/* Users table — read only, click to open detail */}
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

        {/* Rows — click to open detail */}
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

      {/* User detail modal */}
      <AnimatePresence>
        {selectedUserId && (
          <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
