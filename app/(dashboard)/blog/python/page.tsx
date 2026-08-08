import { PythonLogo } from "@/components/brand/stack-logos";
import { PathList } from "@/components/blog/path-list";
import { pythonArticles } from "@/content/python/registry";

export default function PythonSeriesPage() {
  return (
    <PathList
      icon={PythonLogo}
      title={
        <>
          Python from <span className="text-brand-primary">First Principles</span>
        </>
      }
      description="15 exhaustive articles covering every fundamental concept. Not a syntax reference, a deep understanding through analogies, visuals, and hands-on interactive demos."
      basePath="/blog/python"
      articles={pythonArticles}
    />
  );
}
