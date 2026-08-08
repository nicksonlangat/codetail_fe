import { WhyIndexesSection } from "./WhyIndexesSection";
import { BTreeSection } from "./BTreeSection";
import { IndexTypesSection } from "./IndexTypesSection";
import { QueryOptimizationSection } from "./QueryOptimizationSection";

export const toc = [
  { id: "why-indexes", title: "The Problem: Full Table Scans" },
  { id: "btree-indexes", title: "How B-tree Indexes Work" },
  { id: "index-types", title: "Index Design: Types and Trade-offs" },
  { id: "query-optimization", title: "Query Optimization and Pitfalls" },
];

export default function IndexesAndQueryOptimizationArticle() {
  return (
    <>
      <WhyIndexesSection />
      <BTreeSection />
      <IndexTypesSection />
      <QueryOptimizationSection />
    </>
  );
}
