import { WandSparkles } from "lucide-react";
import { PathList } from "@/components/blog/path-list";
import { aiEngineeringArticles } from "@/content/ai-engineering/registry";

export default function AIEngineeringSeriesPage() {
  return (
    <PathList
      icon={WandSparkles}
      title={
        <>
          AI Engineering <span className="text-brand-primary">From Prompt to Production</span>
        </>
      }
      description="15 exhaustive articles on building real products on top of hosted models: prompting, RAG, agents, evals, cost, safety, and shipping. The applied counterpart to LLMs from Scratch, not a re-run of its theory."
      basePath="/blog/ai-engineering"
      articles={aiEngineeringArticles}
    />
  );
}
