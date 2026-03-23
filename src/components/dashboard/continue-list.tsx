"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code, Database, GitBranch } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface PathProgress {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  completed: number;
  total: number;
  pct: number;
  topics: string[];
}

const startedPaths: PathProgress[] = [
  {
    id: "arrays-strings",
    title: "Arrays & Strings",
    description: "Master array manipulation and string algorithms",
    icon: Code,
    completed: 7,
    total: 10,
    pct: 70,
    topics: ["Arrays", "Strings"],
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Build and traverse linked list data structures",
    icon: GitBranch,
    completed: 3,
    total: 8,
    pct: 38,
    topics: ["Linked Lists", "Pointers"],
  },
  {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    description: "Learn essential database query patterns",
    icon: Database,
    completed: 2,
    total: 6,
    pct: 33,
    topics: ["SQL", "Databases"],
  },
];

export function ContinueList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Continue where you left off
        </h2>
        <Link
          href="/paths"
          className="text-[10px] text-muted-foreground/40 hover:text-foreground transition-colors duration-75"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {startedPaths.map((path, i) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <Link href={`/paths/${path.id}`}>
              <Card className="hover:bg-secondary/40 transition-colors duration-75 group cursor-pointer">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <path.icon className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-foreground truncate">
                          {path.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                        {path.description}
                      </p>

                      <div className="flex items-center gap-3 mt-2.5">
                        <Progress value={path.pct} className="h-1 flex-1" />
                        <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                          {path.completed}/{path.total}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2">
                        {path.topics.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="absolute top-4 right-4 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-75" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
