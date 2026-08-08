import { MonolithSection } from "./MonolithSection";
import { MicroservicesSection } from "./MicroservicesSection";
import { MigrationSection } from "./MigrationSection";
import { ChoosingSection } from "./ChoosingSection";

export const toc = [
  { id: "monolith", title: "The Monolith Is Not the Problem" },
  { id: "microservices", title: "Microservices: Deployability and Price" },
  { id: "migration", title: "Migrating: The Strangler Fig Pattern" },
  { id: "choosing", title: "Choosing an Architecture" },
];

export default function MicroservicesVsMonolithArticle() {
  return (
    <>
      <MonolithSection />
      <MicroservicesSection />
      <MigrationSection />
      <ChoosingSection />
    </>
  );
}
