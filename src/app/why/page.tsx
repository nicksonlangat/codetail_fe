"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Heart } from "lucide-react";
import { CTLogo } from "@/components/brand/logo";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function WhyPage() {
  return (
    <div className="dark bg-background text-foreground min-h-screen">

      {/* Nav */}
      <header className="fixed top-0 z-50 w-full py-3 px-4">
        <div className="max-w-[700px] mx-auto flex items-center justify-between h-12 px-5 bg-card/80 backdrop-blur-xl border border-border rounded-2xl">
          <Link href="/" className="flex items-center gap-2">
            <CTLogo size={24} variant="primary" />
            <span className="text-[14px] font-semibold tracking-tight">
              code<span className="text-primary">tail</span>
            </span>
          </Link>
          <Link href="/" className="text-[13px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
        </div>
      </header>

      {/* Letter */}
      <main className="pt-32 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-[640px] mx-auto"
        >
          {/* The card */}
          <div className="relative">
            {/* Paper texture — subtle border + shadow */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[0_8px_60px_-12px_hsl(164_70%_40%/0.08)]">

              {/* Top accent line */}
              <div className="h-[3px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <div className="px-8 md:px-12 py-10 md:py-14">
                {/* Date */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[11px] text-muted-foreground/40 font-mono mb-8"
                >
                  March 2026
                </motion.p>

                {/* Body */}
                <div className="space-y-6 text-[15px] leading-[1.85] text-foreground/80">
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease }}>
                    Something broke along the way.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ease }}>
                    Somewhere between the first <span className="font-mono text-primary text-[14px]">print(&quot;hello world&quot;)</span> and the hundredth LeetCode grind, we forgot why we started writing code in the first place.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, ease }}>
                    It wasn&apos;t to reverse a linked list in 12 minutes. It wasn&apos;t to memorize dynamic programming templates. It wasn&apos;t to perform for an interviewer who hasn&apos;t shipped production code in three years.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, ease }}>
                    It was because <span className="text-foreground font-medium">building things felt like magic</span>.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, ease }}>
                    Writing a clean model that maps perfectly to the domain. A view that handles every edge case. A service layer so well-separated you can test it without Django even running. That feeling when a complex query finally clicks. Not because you memorized a pattern, but because you <em className="not-italic text-foreground font-medium">understood</em> the problem.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"
                  />

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, ease }}>
                    <span className="text-foreground font-semibold">Codetail is not another LeetCode.</span>
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, ease }}>
                    We don&apos;t time you. We don&apos;t rank you. We don&apos;t make you feel stupid for not knowing the optimal solution to a problem that has nothing to do with your actual job.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, ease }}>
                    Instead, we give you <span className="text-foreground font-medium">real problems</span>. The kind you&apos;d face building a product. Design an Order model with proper field types. Fix the N+1 query that&apos;s making your API slow. Refactor a god function into a clean service layer. Write a custom manager that makes your codebase a joy to read.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, ease }}>
                    And when you submit, an AI reviews your code like a senior developer would. Not &quot;wrong answer, try again.&quot; But: <span className="text-primary font-medium italic">&quot;This works, but here&apos;s why DecimalField matters for money, and here&apos;s what would break in production if you used FloatField.&quot;</span>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"
                  />

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, ease }}>
                    We built Codetail because we believe the best engineers aren&apos;t the ones who can solve puzzles the fastest. They&apos;re the ones who <span className="text-foreground font-medium">care about their craft</span>. Who take pride in clean architecture, readable code, and systems that don&apos;t break at 3am.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, ease }}>
                    If that sounds like you, welcome home.
                  </motion.p>
                </div>

                {/* Signature */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, ease }}
                  className="mt-10 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[13px] text-muted-foreground">Built with love for the craft,</span>
                  </div>
                  <p className="text-[15px] font-semibold text-foreground ml-5.5">Nick</p>
                  <p className="text-[11px] text-muted-foreground/50 ml-5.5">Founder, Codetail</p>
                </motion.div>
              </div>
            </div>

            {/* Subtle glow behind card */}
            <div className="absolute -inset-4 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(164_70%_40%/0.04),transparent_70%)] rounded-3xl" />
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, ease }}
            className="text-center mt-12"
          >
            <Link href="/signup"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl cursor-pointer transition-all shadow-[0_2px_24px_-4px_hsl(164_70%_40%/0.3)]">
              Start practicing <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11px] text-muted-foreground/40 mt-3">Free forever. Pro when you&apos;re ready.</p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-[640px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CTLogo size={16} variant="primary" />
            <span className="text-[12px] font-semibold">code<span className="text-primary">tail</span></span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/pricing" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors">Pricing</Link>
            <Link href="/privacy" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
