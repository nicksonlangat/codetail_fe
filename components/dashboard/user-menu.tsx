"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Crown, LogOut } from "lucide-react";
import { useAuthStore, type User } from "@/stores/auth-store";

const TAP = { type: "spring" as const, stiffness: 400, damping: 25 };
const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSignOut() {
    useAuthStore.getState().logout();
    router.push("/signin");
  }

  const initials = user ? initialsOf(user.name) : "?";
  const isPro = user?.tier === "pro";

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={TAP}
        className={`flex gap-2.5 items-center pl-2 pr-2.5 py-1.5 rounded-lg cursor-pointer outline-none transition-all duration-500 ${
          open ? "bg-brand-surface" : "hover:bg-brand-surface"
        }`}
      >
        <span className="relative rounded-lg size-9 bg-brand-primary text-white flex items-center justify-center text-sm font-medium shrink-0 ring-2 ring-white shadow-sm">
          {initials}
          {isPro && (
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand-warning flex items-center justify-center ring-2 ring-white">
              <Crown className="size-2.5 text-white" fill="currentColor" />
            </span>
          )}
        </span>
        <div className="text-left">
          <p className="leading-tight text-brand-text text-sm font-medium">{user?.name ?? "Guest"}</p>
          <p className="text-xs text-brand-text-muted">{isPro ? "Pro member" : (user?.email ?? "")}</p>
        </div>
        <ChevronDown
          className={`size-4 text-brand-text-subtle transition-all duration-500 ${open ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={ENTRANCE}
            className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-xl border border-brand-border bg-white shadow-xl shadow-brand-primary/5 overflow-hidden z-50"
          >
            <div className="flex items-center gap-3 px-4 py-4 bg-brand-surface/50">
              <span className="rounded-lg size-11 bg-brand-primary text-white flex items-center justify-center text-base font-medium shrink-0 ring-2 ring-white shadow-sm">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
                <p className="text-[12px] text-brand-text-muted truncate">{user.email}</p>
              </div>
            </div>

            <div className="p-1.5">
              {isPro ? (
                <div className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-brand-text-muted">
                  <Crown className="size-3.5 text-brand-warning" fill="currentColor" />
                  You&apos;re on the Pro plan
                </div>
              ) : (
                <Link
                  href="/#pricing"
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-brand-primary-tint cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-soft/30"
                >
                  <Crown className="size-4 text-brand-primary shrink-0" />
                  <span className="flex-1 text-left text-[13px] font-medium text-brand-primary">
                    Upgrade to Pro
                  </span>
                  <ArrowRight className="size-3.5 text-brand-primary transition-all duration-500 group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>

            <div className="h-px bg-brand-border" />

            <div className="p-1.5">
              <button
                type="button"
                onClick={handleSignOut}
                className="group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-brand-text-muted cursor-pointer outline-none transition-all duration-500 hover:bg-brand-destructive/5 hover:text-brand-destructive"
              >
                <LogOut className="size-4 transition-all duration-500 group-hover:translate-x-0.5" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
