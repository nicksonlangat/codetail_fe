import { InjectionAndAccessControlSection } from "./InjectionAndAccessControlSection";
import { AuthCryptoAndConfigSection } from "./AuthCryptoAndConfigSection";
import { SupplyChainComponentsAndDesignSection } from "./SupplyChainComponentsAndDesignSection";
import { SSRFAndMonitoringSection } from "./SSRFAndMonitoringSection";

export const toc = [
  { id: "injection-and-xss", title: "A03: Injection" },
  { id: "broken-access-control-and-csrf", title: "A01: Broken Access Control" },
  { id: "authentication-failures", title: "A07: Identification and Authentication Failures" },
  { id: "cryptographic-failures", title: "A02: Cryptographic Failures" },
  { id: "security-misconfiguration", title: "A05: Security Misconfiguration" },
  { id: "software-and-data-integrity-failures", title: "A08: Software and Data Integrity Failures" },
  { id: "vulnerable-and-outdated-components", title: "A06: Vulnerable and Outdated Components" },
  { id: "insecure-design", title: "A04: Insecure Design" },
  { id: "server-side-request-forgery", title: "A10: Server-Side Request Forgery" },
  { id: "security-logging-and-monitoring", title: "A09: Security Logging and Monitoring Failures" },
  { id: "how-to-use-this-checklist", title: "How to actually use this" },
];

export default function OWASPTop10ChecklistArticle() {
  return (
    <>
      <InjectionAndAccessControlSection />
      <AuthCryptoAndConfigSection />
      <SupplyChainComponentsAndDesignSection />
      <SSRFAndMonitoringSection />
    </>
  );
}
