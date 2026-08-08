import Link from "next/link";
import { Check } from "lucide-react";

function Checklist({ items }: { items: { text: string; href: string }[] }) {
  return (
    <ul className="space-y-2.5 mb-6">
      {items.map((item) => (
        <li key={item.href + item.text} className="flex items-start gap-2.5">
          <Check className="size-4 text-brand-success mt-0.5 shrink-0" />
          <span className="text-[14px] leading-relaxed text-brand-text/90">
            {item.text}{" "}
            <Link
              href={item.href}
              className="text-brand-primary underline text-[12px] cursor-pointer transition-all duration-500 hover:text-brand-primary-hover"
            >
              detail
            </Link>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SupplyChainComponentsAndDesignSection() {
  return (
    <section>
      <h2 id="software-and-data-integrity-failures" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A08: Software and Data Integrity Failures
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Trusting a byte stream or a package registry without verifying either.
      </p>
      <Checklist
        items={[
          { text: "No code path deserializes untrusted input with pickle, ObjectInputStream, unserialize(), or Marshal.load.", href: "/blog/web-security/insecure-deserialization-and-supply-chain#insecure-deserialization" },
          { text: "CI installs dependencies from a committed lockfile, not an unpinned version range.", href: "/blog/web-security/insecure-deserialization-and-supply-chain#supply-chain-dependencies" },
          { text: "Any curl-into-bash style install step verifies a checksum before executing.", href: "/blog/web-security/insecure-deserialization-and-supply-chain#verifying-what-you-install" },
          { text: "CI secrets are scoped to the specific job that needs them, not available to every step by default.", href: "/blog/web-security/insecure-deserialization-and-supply-chain#minimizing-what-you-trust" },
        ]}
      />

      <h2 id="vulnerable-and-outdated-components" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A06: Vulnerable and Outdated Components
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The vulnerability was never in code your team wrote.
      </p>
      <Checklist
        items={[
          { text: "A software bill of materials or equivalent inventory exists for every deployed service, including transitive dependencies.", href: "/blog/web-security/vulnerable-and-outdated-components#dependency-scanning-and-sboms" },
          { text: "Dependency scanning runs on every build and fails it on a high-severity match.", href: "/blog/web-security/vulnerable-and-outdated-components#dependency-scanning-and-sboms" },
          { text: "Dependency updates arrive continuously in small pull requests, not once a year in one large migration.", href: "/blog/web-security/vulnerable-and-outdated-components#patch-cadence" },
          { text: "Any dependency that can't be upgraded immediately has a compensating control and a tracked, dated plan to upgrade.", href: "/blog/web-security/vulnerable-and-outdated-components#when-you-cant-upgrade-yet" },
        ]}
      />

      <h2 id="insecure-design" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A04: Insecure Design
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Not one bug but a habit, threading through every article in this series: assume a check
        will eventually be missed, and design so the blast radius stays small when it is.
      </p>
      <Checklist
        items={[
          { text: "New routes default to requiring authorization; access is granted explicitly, not assumed open.", href: "/blog/web-security/broken-access-control#default-deny" },
          { text: "Database accounts and service credentials hold only the permissions their specific job requires.", href: "/blog/web-security/injection#defense-in-depth" },
          { text: "High-impact actions (large transfers, account deletion, email changes) require a confirmation step beyond a single authenticated request.", href: "/blog/web-security/csrf#defense-in-depth" },
          { text: "Security-relevant decisions live in one centralized function or middleware, not copy-pasted per handler.", href: "/blog/web-security/broken-access-control#default-deny" },
        ]}
      />
    </section>
  );
}
