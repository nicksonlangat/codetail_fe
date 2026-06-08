"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Route, Workflow,
  Settings, LogOut, Sun, Moon,
  Shield, Sparkles, Zap, CreditCard, Crown,
} from "lucide-react";
import { CTLogo } from "@/components/brand/logo";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { getStreak } from "@/lib/api/progress";
import { UpgradeModal } from "@/components/paywall/upgrade-modal";

const baseNavItems = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: Route, label: "Paths", path: "/paths" },
  { icon: Workflow, label: "Canvas", path: "/canvas" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPro = user?.tier === "pro";
  const navItems = user?.is_admin
    ? [...baseNavItems, { icon: Shield, label: "Admin", path: "/admin" }]
    : baseNavItems;

  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: getStreak,
    enabled: !!user,
    staleTime: 60000,
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  return (
    <>
      <header className={`sticky top-0 z-50 w-full py-3 px-4 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/40" : ""}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0 cursor-pointer">
            <CTLogo size={26} variant="primary" />
            <span className="text-[15px] font-semibold tracking-tight">
              code<span className="text-primary">tail</span>
            </span>
          </Link>

          {/* Segmented tab control */}
          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path} className="relative cursor-pointer">
                  <div className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-primary rounded-full"
                        transition={spring}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right — avatar only */}
          <div className="flex items-center shrink-0" ref={menuRef}>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary cursor-pointer transition-all duration-150 group"
              >
                <div className="w-5 h-5 rounded-full bg-linear-to-br from-primary/80 to-primary flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-semibold text-primary-foreground leading-none">{initials}</span>
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[12px] font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-150 max-w-20 truncate">
                    {user?.name?.split(" ")[0] ?? ""}
                  </span>
                  {isPro && (
                    <span className="flex items-center gap-0.5 mt-0.5 text-[9px] font-semibold text-primary">
                      <Crown className="w-2.5 h-2.5" />
                      Pro
                    </span>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.13, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute right-0 top-full mt-2 w-56 z-50 bg-card border border-border/60 rounded-xl overflow-hidden shadow-lg"
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
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
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
                          ? <Sun className="w-3.5 h-3.5 shrink-0" />
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
          </div>
        </div>
      </header>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}
