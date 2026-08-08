import { WhatIsCAPSection } from "./WhatIsCAPSection";
import { PartitionSection } from "./PartitionSection";
import { CPvsAPSection } from "./CPvsAPSection";
import { BeyondCAPSection } from "./BeyondCAPSection";

export const toc = [
  { id: "what-is-cap", title: "Consistency, Availability, Partition Tolerance" },
  { id: "partition-simulation", title: "Simulating a Network Partition" },
  { id: "cp-vs-ap", title: "CP vs AP: Real Systems" },
  { id: "beyond-cap", title: "Beyond CAP: PACELC" },
];

export default function CapTheoremArticle() {
  return (
    <>
      <WhatIsCAPSection />
      <PartitionSection />
      <CPvsAPSection />
      <BeyondCAPSection />
    </>
  );
}
