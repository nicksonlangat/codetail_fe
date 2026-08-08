import { HowCDNsWorkSection } from "./HowCDNsWorkSection";
import { CacheControlSection } from "./CacheControlSection";
import { WhatToServeSection } from "./WhatToServeSection";
import { EdgeComputingSection } from "./EdgeComputingSection";

export const toc = [
  { id: "how-cdns-work", title: "How CDNs Work" },
  { id: "cache-control", title: "Cache-Control: Directing CDN Behavior" },
  { id: "what-to-serve", title: "What to Put on a CDN" },
  { id: "edge-computing", title: "Edge Computing: Logic at the PoP" },
];

export default function CdnsAndEdgeNetworksArticle() {
  return (
    <>
      <HowCDNsWorkSection />
      <CacheControlSection />
      <WhatToServeSection />
      <EdgeComputingSection />
    </>
  );
}
