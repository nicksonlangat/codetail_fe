"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, LayoutDashboard, Route, Sparkles, BookOpen,
  Settings, Plus, Search, Command, User, Bookmark,
  BarChart3, Flame, LogOut, Sun, Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { getStreak } from "@/lib/api/progress";
import { GenerateChallengeDialog } from "@/components/layout/generate-challenge-dialog";

const navItems = [
  { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
  { icon: Route, label: "Paths", path: "/paths" },
  { icon: Sparkles, label: "AI Sessions", path: "/sessions" },
  { icon: BookOpen, label: "Problems", path: "/problems" },
];

type MenuItem =
  | { type: "separator" }
  | { icon: typeof User; label: string; shortcut?: string; badge?: string; destructive?: boolean; href?: string };

const menuItems: MenuItem[] = [
  { icon: User, label: "Profile", shortcut: "⇧P" },
  { icon: Settings, label: "Settings", shortcut: "⇧S", href: "/settings" },
  { type: "separator" },
  { icon: BarChart3, label: "My Progress" },
  { icon: Bookmark, label: "Saved Problems" },
  { icon: Flame, label: "Streak", badge: "__streak__" },
  { type: "separator" },
  { icon: LogOut, label: "Log out", destructive: true },
];

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [generateOpen, setGenerateOpen] = useState(false);
  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: getStreak,
    enabled: !!user,
    staleTime: 60000,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center h-12 px-4 lg:px-6 gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
              <Code2 className="w-3 h-3 text-primary" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-foreground">
              code<span className="text-primary">tail</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] cursor-pointer transition-colors duration-75 ${
                    active
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Search */}
          <button className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-secondary cursor-pointer transition-colors duration-75 ring-1 ring-border/40">
            <Search className="w-3 h-3" />
            <span>Search...</span>
            <kbd className="flex items-center gap-0.5 text-[9px] text-muted-foreground/60 ml-2">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* Theme toggle */}
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 cursor-pointer transition-colors duration-75">
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* New Challenge */}
          <button onClick={() => setGenerateOpen(true)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all duration-100">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Challenge</span>
          </button>

          {/* Settings */}
          <Link href="/settings"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 cursor-pointer transition-colors duration-75">
            <Settings className="w-4 h-4" />
          </Link>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer transition-all duration-100 ring-2 ring-transparent hover:ring-primary/20">
              <span className="text-[10px] font-medium text-primary-foreground">{initials}</span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute right-0 top-full mt-1.5 w-56 z-50 bg-card border border-border/60 rounded-lg overflow-hidden shadow-lg">
                  {/* User info */}
                  <div className="px-3 py-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary-foreground">{initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-foreground truncate">{user?.name ?? "Guest"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email ?? ""}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    {menuItems.map((item, i) => {
                      if ("type" in item) {
                        return <div key={i} className="h-px bg-border/50 my-1" />;
                      }

                      const Icon = item.icon;
                      return (
                        <button key={i}
                          onClick={() => {
                            setMenuOpen(false);
                            if (item.href) router.push(item.href);
                            if (item.label === "Log out") { logout(); router.push("/signin"); }
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] cursor-pointer transition-colors duration-75 ${
                            item.destructive
                              ? "text-destructive hover:bg-destructive/10"
                              : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                          }`}>
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                              {item.badge === "__streak__"
                                ? `${streak?.current_streak ?? 0} days`
                                : item.badge}
                            </span>
                          )}
                          {item.shortcut && (
                            <span className="text-[10px] text-muted-foreground font-mono">{item.shortcut}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <GenerateChallengeDialog open={generateOpen} onClose={() => setGenerateOpen(false)} />
    </>
  );
}
