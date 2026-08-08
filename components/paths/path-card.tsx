import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { RingProgress } from "@/components/ui/ring-progress";
import { StackIcon } from "./stack-icon";
import { DIFFICULTY_STYLES } from "./constants";
import type { Path } from "@/lib/api/paths";
import type { PathProgressItem } from "@/lib/api/progress";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const MAX_VISIBLE_TOPICS = 3;

interface PathCardProps {
  path: Path;
  progress?: PathProgressItem;
}

export function PathCard({ path, progress }: PathCardProps) {
  const visibleTopics = path.topics.slice(0, MAX_VISIBLE_TOPICS);
  const extraTopicCount = path.topics.length - visibleTopics.length;

  return (
    <Link href={`/paths/${path.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -2 }}
        transition={SP}
        className="flex flex-col h-full border border-brand-border-strong rounded-xl bg-white p-5 cursor-pointer transition-all duration-500 hover:border-brand-primary"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="size-11 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
            <StackIcon stack={path.stack} className="size-6" />
          </div>
          {progress ? (
            <div className="relative size-9 shrink-0">
              <RingProgress value={progress.pct} size={36} stroke={3} inView />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-brand-text-muted">
                {progress.pct}%
              </span>
            </div>
          ) : (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md capitalize shrink-0 ${DIFFICULTY_STYLES[path.difficulty]}`}
            >
              {path.difficulty}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-[15px] text-brand-text leading-snug">{path.title}</h3>
        <p className="text-[13px] text-brand-text-muted mt-1.5 leading-relaxed line-clamp-2 flex-1">
          {path.description}
        </p>

        {visibleTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {visibleTopics.map((topic) => (
              <span
                key={topic}
                className="text-[10px] bg-brand-surface text-brand-text-muted px-2 py-0.5 rounded-md"
              >
                {topic}
              </span>
            ))}
            {extraTopicCount > 0 && (
              <span className="text-[10px] text-brand-text-subtle px-2 py-0.5">
                +{extraTopicCount} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border-strong">
          <span className="flex items-center gap-1.5 text-[12px] text-brand-text-subtle">
            <BookOpen className="size-3.5" />
            {path.problem_count} problems
          </span>
          {progress && (
            <span className="text-[11px] text-brand-text-subtle">
              {progress.solved}/{progress.total} solved
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
