"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

const faqs = [
  {
    question: "How does the AI feedback work?",
    answer:
      "Our AI analyzes your code submissions in real-time, providing line-by-line suggestions for improvement. It considers time complexity, space efficiency, and code readability to give you actionable feedback within seconds of submission.",
  },
  {
    question: "Can I use any programming language?",
    answer:
      "We currently support Python, JavaScript, TypeScript, Java, C++, Go, and Rust. Each language has full syntax highlighting, auto-completion, and language-specific feedback. We are actively adding more languages based on community demand.",
  },
  {
    question: "What learning paths are available?",
    answer:
      "We offer structured paths for Data Structures, Algorithms, System Design, and interview preparation. Each path is curated by industry engineers and adapts to your skill level, progressively increasing difficulty as you improve.",
  },
  {
    question: "How does the streak system work?",
    answer:
      "Solve at least one problem per day to maintain your streak. Streaks unlock achievement badges and bonus XP. If you miss a day, you can use a streak freeze (earned through consistent practice) to preserve your progress.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes! The free tier includes access to 50+ problems, basic AI feedback, and community discussions. Premium unlocks all 500+ problems, advanced AI analysis, mock interviews, and personalized learning paths.",
  },
];

export function AccordionFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-2 py-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            whileHover={{ y: -1 }}
            transition={spring}
            className={`rounded-xl bg-card border transition-all duration-500 ${
              isOpen
                ? "border-l-[3px] border-l-primary border-border/50"
                : "border-border/30"
            }`}
          >
            <button
              onClick={() => toggle(i)}
              className="cursor-pointer w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-[13px] font-medium text-foreground tracking-tight">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={spring}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={spring}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ...spring, delay: 0.05 }}
                    className="px-4 pb-3"
                  >
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {i < faqs.length - 1 && !isOpen && (
              <div className="border-b border-border/20 mx-4" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
