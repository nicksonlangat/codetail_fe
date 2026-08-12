import { PositionalOnlySection } from "./PositionalOnlySection";
import { WalrusOperatorSection } from "./WalrusOperatorSection";
import { CacheDecoratorSection } from "./CacheDecoratorSection";
import { SingleDispatchSection } from "./SingleDispatchSection";

export const toc = [
  { id: "positional-only", title: "Positional-only parameters (/)" },
  { id: "walrus-operator", title: "The walrus operator :=" },
  { id: "cache-decorator", title: "@cache and @lru_cache" },
  { id: "single-dispatch", title: "@singledispatch" },
];

export default function ModernFunctionsArticle() {
  return (
    <>
      <PositionalOnlySection />
      <WalrusOperatorSection />
      <CacheDecoratorSection />
      <SingleDispatchSection />
    </>
  );
}
