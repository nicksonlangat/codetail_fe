"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { AnimatedTabs } from "@/components/playground/animated-tabs";
import { SparklineChart } from "@/components/playground/sparkline-chart";
import { OtpInput } from "@/components/playground/otp-input";
import { SkeletonLoading } from "@/components/playground/skeleton-loading";
import { ToggleGroup } from "@/components/playground/toggle-group";
import { AvatarStack } from "@/components/playground/avatar-stack";
import { NotificationBell } from "@/components/playground/notification-bell";
import { DragReorder } from "@/components/playground/drag-reorder";
import { RadialProgress } from "@/components/playground/radial-progress";
import { FileUpload } from "@/components/playground/file-upload";

const sections = [
  { num: "11", title: "Animated Tabs", component: AnimatedTabs },
  { num: "12", title: "Sparkline Charts", component: SparklineChart },
  { num: "13", title: "OTP Input", component: OtpInput },
  { num: "14", title: "Skeleton Loading", component: SkeletonLoading },
  { num: "15", title: "Toggle Group", component: ToggleGroup },
  { num: "16", title: "Avatar Stack", component: AvatarStack },
  { num: "17", title: "Notification Bell", component: NotificationBell },
  { num: "18", title: "Drag & Reorder", component: DragReorder },
  { num: "19", title: "Radial Progress", component: RadialProgress },
  { num: "20", title: "File Upload", component: FileUpload },
];

export default function Tranche2Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Link
          href="/playground"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          Playground
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.05 }}
      >
        <h1 className="text-xl font-semibold tracking-tight">
          Tranche 2 — Interactions & Data Display
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
          Interactive patterns and data visualization components — tabs,
          sparklines, verification flows, loading states, and segmented
          controls with spring physics.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-0">
        {sections.map((section, i) => {
          const Component = section.component;
          return (
            <motion.section
              key={section.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.1 + i * 0.07,
              }}
            >
              {/* Divider (except before first) */}
              {i > 0 && (
                <div className="border-t border-border/50 my-10" />
              )}

              {/* Section label */}
              <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-4">
                {section.num} — {section.title}
              </p>

              {/* Component */}
              <Component />
            </motion.section>
          );
        })}
      </div>
    </main>
  );
}
