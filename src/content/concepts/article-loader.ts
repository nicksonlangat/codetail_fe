import type React from "react";

type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

const loaders: Record<string, () => Promise<ArticleModule>> = {
  "idempotency": () => import("./idempotency") as Promise<ArticleModule>,
  "race-conditions": () => import("./race-conditions") as Promise<ArticleModule>,
  "n-plus-one-queries": () => import("./n-plus-one-queries") as Promise<ArticleModule>,
  "eventual-consistency": () => import("./eventual-consistency") as Promise<ArticleModule>,
  "pagination-at-scale": () => import("./pagination-at-scale") as Promise<ArticleModule>,
  "acid-transactions": () => import("./acid-transactions") as Promise<ArticleModule>,
};

export async function loadArticle(slug: string): Promise<ArticleModule | null> {
  const loader = loaders[slug];
  if (!loader) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}
