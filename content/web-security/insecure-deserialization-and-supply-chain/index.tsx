import { InsecureDeserializationSection } from "./InsecureDeserializationSection";
import { SupplyChainDependenciesSection } from "./SupplyChainDependenciesSection";
import { VerifyingInstallsSection } from "./VerifyingInstallsSection";
import { MinimizingTrustSection } from "./MinimizingTrustSection";

export const toc = [
  { id: "insecure-deserialization", title: "Deserialization isn't reading data back, it's running instructions" },
  { id: "supply-chain-dependencies", title: "Every install command is part of your attack surface" },
  { id: "verifying-what-you-install", title: "Piping curl into bash is the same bug in different clothes" },
  { id: "minimizing-what-you-trust", title: "Reducing what a compromised dependency can actually reach" },
];

export default function InsecureDeserializationAndSupplyChainArticle() {
  return (
    <>
      <InsecureDeserializationSection />
      <SupplyChainDependenciesSection />
      <VerifyingInstallsSection />
      <MinimizingTrustSection />
    </>
  );
}
