"use client";

import { motion } from "framer-motion";
import { Topbar } from "@/components/layout/topbar";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Topbar />

      <div className="relative flex items-center justify-center min-h-screen px-6 py-24">
        <div
          aria-hidden
          className="absolute inset-x-0 top-20 h-100 bg-brand-primary/10 blur-3xl rounded-full pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="relative w-full max-w-130 rounded-2xl bg-white shadow-2xl shadow-brand-primary/5 p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
