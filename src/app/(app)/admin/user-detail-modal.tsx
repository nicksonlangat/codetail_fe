"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Shield, Ban, Trash2, AlertTriangle } from "lucide-react";
import { getAdminUserDetail, changeUserTier, banUser, deleteUser } from "@/lib/api/admin";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function UserDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
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
