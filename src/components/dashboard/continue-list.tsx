"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboard } from "@/lib/api/progress";
import { getIcon } from "@/lib/icons";

export function ContinueList() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 30000,
  });

  const paths = dashboard?.active_paths ?? [];

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="h-2.5 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!paths.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Continue where you left off
        </h2>
        <Link href="/paths"
          className="text-[10px] text-muted-foreground/40 hover:text-foreground cursor-pointer transition-colors duration-75">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {paths.slice(0, 3).map((path, i) => {
          const Icon = getIcon(path.path_icon);
          return (
            <motion.div key={path.path_id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}>
              <Link href={`/paths/${path.path_slug}`}>
                <Card className="hover:bg-secondary/40 transition-colors duration-75 group cursor-pointer">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-semibold text-foreground truncate block">
                          {path.path_title}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                          {path.path_description}
                        </p>

                        <div className="flex items-center gap-3 mt-2.5">
                          <Progress value={path.pct} className="h-1 flex-1" />
                          <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                            {path.solved}/{path.total}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-2">
                          {path.topics.map((t) => (
                            <span key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
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
          );
        })}
      </div>
    </div>
  );
}
