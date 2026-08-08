"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Bell, BookOpen, CheckCheck, Flame } from "lucide-react";

const TAP = { type: "spring" as const, stiffness: 400, damping: 25 };
const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };

type Notification = {
  id: string;
  icon: typeof Bell;
  iconClass: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "streak",
    icon: Flame,
    iconClass: "bg-brand-warning/10 text-brand-warning",
    title: "7-day streak unlocked",
    detail: "You've practiced 7 days in a row. Keep it going.",
    time: "2h ago",
    read: false,
  },
  {
    id: "content",
    icon: BookOpen,
    iconClass: "bg-brand-primary/10 text-brand-primary",
    title: "New series: Web Security",
    detail: "12 articles on the OWASP Top 10, from exploit to fix.",
    time: "1d ago",
    read: false,
  },
  {
    id: "badge",
    icon: Award,
    iconClass: "bg-brand-success/10 text-brand-success",
    title: "Badge earned: Problem Solver",
    detail: "You've solved 10 problems across every path.",
    time: "3d ago",
    read: true,
  },
];

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={TAP}
        className={`relative flex items-center justify-center size-9 rounded-lg cursor-pointer outline-none transition-all duration-500 ${
          open ? "bg-brand-surface text-brand-primary" : "text-brand-text hover:bg-brand-surface hover:text-brand-primary"
        }`}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-destructive border-2 border-white" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={ENTRANCE}
            className="absolute right-0 top-full mt-2 w-80 origin-top-right rounded-xl border border-brand-border bg-white shadow-xl shadow-brand-primary/5 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
              <p className="text-sm font-semibold text-brand-text">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-brand-primary cursor-pointer outline-none transition-all duration-500 hover:text-brand-primary-hover"
                >
                  <CheckCheck className="size-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto p-1.5">
              {notifications.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-brand-text-subtle">
                  You&apos;re all caught up
                </p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="w-full flex items-start gap-3 px-2.5 py-2.5 rounded-lg text-left cursor-pointer outline-none transition-all duration-500 hover:bg-brand-surface/70"
                  >
                    <span className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${n.iconClass}`}>
                      <n.icon className="size-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-medium text-brand-text truncate">{n.title}</p>
                        {!n.read && <span className="size-1.5 rounded-full bg-brand-primary shrink-0" />}
                      </div>
                      <p className="text-[12px] text-brand-text-muted leading-snug mt-0.5">{n.detail}</p>
                      <p className="text-[11px] text-brand-text-subtle mt-1">{n.time}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
