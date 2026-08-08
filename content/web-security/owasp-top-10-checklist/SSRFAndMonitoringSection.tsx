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

export function SSRFAndMonitoringSection() {
  return (
    <section>
      <h2 id="server-side-request-forgery" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A10: Server-Side Request Forgery
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A server that fetches a URL somebody else supplied, and no check on where that URL is
        allowed to point.
      </p>
      <Checklist
        items={[
          { text: "Any feature that fetches a user-supplied URL validates the resolved IP against private and internal ranges, not just the hostname.", href: "/blog/web-security/ssrf#allowlisting-outbound-requests" },
          { text: "That validation re-checks each redirect hop rather than trusting the original URL alone.", href: "/blog/web-security/ssrf#allowlisting-outbound-requests" },
          { text: "Cloud instances enforce IMDSv2 or the equivalent token-gated metadata API.", href: "/blog/web-security/ssrf#cloud-metadata" },
          { text: "Servers that fetch external URLs have no network route to internal-only services or the metadata endpoint unless explicitly required.", href: "/blog/web-security/ssrf#network-level-defense" },
        ]}
      />

      <h2 id="security-logging-and-monitoring" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        A09: Security Logging and Monitoring Failures
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every other item on this checklist assumes a failure will slip through eventually. This
        category is whether you&apos;d actually notice when one does.
      </p>
      <Checklist
        items={[
          { text: "Every authentication attempt, authorization failure, and admin action logs actor, action, outcome, and source.", href: "/blog/web-security/security-logging-and-monitoring#what-to-log" },
          { text: "No log line contains a raw password, full token, or full card number; fields are allowlisted explicitly.", href: "/blog/web-security/security-logging-and-monitoring#what-never-to-log" },
          { text: "Alerting rules exist for account-specific and distributed login-failure spikes, not just a generic error rate.", href: "/blog/web-security/security-logging-and-monitoring#alerting-on-the-right-signal" },
          { text: "Log retention covers a realistic detection window, and alerting rules are tested in a drill at least twice a year.", href: "/blog/web-security/security-logging-and-monitoring#closing-the-detection-gap" },
        ]}
      />

      <h2 id="how-to-use-this-checklist" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        How to actually use this
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Not every item applies to every app, a static marketing site has no login to rate-limit
        and no database to inject into. Go through each category against your own system honestly,
        and where an item doesn&apos;t hold, follow the &quot;detail&quot; link back to the article
        it came from. Every one of them shows the actual vulnerable code, the exploit, and the fix,
        not just the one-line summary sitting here.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90">
        This list is worth rerunning periodically, not just once. A codebase that passed every item
        here on the day it launched can drift out of compliance with itself: a new endpoint added
        without the access check the rest of the app has, a dependency quietly falling multiple
        majors behind, a debug flag flipped on to chase down a production bug and never flipped
        back. Treat this as a recurring audit, not a one-time certificate.
      </p>
    </section>
  );
}
