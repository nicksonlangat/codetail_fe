import { EverythingIsAnObjectSection } from "./EverythingIsAnObjectSection";
import { StateAndBehaviorSection } from "./StateAndBehaviorSection";
import { WhyGroupThemSection } from "./WhyGroupThemSection";

export const toc = [
  { id: "everything-is-an-object", title: "You already have objects" },
  { id: "state-and-behavior", title: "State and behavior" },
  { id: "why-group-them", title: "The problem classes solve" },
];

export default function ObjectsEverywhereArticle() {
  return (
    <>
      <EverythingIsAnObjectSection />
      <StateAndBehaviorSection />
      <WhyGroupThemSection />
    </>
  );
}
