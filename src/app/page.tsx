"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Brain, Sparkles, BarChart3, Layers, Zap, Trophy, Flame, Bot, Star, Gem } from "lucide-react";
import { BentoFeatures } from "@/components/landing/bento-features";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const rotatingWords = ["django_models", "two_sum", "serializers", "decorators", "querysets"];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % rotatingWords.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-block relative overflow-hidden h-[1.15em] align-bottom min-w-[8ch]">
      {rotatingWords.map((word, i) => (
        <motion.span key={word} className="absolute left-0 font-mono text-primary"
          initial={{ y: "110%", opacity: 0 }}
          animate={i === idx ? { y: "0%", opacity: 1 } : { y: "-110%", opacity: 0 }}
          transition={{ duration: 0.5, ease }} />
      ))}
      <span className="font-mono text-primary">{rotatingWords[idx]}</span>
    </span>
  );
}

const features = [
  { icon: Brain, title: "AI Code Reviews", description: "Get senior-dev-level feedback on every solution. The AI teaches you why, not just what." },
  { icon: Layers, title: "Structured Paths", description: "Python, Django Models, Django Fundamentals, REST Framework. Every problem builds on the last." },
  { icon: Sparkles, title: "AI-Generated Challenges", description: "Never run out of practice. Generate fresh problems on any topic, tailored to your level." },
  { icon: BarChart3, title: "Progress Analytics", description: "Sparkline charts, heatmaps, streak tracking, and weak area detection. See yourself improve." },
  { icon: Zap, title: "Instant Execution", description: "Run Python code against test cases in milliseconds. Know where you stand before you submit." },
  { icon: Trophy, title: "Real-World Problems", description: "No academic puzzles. Build invoice calculators, design tagging systems, fix production bugs." },
];

const steps = [
  { n: "01", title: "Pick a path", desc: "Python fundamentals, Django models, REST Framework. Each path is a curated sequence of real-world challenges." },
  { n: "02", title: "Write real code", desc: "Full code editor with syntax highlighting. Multi-file support for Django. Run against test cases instantly." },
  { n: "03", title: "Get AI feedback", desc: "AI reviews your code like a senior developer. Strengths, issues, next steps. Learn the why behind every pattern." },
];

export default function LandingPage() {
  return (
    <div className="dark bg-background text-foreground overflow-x-hidden min-h-screen">

      {/* ── NAV — floating pill ── */}
      <header className="fixed top-0 z-50 w-full py-3 px-4">
        <div className="max-w-260 mx-auto flex items-center h-12 px-1 bg-card/80 backdrop-blur-xl border border-border rounded-2xl">
          {/* Logo — far left */}
          <Link href="/" className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
              <Gem className="w-4 h-4 text-primary" />
            </div>
          </Link>

          {/* Nav — centered */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {["Features", "Method", "Pricing"].map((l) => (
              <Link key={l} href={l === "Pricing" ? "/pricing" : `#${l.toLowerCase()}`}
                className="text-[13px] text-muted-foreground hover:text-foreground px-3 py-1.5 transition-all cursor-pointer">
                {l}
              </Link>
            ))}
          </nav>

          {/* Auth — far right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/signin" className="text-[13px] text-white bg-muted rounded-full hover:text-foreground px-3 py-1.5 transition-colors cursor-pointer">
              Login
            </Link>
            <Link href="/signup"
              className="text-[13px] bg-white text-muted font-medium px-4 py-1.5 rounded-full border border-border hover:border-muted-foreground/40 transition-all cursor-pointer">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-275 mx-auto px-6 relative">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-accent mb-6">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-medium text-primary tracking-wide">Now with AI-generated challenges</span>
                </div>

                <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.08] tracking-[-0.035em] mb-5">
                  Practice coding the way
                  <br />
                  <span className="italic font-normal text-muted-foreground">you actually learn</span>
                </h1>

                <p className="text-[16px] text-muted-foreground/70 leading-[1.7] max-w-md mb-4">
                  Real-world challenges, AI reviews that teach you why, and structured paths from Python to Django. Stop memorizing — start building intuition.
                </p>

              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap items-center gap-3">
                <Link href="/signup"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl transition-all cursor-pointer shadow-[0_2px_24px_-4px_hsl(164_70%_40%/0.3)]">
                  Get Started
                </Link>
                <Link href="#method"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-background bg-foreground hover:bg-foreground/90 px-6 py-3 rounded-xl transition-all cursor-pointer">
                  Watch Demo
                </Link>
              </motion.div>
            </div>

            {/* Tilted dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateY: -5 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="hidden md:block"
              style={{ perspective: "1200px" }}
            >
              <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl"
                style={{ transform: "perspective(1200px) rotateY(-6deg) rotateX(2deg)" }}>
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                    <span className="ml-3 text-[11px] text-muted-foreground/50 font-mono">codetail — dashboard</span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Problems Solved", value: "47" },
                      { label: "Accuracy", value: "84%" },
                      { label: "Avg Score", value: "78" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg bg-secondary border border-border p-3">
                        <p className="text-[9px] text-muted-foreground/60">{s.label}</p>
                        <p className="text-[18px] font-bold font-mono text-foreground/80 mt-0.5">{s.value}</p>
                        <div className="h-6 mt-2 flex items-end gap-[2px]">
                          {[3, 5, 4, 7, 6, 8, 7, 9, 8, 10, 9, 11].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/40 rounded-sm" style={{ height: `${h * 2.5}px` }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-secondary border border-border overflow-hidden">
                    <div className="px-3 py-2 border-b border-border">
                      <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Recent Activity</span>
                    </div>
                    {[
                      { title: "Design the Order Model", diff: "medium", status: "solved" },
                      { title: "Fix the N+1 Query Bug", diff: "medium", status: "solved" },
                      { title: "Custom Manager for Published", diff: "medium", status: "attempted" },
                      { title: "Two Sum", diff: "easy", status: "solved" },
                    ].map((p) => (
                      <div key={p.title} className="flex items-center gap-2 px-3 py-2 border-b border-border/50 last:border-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${p.status === "solved" ? "bg-success" : "bg-warning"}`} />
                        <span className="text-[11px] text-muted-foreground flex-1 truncate">{p.title}</span>
                        <span className={`text-[9px] font-medium ${p.diff === "easy" ? "text-difficulty-easy" : "text-difficulty-medium"}`}>{p.diff}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-10 border-y border-border">
        <div className="max-w-[1100px] mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30 text-center mb-6">
            Trusted by developers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Google", "Safaricom", "Andela", "Microsoft", "Shopify", "Flutterwave"].map((name) => (
              <span key={name} className="text-[15px] font-semibold text-muted-foreground/20 tracking-tight select-none">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — Bento Grid ── */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.03em] leading-[1.1]">
              Everything you need to
              <br />
              <span className="text-muted-foreground">write better code, faster</span>
            </h2>
          </motion.div>

          <BentoFeatures />
        </div>
      </section>

      {/* ── METHOD ── */}
      <section id="method" className="py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24">
            <div className="md:sticky md:top-32 md:self-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-accent mb-4">
                <Bot className="w-3 h-3 text-primary" />
                <span className="text-[11px] font-medium text-primary">How it works</span>
              </div>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-4">
                We don&apos;t hand you
                <br />
                <span className="text-muted-foreground">answers.</span>
              </h2>
              <p className="text-[14px] text-muted-foreground/60 leading-relaxed max-w-sm">
                Most platforms teach pattern matching. Codetail builds problem-solving intuition through real-world practice and AI feedback.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div key={step.n}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card p-5 hover:border-muted-foreground/20 transition-all duration-500">
                  <span className="text-[11px] font-mono text-primary">{step.n}</span>
                  <h3 className="text-[16px] font-semibold mt-1.5 mb-1.5">{step.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Flame className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.03em] leading-[1.1] mb-3">
              Ready to level up?
            </h2>
            <p className="text-[15px] text-muted-foreground/60 mb-8 max-w-md mx-auto">
              Join developers who practice with real-world problems, not academic puzzles.
            </p>
            <Link href="/signup"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-7 py-3.5 rounded-xl transition-all cursor-pointer shadow-[0_2px_24px_-4px_hsl(164_70%_40%/0.3)]">
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
                <Code2 className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-[13px] font-semibold tracking-tight">
                code<span className="text-primary">tail</span>
              </span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/pricing" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors">Pricing</Link>
              <Link href="/privacy" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors">Terms</Link>
              <Link href="/refund" className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground cursor-pointer transition-colors">Refunds</Link>
            </nav>
          </div>
          <p className="text-[10px] text-muted-foreground/25 mt-4">
            &copy; {new Date().getFullYear()} Codetail. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
