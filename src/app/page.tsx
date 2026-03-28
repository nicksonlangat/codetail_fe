"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles, BarChart3, Layers, Zap, Trophy, Flame, Bot, Star, Gem } from "lucide-react";
import { CTLogo } from "@/components/brand/logo";
import { BentoFeatures } from "@/components/landing/bento-features";
import { CelebrationCTA } from "@/components/landing/celebration-cta";

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
        <div className="max-w-265 mx-auto flex items-center h-12 px-3 bg-card/80 backdrop-blur-xl border border-border rounded-2xl">
          {/* Logo — far left */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <CTLogo size={26} variant="primary" />
            <span className="text-[14px] font-semibold tracking-tight">
              code<span className="text-primary">tail</span>
            </span>
          </Link>

          {/* Nav — centered */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {["Features", "Why", "Method", "Pricing"].map((l) => (
              <Link key={l} href={l === "Pricing" ? "/pricing" : l === "Why" ? "/why" : `#${l.toLowerCase()}`}
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
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-accent mb-6">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-medium text-primary tracking-wide">Now with AI-generated challenges</span>
                </div>

                <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.08] tracking-[-0.035em] mb-5">
                  Sharpen your craft.
                  <br />
                  <span className="italic font-normal text-muted-foreground">Write beautiful code.</span>
                </h1>

                <p className="text-[16px] text-muted-foreground/70 leading-[1.7] max-w-md mb-4">
                  Real-world problems. AI reviews that teach you why, not just what. Structured paths from Python to Django. For developers who care about their code.
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

            {/* Hero illustration — code editor + AI review */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateY: -5 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="hidden md:block"
              style={{ perspective: "1200px" }}
            >
              <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-[0_8px_40px_-8px_hsl(164_70%_40%/0.1)]"
                style={{ transform: "perspective(1200px) rotateY(-4deg) rotateX(1deg)" }}>
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
                  </div>
                  <div className="flex gap-0 ml-3">
                    <span className="text-[10px] px-2 py-0.5 font-mono text-foreground/70 bg-secondary/50 rounded">models.py</span>
                    <span className="text-[10px] px-2 py-0.5 font-mono text-muted-foreground/30">views.py</span>
                  </div>
                </div>

                {/* Split view: code left, review right */}
                <div className="flex divide-x divide-border">
                  {/* Code */}
                  <div className="flex-1 px-4 py-4 font-mono text-[11px] leading-[2]">
                    <div><span className="text-muted-foreground/20 mr-2">1</span><span className="text-primary">class</span> <span className="text-[hsl(38_85%_62%)]">Order</span><span className="text-muted-foreground/50">(models.Model):</span></div>
                    <div><span className="text-muted-foreground/20 mr-2">2</span><span className="text-foreground/60 pl-3">customer</span> <span className="text-muted-foreground/40">= models.</span><span className="text-[hsl(217_80%_68%)]">ForeignKey</span><span className="text-muted-foreground/40">(</span></div>
                    <div><span className="text-muted-foreground/20 mr-2">3</span><span className="text-foreground/60 pl-6">User, </span><span className="text-[hsl(0_68%_70%)]">on_delete</span><span className="text-muted-foreground/40">=</span><span className="text-primary">CASCADE</span></div>
                    <div><span className="text-muted-foreground/20 mr-2">4</span><span className="text-muted-foreground/40 pl-3">)</span></div>
                    <div><span className="text-muted-foreground/20 mr-2">5</span><span className="text-foreground/60 pl-3">status</span> <span className="text-muted-foreground/40">= models.</span><span className="text-[hsl(217_80%_68%)]">CharField</span><span className="text-muted-foreground/40">(</span></div>
                    <div><span className="text-muted-foreground/20 mr-2">6</span><span className="text-[hsl(0_68%_70%)] pl-6">choices</span><span className="text-muted-foreground/40">=Status.choices</span></div>
                    <div><span className="text-muted-foreground/20 mr-2">7</span><span className="text-muted-foreground/40 pl-3">)</span></div>
                    <div className="mt-1"><span className="text-muted-foreground/20 mr-2">8</span><span className="text-primary pl-3">@property</span></div>
                    <div><span className="text-muted-foreground/20 mr-2">9</span><span className="text-primary pl-3">def</span> <span className="text-[hsl(38_85%_62%)]">total</span><span className="text-muted-foreground/40">(self):</span></div>
                    <div><span className="text-muted-foreground/15 mr-2">10</span><span className="text-primary pl-6">return</span> <span className="text-foreground/50">self.items.</span><span className="text-[hsl(217_80%_68%)]">aggregate</span><span className="text-muted-foreground/40">(...)</span></div>
                  </div>

                  {/* AI Review */}
                  <div className="w-[220px] px-4 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
                        <span className="text-[11px] font-bold font-mono text-primary">92</span>
                      </div>
                      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                        <motion.div className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }} animate={{ width: "92%" }}
                          transition={{ duration: 1.5, delay: 1 }} />
                      </div>
                    </div>

                    <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider font-medium mb-2">AI Review</p>

                    <div className="space-y-2">
                      {[
                        { good: true, text: "Correct FK with CASCADE" },
                        { good: true, text: "TextChoices for validation" },
                        { good: true, text: "Clean property for total" },
                        { good: false, text: "Add Coalesce for empty" },
                      ].map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.15 }}
                          className="flex items-start gap-1.5">
                          <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${item.good ? "bg-success" : "bg-warning"}`} />
                          <span className="text-[10px] text-muted-foreground/60 leading-tight">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/30">
                      <p className="text-[9px] text-muted-foreground/30 leading-relaxed italic">
                        &ldquo;Use Coalesce to handle empty querysets gracefully. Without it, Sum returns None.&rdquo;
                      </p>
                    </div>
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
      {/* <section className="py-24 md:py-32 border-t border-border">
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
      </section> */}

      <CelebrationCTA />

      {/* ── FOOTER ── */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-265 mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CTLogo size={20} variant="primary" />
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
