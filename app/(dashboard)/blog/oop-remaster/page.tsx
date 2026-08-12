import { Boxes } from "lucide-react";
import { PathList } from "@/components/blog/path-list";
import { oopRemasterArticles } from "@/content/oop-remaster/registry";

export default function OopRemasterSeriesPage() {
  return (
    <PathList
      icon={Boxes}
      title={
        <>
          OOP <span className="text-brand-primary">Remaster</span>
        </>
      }
      description="8 articles rebuilding object-oriented Python from the ground up. Start with what an object actually is, work through the four pillars, magic methods, and modern patterns. No prior OOP knowledge assumed."
      basePath="/blog/oop-remaster"
      articles={oopRemasterArticles}
    />
  );
}
