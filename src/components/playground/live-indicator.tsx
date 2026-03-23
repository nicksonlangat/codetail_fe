"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

type Status = "online" | "away" | "dnd" | "offline";

const statusColors: Record<Status, string> = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  dnd: "bg-red-500",
  offline: "bg-gray-400",
};

const statusRings: Record<Status, string> = {
  online: "ring-green-500",
  away: "ring-yellow-500",
  dnd: "ring-red-500",
  offline: "ring-gray-400",
};

const statusLabels: Record<Status, string> = {
  online: "Online",
  away: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

const statuses: Status[] = ["online", "away", "dnd", "offline"];

/* ── Simple Dot ── */
function SimpleDot() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
      </span>
      <span className="text-sm text-foreground">Online</span>
    </div>
  );
}

/* ── LIVE Badge ── */
function LiveBadge() {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white cursor-pointer"
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 0 rgba(239,68,68,0.4)",
          "0 0 0 6px rgba(239,68,68,0)",
          "0 0 0 0 rgba(239,68,68,0)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      LIVE
    </motion.span>
  );
}

/* ── Avatar with Status Ring ── */
function AvatarStatus({ status }: { status: Status }) {
  return (
    <div className="relative inline-block">
      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
        JD
      </div>
      <motion.span
        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-background transition-all duration-500 ${statusColors[status]}`}
        layout
        transition={spring}
      />
    </div>
  );
}

/* ── Typing Indicator ── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 rounded-full bg-muted px-3 py-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">Alex is typing...</span>
    </div>
  );
}

/* ── Activity Indicator ── */
function ActivityIndicator() {
  return (
    <motion.div
      className="flex items-center gap-2"
      animate={{
        textShadow: [
          "0 0 4px rgba(34,197,94,0.4)",
          "0 0 0px rgba(34,197,94,0)",
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="relative flex h-2 w-2">
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-green-400"
          animate={{ opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span className="text-xs text-muted-foreground">Active 2m ago</span>
    </motion.div>
  );
}

/* ── Main Export ── */
export function LiveIndicator() {
  const [status, setStatus] = useState<Status>("online");

  return (
    <div className="space-y-8">
      {/* Simple Dot */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-3">
          Simple Dot
        </p>
        <SimpleDot />
      </div>

      {/* LIVE Badge */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-3">
          Live Badge
        </p>
        <LiveBadge />
      </div>

      {/* Avatar with Status Ring */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-3">
          Avatar Status
        </p>
        <div className="flex items-center gap-4">
          <AvatarStatus status={status} />
          <div className="flex gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`cursor-pointer rounded-md px-2 py-1 text-[11px] transition-all duration-500 ${
                  status === s
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            className={`mt-2 text-xs ${statusRings[status].replace("ring-", "text-")}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={spring}
          >
            {statusLabels[status]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Typing Indicator */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-3">
          Typing Indicator
        </p>
        <TypingIndicator />
      </div>

      {/* Activity Indicator */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-3">
          Activity Status
        </p>
        <ActivityIndicator />
      </div>
    </div>
  );
}
