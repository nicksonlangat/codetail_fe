"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Route, Workflow, ClipboardList, Settings,
  LogOut, Sun, Moon, Shield, Zap, CreditCard, Crown,
} from "lucide-react";
import { WandSparkles } from "lucide-react";
import { CTLogo } from "@/components/brand/logo";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { getStreak } from "@/lib/api/progress";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

const NAV = [
  { icon: LayoutDashboard, label: "Home",       path: "/dashboard",  color: "var(--primary)" },
  { icon: Route,           label: "Paths",      path: "/paths",      color: "#60A5FA"        },
  { icon: ClipboardList,   label: "Interviews", path: "/interviews", color: "#A78BFA"        },
  { icon: Workflow,        label: "Canvas",     path: "/canvas",     color: "var(--warning)" },
  { icon: Settings,        label: "Settings",   path: "/settings",   color: "var(--muted-foreground)" },
];

const SP = { type: "spring" as const, stiffness: 400, damping: 28 };

export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPro   = user?.tier === "pro";

  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: getStreak,
    enabled: !!user,
    staleTime: 60_000,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name
    ?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  return (
    <>
      <aside className="w-16 flex flex-col items-center justify-between py-5 shrink-0 rounded-xl bg-card">

        {/* Top: logo + nav */}
        <div className="flex flex-col items-center gap-5 w-full">
          <Link href="/dashboard" className="cursor-pointer">
            <CTLogo size={26} variant="primary" />
          </Link>

          <div className="w-7 h-px bg-border" />

          <nav className="w-full px-2 space-y-0.5">
            {NAV.map(({ icon: Icon, label, path, color }) => {
              const active = pathname.startsWith(path);
              return (
                <Link key={path} href={path} className="block">
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    transition={SP}
                    className="flex flex-col items-center gap-0.5 py-2 rounded-lg cursor-pointer transition-all duration-500"
                    style={{
                      background: active ? `color-mix(in srgb, ${color} 12%, transparent)` : "transparent",
                      color:      active ? color : "var(--muted-foreground)",
                    }}
                  >
                    <Icon size={15} />
                    <span className="text-[8.5px] font-medium">{label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: theme toggle + avatar + tier */}
        <div className="flex flex-col items-center gap-2" ref={menuRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={SP}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500"
            title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </motion.button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-500 bg-secondary text-primary ring-[1.5px] ring-primary/40"
            >
              {initials}
            </button>

            {/* Streak badge */}
            {streak && streak.current_streak > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black bg-warning text-black leading-none">
                {streak.current_streak > 99 ? "99" : streak.current_streak}
              </div>
            )}

            {/* Popover — opens to the right */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -6, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -6, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute left-full bottom-0 ml-2 w-56 z-50 rounded-xl overflow-hidden shadow-lg bg-card border border-border/60"
                >
                  {/* User info */}
                  <div className="px-3 py-3 border-b border-border/50">
                    <p className="text-[13px] font-semibold text-foreground truncate">{user?.name ?? "Guest"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email ?? ""}</p>
                  </div>

                  {/* Upgrade / Billing */}
                  <div className="px-2 pt-2 pb-1">
                    {!isPro ? (
                      <button
                        onClick={() => { setMenuOpen(false); setUpgradeOpen(true); }}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary/8 border border-primary/15 hover:bg-primary/12 cursor-pointer transition-all duration-500 group"
                      >
                        <div className="flex items-center gap-2">
                          <WandSparkles className="w-3.5 h-3.5 text-primary" />
                          <div className="text-left">
                            <p className="text-[12px] font-semibold text-primary leading-none">Upgrade to Pro</p>
                            <p className="text-[9px] text-primary/60 mt-0.5">Unlock all paths · $9/mo</p>
                          </div>
                        </div>
                        <Zap className="w-3 h-3 text-primary/50 group-hover:text-primary transition-colors duration-500" />
                      </button>
                    ) : (
                      <button
                        onClick={() => { setMenuOpen(false); router.push("/settings?tab=billing"); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-border/40 hover:bg-muted cursor-pointer transition-all duration-500"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[12px] text-foreground/80 flex-1 text-left">Billing</span>
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    {user?.is_admin && (
                      <>
                        <button
                          onClick={() => { setMenuOpen(false); router.push("/admin"); }}
                          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-primary hover:bg-primary/10 cursor-pointer transition-colors duration-75"
                        >
                          <Shield className="w-3.5 h-3.5 shrink-0" />
                          <span className="flex-1 text-left">Admin</span>
                        </button>
                        <div className="h-px bg-border/50 my-1" />
                      </>
                    )}

                    <button
                      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-foreground/80 hover:bg-secondary hover:text-foreground cursor-pointer transition-colors duration-75"
                    >
                      {resolvedTheme === "dark"
                        ? <Sun  className="w-3.5 h-3.5 shrink-0" />
                        : <Moon className="w-3.5 h-3.5 shrink-0" />
                      }
                      <span className="flex-1 text-left">{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</span>
                    </button>

                    <button
                      onClick={() => { setMenuOpen(false); router.push("/settings"); }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-foreground/80 hover:bg-secondary hover:text-foreground cursor-pointer transition-colors duration-75"
                    >
                      <Settings className="w-3.5 h-3.5 shrink-0" />
                      <span className="flex-1 text-left">Settings</span>
                    </button>

                    {streak && streak.current_streak > 0 && (
                      <div className="flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-muted-foreground">
                        <span className="text-sm leading-none">🔥</span>
                        <span>{streak.current_streak} day streak</span>
                      </div>
                    )}

                    <div className="h-px bg-border/50 my-1" />

                    <button
                      onClick={() => { setMenuOpen(false); logout(); router.push("/signin"); }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-destructive hover:bg-destructive/10 cursor-pointer transition-colors duration-75"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      <span className="flex-1 text-left">Log out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tier badge */}
          {isPro ? (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide text-primary bg-primary/10 cursor-pointer">
              <Crown className="w-2.5 h-2.5" /> PRO
            </div>
          ) : (
            <button
              onClick={() => setUpgradeOpen(true)}
              className="px-2 py-1 rounded text-[8px] font-bold tracking-wide cursor-pointer transition-all duration-500 bg-border/60 text-muted-foreground border border-border hover:border-primary/40 hover:text-primary"
            >
              FREE
            </button>
          )}
        </div>
      </aside>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}
