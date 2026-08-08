import { TheAttackSection } from "./TheAttackSection";
import { CloudMetadataSection } from "./CloudMetadataSection";
import { AllowlistingSection } from "./AllowlistingSection";
import { NetworkLevelDefenseSection } from "./NetworkLevelDefenseSection";

export const toc = [
  { id: "the-attack", title: "You asked the server to fetch a URL. It fetched the wrong one." },
  { id: "cloud-metadata", title: "The cloud metadata endpoint: SSRF's most expensive payoff" },
  { id: "allowlisting-outbound-requests", title: "Allowlisting outbound requests, and the two ways the obvious fix fails" },
  { id: "network-level-defense", title: "Don't make application code the only thing standing in the way" },
];

export default function SSRFArticle() {
  return (
    <>
      <TheAttackSection />
      <CloudMetadataSection />
      <AllowlistingSection />
      <NetworkLevelDefenseSection />
    </>
  );
}
