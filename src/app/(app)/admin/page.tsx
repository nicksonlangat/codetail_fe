"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users, Crown, CreditCard, TrendingUp, Shield, Mail, Newspaper, Receipt, Wallet, BookOpen, Activity, Webhook, Percent, BadgeCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { getEnrichedStats } from "@/lib/api/admin";
import { UsersTab } from "./users-tab";
import { EmailsTab } from "./emails-tab";
import { DigestsTab } from "./digests-tab";
import { SubscriptionsTab } from "./subscriptions-tab";
import { PaymentsTab } from "./payments-tab";
import { ContentTab } from "./content-tab";
import { ActivityTab } from "./activity-tab";
import { WebhooksTab } from "./webhooks-tab";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const TABS = [
  { id: "users", label: "Users", icon: Users },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "content", label: "Content", icon: BookOpen },
  { id: "digests", label: "Digests", icon: Newspaper },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "subscriptions", label: "Subscriptions", icon: Receipt },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
] as const;

type TabId = (typeof TABS)[number]["id"];

const tabTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("users");

  useEffect(() => {
    if (user && !user.is_admin) router.replace("/dashboard");
  }, [user, router]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats-enriched"],
    queryFn: getEnrichedStats,
    enabled: !!user?.is_admin,
  });

  if (!user?.is_admin) return null;

  const statCards = [
    { label: "Total Users", value: stats?.total_users ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Verified", value: stats?.verified_users ?? 0, icon: BadgeCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pro Users", value: stats?.pro_users ?? 0, icon: Crown, color: "text-primary", bg: "bg-primary/10" },
    { label: "Conversion", value: `${stats?.conversion_rate ?? 0}%`, icon: Percent, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Subs", value: stats?.active_subscriptions ?? 0, icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "MRR", value: `$${stats?.mrr?.toFixed(0) ?? 0}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-primary" />
          <h1 className="text-[15px] font-semibold tracking-tight">Admin Dashboard</h1>
        </div>
        <p className="text-[12px] text-muted-foreground">Platform overview and management.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
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
                  className="flex-1 bg-primary/60 hover:bg-primary rounded-t-sm cursor-pointer transition-colors duration-300"
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

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-border/50">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 py-2.5 text-[12px] font-medium cursor-pointer transition-all duration-500"
            >
              <span className={`flex items-center gap-1.5 ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
                <Icon className="w-3 h-3" />
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="admin-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={spring}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "users" && <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><UsersTab /></motion.div>}
        {activeTab === "activity" && <motion.div key="activity" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><ActivityTab /></motion.div>}
        {activeTab === "content" && <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><ContentTab /></motion.div>}
        {activeTab === "digests" && <motion.div key="digests" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><DigestsTab /></motion.div>}
        {activeTab === "emails" && <motion.div key="emails" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><EmailsTab /></motion.div>}
        {activeTab === "subscriptions" && <motion.div key="subscriptions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><SubscriptionsTab /></motion.div>}
        {activeTab === "payments" && <motion.div key="payments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><PaymentsTab /></motion.div>}
        {activeTab === "webhooks" && <motion.div key="webhooks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={tabTransition}><WebhooksTab /></motion.div>}
      </AnimatePresence>
    </main>
  );
}
