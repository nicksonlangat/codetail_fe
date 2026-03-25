"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowLeft, Send, FileCode, Database, Sun, Moon, Loader2, CheckCircle2, XCircle, ArrowRight, Bot, Lightbulb, BookOpen, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Group as PanelGroup, Panel, Separator } from "react-resizable-panels";
import { TipTapRenderer } from "@/components/editors/tiptap-renderer";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), { ssr: false });

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

/* ── Mock data ── */
const PROBLEM = {
  title: "Design the Order Model",
  difficulty: "medium",
  concept: "Model Relationships",
  type: "Django Models",
  description: `<h3>Scenario</h3>
<p>You're building the backend for an e-commerce platform. The team needs an <code>Order</code> model that tracks customer purchases with line items, status workflow, and computed totals.</p>
<h3>Requirements</h3>
<ul>
<li>An <code>Order</code> belongs to a <strong>User</strong> (ForeignKey with CASCADE)</li>
<li>Status field using <strong>TextChoices</strong>: pending, processing, shipped, delivered, cancelled</li>
<li>Created and updated timestamps (<code>auto_now_add</code> / <code>auto_now</code>)</li>
<li>An <code>OrderItem</code> model with: order (FK), product_name, quantity, unit_price (DecimalField)</li>
<li>A <code>total</code> property on Order that computes the sum using <code>aggregate</code></li>
<li><code>unique_together</code> on OrderItem for (order, product_name)</li>
</ul>
<h3>What we're looking for</h3>
<ul>
<li>Correct field types — <strong>DecimalField</strong> for money, not FloatField</li>
<li>Proper use of TextChoices for status validation</li>
<li>Clean <code>__str__</code> methods</li>
<li>Meta class with ordering and constraints</li>
</ul>`,
  examples: [
    { input: "Order.objects.create(customer=user, status='pending')", output: "Order #1 — pending", explanation: "The __str__ method should return a readable representation with the order ID and current status." },
    { input: "order.total", output: "Decimal('89.97')", explanation: "The total property should use aggregate(Sum(F('quantity') * F('unit_price'))) with Coalesce to handle empty orders gracefully." },
  ],
  files: [
    { name: "models.py", language: "python", starterCode: `from django.db import models\nfrom django.conf import settings\n\n\nclass Order(models.Model):\n    # TODO: Define fields\n    # - customer (ForeignKey to AUTH_USER_MODEL)\n    # - status (CharField with TextChoices)\n    # - created_at (auto_now_add)\n    # - updated_at (auto_now)\n\n    class Meta:\n        ordering = ["-created_at"]\n\n    def __str__(self):\n        return f"Order #{self.pk} — {self.status}"\n\n    @property\n    def total(self):\n        # TODO: Compute total using aggregate\n        pass\n\n\nclass OrderItem(models.Model):\n    # TODO: Define fields\n    # - order (ForeignKey to Order)\n    # - product_name (CharField)\n    # - quantity (PositiveIntegerField)\n    # - unit_price (DecimalField)\n\n    class Meta:\n        pass  # TODO: unique_together\n\n    def __str__(self):\n        return f"{self.quantity}x {self.product_name}"\n` },
    { name: "admin.py", language: "python", starterCode: `from django.contrib import admin\nfrom .models import Order, OrderItem\n\n# TODO: Register with custom admin\n` },
  ],
};

const MOCK_REVIEW = {
  score: 72,
  summary: "Good structure with correct relationships, but a few important issues with field types and the total computation.",
  strengths: [
    "Correct use of ForeignKey with CASCADE for customer and order relationships",
    "TextChoices enum for status is the right pattern — gives you validation, admin dropdowns, and human-readable labels for free",
    "Good __str__ methods that make debugging and admin usage pleasant",
  ],
  issues: [
    "unit_price uses FloatField — this will cause rounding errors with currency. In production, a $19.99 item could become $19.990000000000002. Always use DecimalField(max_digits=10, decimal_places=2) for money.",
    "The total property iterates in Python with a for loop instead of using database-level aggregation. This means loading all OrderItems into memory. Use Order.items.aggregate(total=Sum(F('quantity') * F('unit_price'))) instead.",
    "Missing Coalesce wrapper on the aggregate — if an order has no items, Sum returns None, not 0. Wrap it: Coalesce(Sum(...), Decimal('0'))",
  ],
  suggestions: [
    "Add related_name='orders' to the customer FK so you can do user.orders.all() for reverse lookups",
    "Consider adding an index on status for faster filtering: class Meta: indexes = [models.Index(fields=['status'])]",
    "The unique_together constraint is correct but deprecated — use UniqueConstraint in constraints instead for forward compatibility",
  ],
};

type Tab = "review" | "hints" | "solution";

export default function DjangoChallengeDetail() {
  const { resolvedTheme, setTheme } = useTheme();
  const [activeFile, setActiveFile] = useState(0);
  const [codes, setCodes] = useState(PROBLEM.files.map((f) => f.starterCode));
  const [activeTab, setActiveTab] = useState<Tab>("review");
  const [submitting, setSubmitting] = useState(false);
  const [review, setReview] = useState<typeof MOCK_REVIEW | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setActiveTab("review");
    setReview(null);
    await new Promise((r) => setTimeout(r, 2500));
    setReview(MOCK_REVIEW);
    setSubmitting(false);
  };

  const tabs: { id: Tab; label: string; icon: typeof Bot }[] = [
    { id: "review", label: "AI Review", icon: Bot },
    { id: "hints", label: "Hints", icon: Lightbulb },
    { id: "solution", label: "Solution", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between h-10 px-6 border-b border-border bg-card flex-shrink-0">
        <Link href="/playground" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500">
          <ArrowLeft className="w-3 h-3" /> Playground
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium">{PROBLEM.title}</span>
          <span className="text-[10px] font-medium text-difficulty-medium">medium</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
            <Database className="w-3 h-3 inline mr-1" />Django
          </span>
        </div>
        <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500">
          <Sun className="w-3.5 h-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-3.5 h-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </div>

      <PanelGroup orientation="horizontal" className="flex-1 min-h-0">
        {/* Left: Description */}
        <Panel defaultSize={45} minSize={25}>
          <div className="h-full overflow-y-auto">
            <div className="px-7 py-6 space-y-5">
              <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">{PROBLEM.title}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-difficulty-medium/10 text-difficulty-medium">medium</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{PROBLEM.concept}</span>
                </div>
              </div>
              <div className="h-px bg-border" />
              <TipTapRenderer content={PROBLEM.description} />
              <div>
                <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase mb-2">Model Signature</h3>
                <div className="font-mono text-[12px] border border-border bg-muted/30 rounded-lg p-3.5">
                  <span className="text-primary">class</span> Order(models.Model):
                </div>
              </div>
              <div className="space-y-3">
                {PROBLEM.examples.map((ex, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="rounded-lg border border-border bg-muted/30 p-3.5 space-y-2">
                    <h3 className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Example {i + 1}</h3>
                    <div className="font-mono text-[11px] space-y-0.5 leading-relaxed">
                      <p><span className="text-muted-foreground">Input: </span><span className="text-foreground">{ex.input}</span></p>
                      <p><span className="text-muted-foreground">Output: </span><span className="text-primary font-medium">{ex.output}</span></p>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{ex.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Separator className="w-1 bg-border hover:bg-primary/30 transition-colors cursor-col-resize" />

        {/* Right */}
        <Panel defaultSize={55} minSize={25}>
          <PanelGroup orientation="vertical" className="h-full">
            <Panel defaultSize={60} minSize={20}>
              <div className="flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between px-2 h-9 border-b border-border bg-card flex-shrink-0">
                  <div className="flex items-center gap-0">
                    {PROBLEM.files.map((file, i) => (
                      <button key={file.name} onClick={() => setActiveFile(i)}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium cursor-pointer transition-all duration-500 ${
                          i === activeFile ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                        }`}>
                        <FileCode className="w-3 h-3" />
                        {file.name}
                        {i === activeFile && (
                          <motion.div layoutId="file-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { const next = [...codes]; next[activeFile] = PROBLEM.files[activeFile].starterCode; setCodes(next); }}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all duration-500" title="Reset">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} transition={spring} onClick={handleSubmit} disabled={submitting}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-primary-foreground px-3 py-1 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500">
                      {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      Submit for Review
                    </motion.button>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <MonacoEditor height="100%" language="python" value={codes[activeFile]}
                    theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                    onChange={(v) => { const next = [...codes]; next[activeFile] = v ?? ""; setCodes(next); }}
                    options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", scrollBeyondLastLine: false, wordWrap: "on", tabSize: 4, automaticLayout: true, padding: { top: 12 }, renderLineHighlight: "gutter" }}
                  />
                </div>
              </div>
            </Panel>

            <Separator className="h-1 bg-border hover:bg-primary/30 transition-colors cursor-row-resize" />

            <Panel defaultSize={40} minSize={15}>
              <div className="flex flex-col h-full overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-0 px-2 border-b border-border bg-card flex-shrink-0">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium cursor-pointer transition-all duration-500 ${
                          activeTab === tab.id ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                        }`}>
                        <Icon className="w-3 h-3" />
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div layoutId="django-bottom-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab === "review" && (
                    <>
                      {submitting && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 py-8 justify-center">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-[12px] text-muted-foreground">AI is reviewing your code...</span>
                        </motion.div>
                      )}

                      {!submitting && review && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono ${
                              review.score >= 90 ? "bg-green-500/10 text-green-500"
                              : review.score >= 70 ? "bg-primary/10 text-primary"
                              : review.score >= 50 ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-500"
                            }`}>{review.score}</div>
                            <p className="text-[13px] text-foreground flex-1">{review.summary}</p>
                          </div>

                          {review.strengths.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-semibold uppercase tracking-wide text-green-500 mb-1.5">Strengths</h4>
                              <div className="space-y-1.5">
                                {review.strengths.map((s, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px]">
                                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-foreground/80 leading-relaxed">{s}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {review.issues.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-semibold uppercase tracking-wide text-red-500 mb-1.5">Issues</h4>
                              <div className="space-y-1.5">
                                {review.issues.map((s, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px]">
                                    <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-foreground/80 leading-relaxed">{s}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {review.suggestions.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-1.5">Next Steps</h4>
                              <div className="space-y-1.5">
                                {review.suggestions.map((s, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px]">
                                    <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-foreground/80 leading-relaxed">{s}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500">
                            <Bot className="w-3 h-3" /> Review Again
                          </motion.button>
                        </motion.div>
                      )}

                      {!submitting && !review && (
                        <div className="space-y-3">
                          <p className="text-[12px] text-muted-foreground">
                            Django challenges are reviewed by AI. Click <strong>Submit for Review</strong> to get feedback on your model design, field choices, and conventions.
                          </p>
                          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">AI will check:</p>
                            <ul className="space-y-1">
                              {["DecimalField for money (not FloatField)", "TextChoices for status validation", "Proper ForeignKey with on_delete", "aggregate() for computed totals", "unique_together constraint", "Clean __str__ methods"].map((item) => (
                                <li key={item} className="flex items-start gap-1.5 text-[11px] text-foreground/70">
                                  <span className="text-primary mt-0.5">•</span>{item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "hints" && (
                    <div className="space-y-3">
                      <p className="text-[12px] text-muted-foreground">Get AI-powered hints based on your current code.</p>
                      <motion.button whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500">
                        <Lightbulb className="w-3 h-3" /> Get Hint
                      </motion.button>
                    </div>
                  )}

                  {activeTab === "solution" && (
                    <div className="space-y-3">
                      <p className="text-[12px] text-muted-foreground">View the model solution with step-by-step explanation.</p>
                      <motion.button whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-500">
                        <BookOpen className="w-3 h-3" /> View Solution
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
