import { CreatingSetsSection } from "./CreatingSetsSection";
import { ModifyingSection } from "./ModifyingSection";
import { SetOperationsSection } from "./SetOperationsSection";
import { MembershipSection } from "./MembershipSection";
import { PatternsSection } from "./PatternsSection";

export const toc = [
  { id: "creating-sets", title: "Creating sets" },
  { id: "modifying-sets", title: "Modifying sets" },
  { id: "set-operations", title: "Set operations" },
  { id: "membership", title: "Membership testing" },
  { id: "patterns", title: "Real-world patterns" },
];

export default function SetsArticle() {
  return (
    <>
      <CreatingSetsSection />
      <ModifyingSection />
      <SetOperationsSection />
      <MembershipSection />
      <PatternsSection />
    </>
  );
}
