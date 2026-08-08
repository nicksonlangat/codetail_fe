import { OverviewSection } from "./OverviewSection";
import { DNSSection } from "./DNSSection";
import { TCPSection } from "./TCPSection";
import { ApplicationSection } from "./ApplicationSection";
import { LatencySection } from "./LatencySection";

export const toc = [
  { id: "overview", title: "The 13-step journey" },
  { id: "dns-resolution", title: "Step 1: DNS Resolution" },
  { id: "tcp-tls", title: "Step 2: TCP Handshake & TLS" },
  { id: "application-layer", title: "Steps 3-5: LB, Server & Database" },
  { id: "latency-budget", title: "The Latency Budget" },
];

export default function TheRequestJourneyArticle() {
  return (
    <>
      <OverviewSection />
      <DNSSection />
      <TCPSection />
      <ApplicationSection />
      <LatencySection />
    </>
  );
}
