"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type TOCItem = {
  id: string;
  title: string;
};

type BlogLayoutProps = {
  children: React.ReactNode;
  toc?: TOCItem[];
  sidebar?: React.ReactNode;
};

export function BlogLayout({ children, toc = [], sidebar }: BlogLayoutProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;

    const headingElements = document.querySelectorAll("h2[id], h3[id]");
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [toc]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        <div className="flex gap-8 py-8">
          {/* Left rail - TOC (desktop) */}
          <aside className="hidden xl:block w-[180px] flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
                On this page
              </p>
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "block w-full text-left text-[11px] py-1.5 px-2 rounded transition-colors duration-150",
                    activeId === item.id
                      ? "text-primary font-medium bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-[720px]">{children}</main>

          {/* Right rail - Sidebar (desktop) */}
          {sidebar && <aside className="hidden lg:block w-[280px] flex-shrink-0">{sidebar}</aside>}
        </div>
      </div>

      {/* Mobile TOC dropdown */}
      <div className="xl:hidden fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg text-[11px] font-medium"
        >
          <span>Contents</span>
          <svg
            className={cn("w-3 h-3 transition-transform", isMobileMenuOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Mobile TOC menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 left-4 right-4 z-40 bg-card border border-border rounded-xl shadow-xl p-4 max-h-[60vh] overflow-y-auto"
          >
            <nav className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-left text-[12px] py-2 px-2 rounded hover:bg-secondary"
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}