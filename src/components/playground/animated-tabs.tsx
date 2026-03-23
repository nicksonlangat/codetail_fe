"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    content:
      "This problem asks you to find the longest substring without repeating characters. A sliding window approach works well here — maintain a set of characters in the current window, and expand or contract the window as needed. The key insight is that when you encounter a duplicate, you can skip all characters up to and including the previous occurrence.",
  },
  {
    id: "solutions",
    label: "Solutions",
    content:
      "The optimal solution runs in O(n) time using a hash map to track the last seen index of each character. Two pointers define the current window: the right pointer advances each step, while the left pointer jumps forward whenever a repeated character is found. This avoids the O(n²) brute force of checking every possible substring.",
  },
  {
    id: "submissions",
    label: "Submissions",
    content:
      "You have 3 accepted submissions for this problem. Your fastest solution ran in 4ms (beats 97.2% of users) using the optimized sliding window approach. Your first attempt used a brute force nested loop and timed out on larger inputs. The second attempt was correct but used extra space with a full character frequency map.",
  },
  {
    id: "discussion",
    label: "Discussion",
    content:
      "42 comments on this problem. The top-voted discussion covers an edge case with empty strings that many solutions miss. Another popular thread compares the sliding window approach across different languages, noting that Python's dictionary lookups make the hash map approach particularly clean. Several users share follow-up problems that build on this technique.",
  },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

export function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="py-6">
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-4 py-2.5 text-[13px] font-medium cursor-pointer transition-all duration-500"
          >
            <span
              className={
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {tab.label}
            </span>

            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={spring}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="mt-6 min-h-[120px]">
        <AnimatePresence mode="wait">
          {tabs.map(
            (tab) =>
              tab.id === activeTab && (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tab.content}
                  </p>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
