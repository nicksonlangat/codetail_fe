import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Paths", href: "/#paths" },
      { label: "Playground", href: "/#sandbox" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Codetail", href: "/why" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refund policy", href: "/refund" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-border">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="font-semibold text-lg text-brand-text cursor-pointer">
            Code<span className="text-brand-primary">tail</span>
          </Link>
          <p className="mt-2 text-[13px] text-brand-text-muted max-w-40">
            Practice real code. Get real feedback.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold text-brand-text-subtle uppercase tracking-wider mb-3">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-brand-text-muted cursor-pointer transition-all duration-500 hover:text-brand-text"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <p className="text-[12px] text-brand-text-subtle">
            &copy; 2026 Codetail. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
