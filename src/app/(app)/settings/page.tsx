"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BillingTab } from "@/components/settings/billing-tab";
import { useAuthStore } from "@/stores/auth-store";

type Tab = "profile" | "preferences" | "billing" | "account";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile",     label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "billing",     label: "Billing" },
  { id: "account",     label: "Account" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };
const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.15 },
};

function SettingsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  const initial = (searchParams.get("tab") as Tab) ?? "profile";
  const [tab, setTab] = useState<Tab>(initial);

  const [name, setName]                   = useState(user?.name ?? "");
  const [language, setLanguage]           = useState("Python");
  const [notifications, setNotifications] = useState(false);
  const [aiHints, setAiHints]             = useState(true);
  const [autoRun, setAutoRun]             = useState(true);

  function switchTab(t: Tab) {
    setTab(t);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", t);
    router.replace(`/settings?${params.toString()}`, { scroll: false });
  }

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences.</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0.5 border-b border-border/40 mb-6">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => switchTab(t.id)}
            className={`relative px-4 py-2 text-[13px] cursor-pointer transition-all duration-500 ${
              tab === t.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            }`}>
            {t.label}
            {tab === t.id && (
              <motion.div layoutId="settings-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                transition={spring} />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* Profile */}
        {tab === "profile" && (
          <motion.div key="profile" {...fade} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Profile</CardTitle>
                <CardDescription className="text-xs">Your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input id="email" type="email" value={user?.email ?? ""} readOnly className="h-9 opacity-60" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="language" className="text-xs">Preferred Language</Label>
                  <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-9 text-sm bg-transparent px-3 rounded-lg ring-1 ring-border/50 hover:ring-border outline-none transition-all cursor-pointer">
                    {["Python","JavaScript","TypeScript","Java","C++","Go"].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <Button size="sm">Save profile</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Preferences */}
        {tab === "preferences" && (
          <motion.div key="preferences" {...fade} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preferences</CardTitle>
                <CardDescription className="text-xs">Customize your experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "Dark mode",            sub: "Toggle between light and dark theme",   checked: theme === "dark",  set: (v: boolean) => setTheme(v ? "dark" : "light") },
                  { label: "AI hints",             sub: "Show hints when you're stuck",          checked: aiHints,           set: setAiHints },
                  { label: "Auto-run code",         sub: "Run code automatically after changes",  checked: autoRun,           set: setAutoRun },
                  { label: "Email notifications",   sub: "Receive weekly progress reports",       checked: notifications,     set: setNotifications },
                ].map(({ label, sub, checked, set }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">{label}</Label>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
                    </div>
                    <Switch checked={checked} onCheckedChange={set} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Billing */}
        {tab === "billing" && (
          <motion.div key="billing" {...fade}>
            <BillingTab />
          </motion.div>
        )}

        {/* Account */}
        {tab === "account" && (
          <motion.div key="account" {...fade}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Account</CardTitle>
                <CardDescription className="text-xs">Manage your account settings.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-sm text-foreground">Sign out</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">End your current session</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => { logout(); router.push("/signin"); }}>
                  Sign out
                </Button>
                <div className="w-px h-8 bg-border/50" />
                <div className="flex-1">
                  <span className="text-sm text-destructive">Delete account</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Permanently remove your data</p>
                </div>
                <Button variant="outline" size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive">
                  Delete
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  );
}
