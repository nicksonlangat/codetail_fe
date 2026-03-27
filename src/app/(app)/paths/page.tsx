"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPaths, type PathResponse } from "@/lib/api/paths";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function PathsPage() {
  const [stack, setStack] = useState<string>("python");

  const { data: paths, isLoading } = useQuery({
    queryKey: ["paths", stack],
    queryFn: () => getPaths(stack === "all" ? undefined : stack),
  });

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
        <h1 className="text-[15px] font-semibold tracking-tight">Learning Paths</h1>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Structured tracks to guide your practice.
        </p>
      </motion.div>

      <Tabs defaultValue="python" onValueChange={setStack}>
        <TabsList>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="django">Django</TabsTrigger>
          <TabsTrigger value="fastapi">FastAPI</TabsTrigger>
          <TabsTrigger value="sql">SQL</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={stack}>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-muted animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                      <div className="flex gap-2">
                        <div className="h-3 w-14 bg-muted rounded-full animate-pulse" />
                        <div className="h-3 w-20 bg-muted rounded-full animate-pulse" />
                      </div>
                      <div className="h-3 w-full bg-muted rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !Array.isArray(paths) || !paths.length ? (
            <div className="text-center py-16">
              <p className="text-[13px] text-muted-foreground">No paths available for this stack yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {(Array.isArray(paths) ? paths : []).map((path, i) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                >
                  <PathCard path={path} />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function PathCard({ path }: { path: PathResponse }) {
  const Icon = getIcon(path.icon);
  const diffColor = path.difficulty === "beginner"
    ? "text-difficulty-easy" : path.difficulty === "intermediate"
    ? "text-difficulty-medium" : "text-difficulty-hard";

  return (
    <Link href={`/paths/${path.slug}`} className="block cursor-pointer">
      <div className="relative w-full text-left rounded-xl border border-border bg-card hover:bg-secondary/40 p-5 transition-all duration-500 group overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-secondary text-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold">{path.title}</span>
              <Badge variant="secondary" className={`text-[10px] px-1.5 py-px h-auto ${diffColor}`}>
                {path.difficulty}
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{path.description}</p>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                {path.problem_count} problems
              </span>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-[10px] text-muted-foreground capitalize">{path.stack}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              {path.topics.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 mt-1 flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
