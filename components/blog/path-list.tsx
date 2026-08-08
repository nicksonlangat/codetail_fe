import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { RingProgress } from "@/components/ui/ring-progress";
import type { ArticleMeta } from "@/content/python/registry";

interface PathListProps {
  icon: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description: string;
  basePath: string;
  articles: ArticleMeta[];
}

export function PathList({ icon: Icon, title, description, basePath, articles }: PathListProps) {
  const totalMinutes = articles.reduce((sum, a) => sum + a.estimatedMinutes, 0);
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <section className="w-full max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="size-8 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
              <Icon className="size-4 text-brand-primary" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Learning Path
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text leading-tight">
            {title}
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-brand-text-muted">{description}</p>

          <div className="mt-5 flex items-center gap-4 text-[12px] text-brand-text-muted">
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5" /> {articles.length} articles
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" /> ~{totalHours}h read
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="relative size-10 shrink-0">
              <RingProgress value={0} size={40} stroke={3} inView />
            </div>
            <div>
              <p className="text-xs font-medium text-brand-text">0 of {articles.length} read</p>
              <p className="text-[11px] text-brand-text-subtle">Start anytime</p>
            </div>
          </div>

          <Link
            href={`${basePath}/${articles[0].slug}`}
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-brand-primary text-white text-sm font-medium px-4 py-2.5 cursor-pointer outline-none transition-all duration-500 hover:bg-brand-primary-hover focus-visible:border-white/50"
          >
            Start learning <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="space-y-1">
          {articles.map((article, i) => (
            <Link
              key={article.slug}
              href={`${basePath}/${article.slug}`}
              className="flex items-center gap-4 p-3 rounded-lg border border-transparent cursor-pointer transition-all duration-500 hover:border-brand-border hover:bg-brand-surface/50 group"
            >
              <div className="relative size-8 shrink-0">
                <RingProgress value={0} size={32} stroke={2.5} inView />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-brand-text-muted">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-brand-text transition-all duration-500 group-hover:text-brand-primary">
                  {article.title}
                </span>
                <p className="text-[12px] text-brand-text-muted truncate">{article.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-brand-text-subtle shrink-0">
                <Clock className="size-3" />
                <span className="tabular-nums">{article.estimatedMinutes}m</span>
                <ArrowRight className="size-3 opacity-0 transition-all duration-500 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
