import { TransitiveDependenciesSection } from "./TransitiveDependenciesSection";
import { ScanningAndSBOMSection } from "./ScanningAndSBOMSection";
import { PatchCadenceSection } from "./PatchCadenceSection";
import { WhenYouCantUpgradeSection } from "./WhenYouCantUpgradeSection";

export const toc = [
  { id: "transitive-dependencies", title: "The vulnerable code was never one you chose to depend on" },
  { id: "dependency-scanning-and-sboms", title: "Knowing what you're running, before you need to know" },
  { id: "patch-cadence", title: "Small upgrades often beat one terrifying upgrade a year" },
  { id: "when-you-cant-upgrade-yet", title: "When you genuinely can't upgrade yet" },
];

export default function VulnerableAndOutdatedComponentsArticle() {
  return (
    <>
      <TransitiveDependenciesSection />
      <ScanningAndSBOMSection />
      <PatchCadenceSection />
      <WhenYouCantUpgradeSection />
    </>
  );
}
