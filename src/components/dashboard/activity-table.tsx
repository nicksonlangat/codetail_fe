"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  title: string;
  path: string;
  status: "solved" | "attempted" | "in-progress";
  date: string;
}

const activity: ActivityItem[] = [
  {
    title: "Valid Palindrome",
    path: "Arrays & Strings",
    status: "solved",
    date: "2h ago",
  },
  {
    title: "Two Sum",
    path: "Arrays & Strings",
    status: "solved",
    date: "Yesterday",
  },
  {
    title: "Merge Intervals",
    path: "Arrays & Strings",
    status: "attempted",
    date: "Yesterday",
  },
  {
    title: "3Sum",
    path: "Arrays & Strings",
    status: "solved",
    date: "2d ago",
  },
  {
    title: "Reverse Linked List",
    path: "Linked Lists",
    status: "solved",
    date: "3d ago",
  },
  {
    title: "Climbing Stairs",
    path: "Dynamic Programming",
    status: "in-progress",
    date: "3d ago",
  },
];

const statusConfig = {
  solved: {
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    label: "Solved",
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  attempted: {
    icon: <XCircle className="w-3.5 h-3.5 text-amber-500" />,
    label: "Attempted",
    badgeClass: "bg-amber-500/10 text-amber-600",
  },
  "in-progress": {
    icon: <Play className="w-3.5 h-3.5 text-blue-500" />,
    label: "In progress",
    badgeClass: "bg-blue-500/10 text-blue-600",
  },
};

export function ActivityTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">
          Recent activity
        </h2>
        <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-75 flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="rounded-lg ring-1 ring-border/50 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_100px_80px] px-3 py-2 bg-muted/50 border-b border-border/30">
          {["Problem", "Path", "Status", "Date"].map((h) => (
            <span
              key={h}
              className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {activity.map((item, i) => {
          const cfg = statusConfig[item.status];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="w-full grid grid-cols-[1fr_120px_100px_80px] items-center px-3 py-2.5 text-left hover:bg-secondary/40 transition-colors duration-75 border-b border-border/30 last:border-0 group cursor-pointer"
            >
              <span className="text-[13px] text-foreground group-hover:text-primary transition-colors duration-75 truncate pr-2">
                {item.title}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {item.path}
              </span>
              <span className="flex items-center gap-1.5">
                {cfg.icon}
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${cfg.badgeClass}`}
                >
                  {cfg.label}
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.date}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
