import type React from "react";

type TocItem = { id: string; title: string };

type ArticleModule = {
  default: React.ComponentType;
  toc: TocItem[];
};

const loaders: Record<string, () => Promise<ArticleModule>> = {
  "select-and-where": () => import("./select-and-where") as Promise<ArticleModule>,
  "joins": () => import("./joins") as Promise<ArticleModule>,
  "aggregations": () => import("./aggregations") as Promise<ArticleModule>,
  "subqueries": () => import("./subqueries") as Promise<ArticleModule>,
  "ctes": () => import("./ctes") as Promise<ArticleModule>,
  "window-functions": () => import("./window-functions") as Promise<ArticleModule>,
  "indexes": () => import("./indexes") as Promise<ArticleModule>,
  "null-handling": () => import("./null-handling") as Promise<ArticleModule>,
  "transactions-in-sql": () => import("./transactions-in-sql") as Promise<ArticleModule>,
  "constraints": () => import("./constraints") as Promise<ArticleModule>,
  "schema-design": () => import("./schema-design") as Promise<ArticleModule>,
  "query-optimization": () => import("./query-optimization") as Promise<ArticleModule>,
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
