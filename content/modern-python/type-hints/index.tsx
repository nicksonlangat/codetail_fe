import { BuiltinGenericsSection } from "./BuiltinGenericsSection";
import { UnionAndOptionalSection } from "./UnionAndOptionalSection";
import { TypeAliasesSection } from "./TypeAliasesSection";
import { TypeCheckingImportsSection } from "./TypeCheckingImportsSection";

export const toc = [
  { id: "builtin-generics", title: "List, Dict, Tuple: imports you no longer need" },
  { id: "union-and-optional", title: "Optional[str] is str | None" },
  { id: "type-aliases", title: "Type aliases: from assignment to type statement" },
  { id: "type-checking-imports", title: "TYPE_CHECKING: annotation-only imports" },
];

export default function TypeHintsArticle() {
  return (
    <>
      <BuiltinGenericsSection />
      <UnionAndOptionalSection />
      <TypeAliasesSection />
      <TypeCheckingImportsSection />
    </>
  );
}
