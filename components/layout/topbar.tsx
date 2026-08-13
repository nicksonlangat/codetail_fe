"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Paths", href: "/paths" },
  { label: "Resume", href: "/resume" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
];

export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [scrolled]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-bg/80 backdrop-blur-md border-b border-brand-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="font-semibold text-lg text-brand-text cursor-pointer shrink-0">
          Code<span className="text-brand-primary">tail</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-brand-text-muted cursor-pointer transition-all duration-500 hover:text-brand-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signin"
            className="inline-flex items-center rounded-lg border border-brand-border text-sm font-medium text-brand-text-muted px-4 py-2 cursor-pointer transition-all duration-500 hover:bg-brand-surface hover:text-brand-text"
          >
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP}>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-brand-primary text-white text-sm font-medium px-4 py-2 cursor-pointer transition-all duration-500 hover:bg-brand-primary-hover"
            >
              Get started
            </Link>
          </motion.div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden flex items-center justify-center size-9 rounded-lg text-brand-text cursor-pointer transition-all duration-500 hover:bg-brand-surface"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={SP}
            className="md:hidden overflow-hidden bg-brand-bg border-b border-brand-border"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-brand-text-muted cursor-pointer transition-all duration-500 hover:text-brand-text py-2"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3 mt-2 border-t border-brand-border">
                <Link
                  href="/signin"
                  className="inline-flex items-center rounded-lg border border-brand-border text-sm font-medium text-brand-text-muted px-4 py-2 cursor-pointer transition-all duration-500 hover:bg-brand-surface hover:text-brand-text"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center rounded-lg bg-brand-primary text-white text-sm font-medium px-4 py-2 cursor-pointer transition-all duration-500 hover:bg-brand-primary-hover"
                >
                  Get started
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
