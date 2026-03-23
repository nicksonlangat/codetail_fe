"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Brain, Sparkles, BarChart3, Layers, Zap, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const rotatingWords = ["two_sum", "lru_cache", "merge_sort", "rate_limiter", "bfs_graph"];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % rotatingWords.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-block relative overflow-hidden h-[1.15em] align-bottom min-w-[7ch]">
      {rotatingWords.map((word, i) => (
        <motion.span
          key={word}
          className="absolute left-0 font-mono text-primary"
          initial={{ y: "110%", opacity: 0 }}
          animate={i === idx ? { y: "0%", opacity: 1 } : { y: "-110%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

const features: { icon: typeof Brain; title: string; description: string }[] = [
  { icon: Brain, title: "Socratic AI Tutor", description: "Guides you with questions, not answers. Build real problem-solving intuition through dialogue." },
  { icon: Layers, title: "Structured Paths", description: "Curated sequences across DSA, SQL, and System Design. Every problem builds on the last." },
  { icon: Sparkles, title: "Smart Code Editor", description: "Full editor with syntax highlighting, instant output, and keyboard shortcuts built in." },
  { icon: BarChart3, title: "Progress Analytics", description: "Streaks, heatmaps, and session data. See yourself improve with every practice session." },
  { icon: Zap, title: "Instant Feedback", description: "Run code against test cases in milliseconds. Know where you stand before you submit." },
  { icon: Trophy, title: "150+ Problems", description: "Hand-picked challenges across three domains. From fundamentals to FAANG-level difficulty." },
];

const steps = [
  { n: "01", title: "Pick your battleground", desc: "DSA fundamentals, system design architecture, or SQL mastery. Each path is a curated sequence." },
  { n: "02", title: "Solve with a Socratic AI", desc: "Stuck? The AI asks guiding questions. It meets you where you are and nudges you toward the insight." },
  { n: "03", title: "Review and internalize", desc: "After each problem, see time complexity analysis, alternative approaches, and pattern connections." },
];

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[10px] bg-primary flex items-center justify-center">
                <Code2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold tracking-tight">codetail</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {["Features", "Method"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-all">
                  {l}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">
              Log in
            </Link>
            <Link href="/dashboard" className={cn(buttonVariants())}>Start free &rarr;</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
              <p className="text-[13px] font-mono text-primary tracking-wide mb-6">
                &rarr; Interview prep, reimagined
              </p>
              <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.035em] mb-4">
                Learn to solve problems,<br />not memorize them.
              </h1>
              <div className="font-mono text-[15px] text-muted-foreground mb-8">
                Currently solving: <RotatingWord />
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-[1.6] max-w-lg mb-12">
                An AI tutor that teaches you{" "}
                <em className="not-italic font-medium text-foreground">how to think</em> about
                problems &mdash; not just what the answer is. DSA. System design. SQL.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-wrap items-center gap-4">
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 text-[15px] rounded-xl shadow-[0_2px_20px_-4px_hsl(var(--primary)/0.25)] gap-3")}>
                  Start practicing
                  <ArrowRight className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/dashboard" className="text-[15px] text-muted-foreground hover:text-foreground px-5 py-3.5 transition-colors">
                Browse 150+ problems
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-10 border-y border-border/40">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-muted-foreground/40 text-center mb-6">
            Engineers from these companies practice here
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Google", "Meta", "Amazon", "Stripe", "Shopify", "Uber"].map((name) => (
              <span key={name} className="text-[15px] font-semibold text-muted-foreground/25 tracking-tight select-none">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold tracking-[-0.035em] leading-[1.08]">
              Built for how you actually learn.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold mb-2">{f.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section id="method" className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24">
            <div className="md:sticky md:top-32 md:self-start">
              <p className="text-[13px] font-mono text-primary tracking-wide mb-4">&rarr; The method</p>
              <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-semibold tracking-[-0.03em] leading-[1.1] mb-6">
                We don&apos;t hand you<br />answers.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                Most platforms teach pattern matching. Ours builds problem-solving intuition through Socratic dialogue.
              </p>
            </div>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div key={step.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="rounded-xl border border-border bg-card p-6">
                  <span className="text-[12px] font-mono text-primary">{step.n}</span>
                  <h3 className="text-[17px] font-semibold mt-2 mb-2">{step.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border/40">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.03em] leading-[1.1] mb-4">
              Ready to level up?
            </h2>
            <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of engineers who practice smarter, not harder.
            </p>
            <Link href="/signin" className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 text-[15px] rounded-xl shadow-[0_2px_20px_-4px_hsl(var(--primary)/0.25)] gap-3")}>
                Get started free
                <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-border/40">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[8px] bg-primary flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">codetail</span>
          </div>
          <p className="text-[12px] text-muted-foreground">
            &copy; {new Date().getFullYear()} codetail. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
