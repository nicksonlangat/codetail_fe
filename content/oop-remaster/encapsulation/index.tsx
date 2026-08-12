import { WhatIsItSection } from "./WhatIsItSection";
import { PrivateByConventionSection } from "./PrivateByConventionSection";
import { PropertyDecoratorSection } from "./PropertyDecoratorSection";

export const toc = [
  { id: "what-is-it", title: "What encapsulation actually is" },
  { id: "private-by-convention", title: "Private by convention, not by lock" },
  { id: "property-decorator", title: "@property: a controlled public interface" },
];

export default function EncapsulationArticle() {
  return (
    <>
      <WhatIsItSection />
      <PrivateByConventionSection />
      <PropertyDecoratorSection />
    </>
  );
}
