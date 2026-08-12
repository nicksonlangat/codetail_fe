import { Sparkles } from "lucide-react";
import { PathList } from "@/components/blog/path-list";
import { modernPythonArticles } from "@/content/modern-python/registry";

export default function ModernPythonSeriesPage() {
  return (
    <PathList
      icon={Sparkles}
      title={
        <>
          Modern <span className="text-brand-primary">Python</span>
        </>
      }
      description="8 articles on writing Python the way it was meant to be written today. Every article is a direct before/after: the pattern you used to write in 3.5-3.8, and the cleaner version available now. No Python 2."
      basePath="/blog/modern-python"
      articles={modernPythonArticles}
    />
  );
}
