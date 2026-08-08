import { TheAttackSection } from "./TheAttackSection";
import { ParameterizedQueriesSection } from "./ParameterizedQueriesSection";
import { BeyondSQLSection } from "./BeyondSQLSection";
import { DefenseInDepthSection } from "./DefenseInDepthSection";

export const toc = [
  { id: "the-attack", title: "The query that isn't just a query" },
  { id: "parameterized-queries", title: "Parameterized queries, the actual fix" },
  { id: "beyond-sql", title: "NoSQL and command injection" },
  { id: "defense-in-depth", title: "ORMs, allowlisting, and least privilege" },
];

export default function InjectionArticle() {
  return (
    <>
      <TheAttackSection />
      <ParameterizedQueriesSection />
      <BeyondSQLSection />
      <DefenseInDepthSection />
    </>
  );
}
