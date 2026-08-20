"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { CommandPalette } from "./command-palette";
import { UserMenu } from "./user-menu";
import { NotificationsMenu } from "./notifications-menu";
import { useAuthStore } from "@/stores/auth-store";
import { getMe } from "@/lib/api/auth";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };
const TAB_SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "paths", label: "Paths", href: "/paths" },
  { id: "system-design", label: "System Design", href: "/system-design" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "interviews", label: "Interviews", href: "/interviews" },
  { id: "resume", label: "Resume", href: "/resume" },
];

export function AppTopbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const pathname = usePathname();

  useEffect(() => {
    getMe().then(setUser).catch(() => {});
  }, []);

  // The challenge page (/paths/[slug]/[unit]/[problemId]) is a full-height
  // editor with its own focused header (back-nav, prev/next) — no room or
  // need for the global bar there. Cmd+K stays available regardless, since
  // it's a keyboard overlay, not chrome competing for vertical space.
  const segments = pathname.split("/").filter(Boolean);
  const isChallengePage = segments[0] === "paths" && segments.length === 4;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (isChallengePage) {
    return <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />;
  }

  return (
    <div className="sticky top-0 z-40 w-full flex flex-col items-center bg-brand-bg/90 backdrop-blur-md">
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <div className="w-full flex justify-between items-center max-w-6xl px-6 pt-5 pb-8">
        <div className="flex gap-5 items-center text-sm">
          <Link href="/dashboard" className="font-semibold text-lg text-brand-text cursor-pointer">
            Code<span className="text-brand-primary">tail</span>
          </Link>

          <motion.button
            onClick={() => setPaletteOpen(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={SP}
            className="flex items-center gap-2 bg-white border border-brand-border rounded-lg pl-4 pr-1.5 py-1.5 w-64 cursor-pointer transition-all duration-500 hover:border-brand-primary-soft"
          >
            <Search className="size-3.5 text-brand-text-subtle shrink-0" />
            <span className="flex-1 text-left text-sm text-brand-text-subtle">
              Search paths, problems...
            </span>
            <span className="text-[10px] font-mono text-brand-text-subtle bg-brand-surface px-1.5 py-1 rounded-md shrink-0">
              ⌘K
            </span>
          </motion.button>
        </div>

        <div className="flex gap-3 items-center text-sm">
          <NotificationsMenu />
          <UserMenu user={user} />
        </div>
      </div>

      <div className="w-full flex justify-between items-center max-w-6xl px-6">
        <div className="flex gap-5 items-center text-sm font-medium">
          {NAV_TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative pb-3 cursor-pointer transition-all duration-500 ${
                  active ? "text-brand-primary" : "text-brand-text-muted hover:text-brand-text"
                }`}
              >
                {tab.label}
                {active && (
                  <motion.span
                    layoutId="dashboard-nav-underline"
                    transition={TAB_SPRING}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <hr className="w-full border-brand-border" />
    </div>
  );
}
