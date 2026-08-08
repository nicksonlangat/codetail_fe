"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-320 mx-auto px-4 lg:px-6">
        <div className="flex gap-8 py-8">
          <aside className="hidden xl:block w-45 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-medium text-brand-text-subtle mb-3">
                On this page
              </p>
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`block w-full text-left text-[11px] py-1.5 px-2 rounded cursor-pointer transition-all duration-500 ${
                    activeId === item.id
                      ? "text-brand-primary font-medium bg-brand-primary/5"
                      : "text-brand-text-muted hover:text-brand-text hover:bg-brand-surface/50"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 max-w-180">{children}</main>

          {sidebar && <aside className="hidden lg:block w-70 shrink-0">{sidebar}</aside>}
        </div>
      </div>

      <div className="xl:hidden fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-brand-border rounded-lg shadow-lg text-[11px] font-medium text-brand-text cursor-pointer outline-none"
        >
          <span>Contents</span>
          <ChevronDown
            className={`size-3 transition-transform duration-500 ${isMobileMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="xl:hidden fixed bottom-16 left-4 right-4 z-40 bg-white border border-brand-border rounded-xl shadow-xl p-4 max-h-[60vh] overflow-y-auto"
          >
            <nav className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-left text-[12px] py-2 px-2 rounded cursor-pointer text-brand-text hover:bg-brand-surface"
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
