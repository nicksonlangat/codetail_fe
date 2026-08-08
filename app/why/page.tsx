"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function WhyPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      <Topbar />

      <main className="flex-1 pt-28 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-160 mx-auto"
        >
          <div className="relative">
            <div className="rounded-2xl border border-brand-border bg-white overflow-hidden shadow-2xl shadow-brand-primary/5">
              <div className="h-[3px] bg-linear-to-r from-transparent via-brand-primary/60 to-transparent" />

              <div className="px-8 md:px-12 py-10 md:py-14">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-[11px] text-brand-text-subtle font-mono mb-8"
                >
                  March 2026
                </motion.p>

                <div className="space-y-6 text-[15px] leading-[1.85] text-brand-text-muted">
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ease }}>
                    Something broke along the way.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ease }}>
                    Somewhere between the first{" "}
                    <span className="font-mono text-brand-primary text-[14px]">
                      print(&quot;hello world&quot;)
                    </span>{" "}
                    and the hundredth LeetCode grind, we forgot why we started writing code in the
                    first place.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, ease }}>
                    It wasn&apos;t to reverse a linked list in 12 minutes. It wasn&apos;t to
                    memorize dynamic programming templates. It wasn&apos;t to perform for an
                    interviewer who hasn&apos;t shipped production code in three years.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, ease }}>
                    It was because{" "}
                    <span className="text-brand-text font-medium">
                      building things felt like magic
                    </span>
                    .
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, ease }}>
                    Writing a clean model that maps perfectly to the domain. A view that handles
                    every edge case. A service layer so well-separated you can test it without
                    Django even running. That feeling when a complex query finally clicks. Not
                    because you memorized a pattern, but because you{" "}
                    <em className="not-italic text-brand-text font-medium">understood</em> the
                    problem.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="h-px bg-linear-to-r from-transparent via-brand-border to-transparent my-8"
                  />

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, ease }}>
                    <span className="text-brand-text font-semibold">
                      Codetail is not another LeetCode.
                    </span>
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, ease }}>
                    We don&apos;t time you. We don&apos;t rank you. We don&apos;t make you feel
                    stupid for not knowing the optimal solution to a problem that has nothing to
                    do with your actual job.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, ease }}>
                    Instead, we give you{" "}
                    <span className="text-brand-text font-medium">real problems</span>. The kind
                    you&apos;d face building a product. Design an Order model with proper field
                    types. Fix the N+1 query that&apos;s making your API slow. Refactor a god
                    function into a clean service layer. Write a custom manager that makes your
                    codebase a joy to read.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, ease }}>
                    And when you submit, an AI reviews your code like a senior developer would.
                    Not &quot;wrong answer, try again.&quot; But:{" "}
                    <span className="text-brand-primary font-medium italic">
                      &quot;This works, but here&apos;s why DecimalField matters for money, and
                      here&apos;s what would break in production if you used FloatField.&quot;
                    </span>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="h-px bg-linear-to-r from-transparent via-brand-border to-transparent my-8"
                  />

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, ease }}>
                    We built Codetail because we believe the best engineers aren&apos;t the ones
                    who can solve puzzles the fastest. They&apos;re the ones who{" "}
                    <span className="text-brand-text font-medium">care about their craft</span>.
                    Who take pride in clean architecture, readable code, and systems that
                    don&apos;t break at 3am.
                  </motion.p>

                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, ease }}>
                    If that sounds like you, welcome home.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, ease }}
                  className="mt-10 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="size-3.5 text-brand-primary" />
                    <span className="text-[13px] text-brand-text-muted">
                      Built with love for the craft,
                    </span>
                  </div>
                  <p className="text-[15px] font-semibold text-brand-text ml-5.5">Nick</p>
                  <p className="text-[11px] text-brand-text-subtle ml-5.5">Founder, Codetail</p>
                </motion.div>
              </div>
            </div>

            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-3xl bg-brand-primary/5 blur-2xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, ease }}
            className="text-center mt-12"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover px-6 py-3 rounded-lg cursor-pointer transition-all duration-500"
            >
              Start practicing <ArrowRight className="size-4" />
            </Link>
            <p className="text-[11px] text-brand-text-subtle mt-3">
              Free forever. Pro when you&apos;re ready.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
