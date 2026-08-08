import { Brain } from "lucide-react";
import { PathList } from "@/components/blog/path-list";
import { llmsFromScratchArticles } from "@/content/llms-from-scratch/registry";

export default function LLMsFromScratchSeriesPage() {
  return (
    <PathList
      icon={Brain}
      title={
        <>
          LLMs from <span className="text-brand-primary">Scratch</span>
        </>
      }
      description="15 exhaustive articles building a large language model up from first principles. From next-token prediction to a working GPT you code yourself, no prior ML background assumed."
      basePath="/blog/llms-from-scratch"
      articles={llmsFromScratchArticles}
    />
  );
}
