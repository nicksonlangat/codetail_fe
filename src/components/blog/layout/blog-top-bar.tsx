"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { CTLogo } from "@/components/brand/logo";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

export function BlogTopBar() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full py-2.5 px-4">
      <div className="max-w-5xl mx-auto flex items-center h-11 px-4 lg:px-5 gap-5 bg-card/90 backdrop-blur-md border border-border/60 rounded-xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
          <CTLogo size={22} variant="primary" />
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            code<span className="text-primary">tail</span>
          </span>
        </Link>

        {/* Center nav */}
        <nav className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center gap-0.5">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-foreground bg-secondary cursor-pointer transition-colors duration-75"
            >
              Blog
            </Link>
            <Link
              href="/blog/python"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 cursor-pointer transition-colors duration-75"
            >
              Python
            </Link>
          </div>
        </nav>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 cursor-pointer transition-colors duration-75"
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 text-[12px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all duration-100"
          >
            <span className="hidden sm:inline">Try Codetail</span>
            <span className="sm:hidden">Try</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
