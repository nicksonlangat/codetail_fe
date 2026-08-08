import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/blog/layout/blog-layout";
import { ArticleShell } from "@/components/blog/article-shell";
import { PracticeThisCard } from "@/components/blog/promo/practice-this-card";
import { SignupBanner } from "@/components/blog/promo/signup-banner";
import { StickyBottomCTA } from "@/components/blog/promo/sticky-bottom-cta";
import { webSecurityArticles, getArticleBySlug, getAdjacentArticles } from "@/content/web-security/registry";
import { loadArticle } from "@/content/web-security/article-loader";

export function generateStaticParams() {
  return webSecurityArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Codetail Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const { prev, next } = getAdjacentArticles(slug);
  const articleModule = await loadArticle(slug);
  const toc = articleModule?.toc ?? [];
  const ArticleComponent = articleModule?.default ?? null;

  const sidebar = (
    <div className="sticky top-24 space-y-4">
      <PracticeThisCard challenges={article.relatedChallenges} />
      <SignupBanner />
    </div>
  );

  return (
    <>
      <BlogLayout toc={toc} sidebar={sidebar}>
        <ArticleShell
          article={article}
          totalArticles={webSecurityArticles.length}
          basePath="/blog/web-security"
          backLabel="All Web Security articles"
          prev={prev}
          next={next}
        >
          {ArticleComponent ? (
            <ArticleComponent />
          ) : (
            <p className="text-[15px] leading-relaxed text-brand-text-muted italic">
              This article is coming soon.
            </p>
          )}
        </ArticleShell>
      </BlogLayout>
      <StickyBottomCTA />
    </>
  );
}
