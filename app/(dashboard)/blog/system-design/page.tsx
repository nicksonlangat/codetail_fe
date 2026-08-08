import { Network } from "lucide-react";
import { PathList } from "@/components/blog/path-list";
import { systemDesignArticles } from "@/content/system-design/registry";

export default function SystemDesignSeriesPage() {
  return (
    <PathList
      icon={Network}
      title={
        <>
          System Design from <span className="text-brand-primary">First Principles</span>
        </>
      }
      description="15 exhaustive articles covering how real systems are built at scale. Not a buzzword tour, a deep understanding through interactive diagrams, simulators, and worked trade-offs."
      basePath="/blog/system-design"
      articles={systemDesignArticles}
    />
  );
}
