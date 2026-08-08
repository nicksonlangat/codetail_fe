import { ShieldAlert } from "lucide-react";
import { PathList } from "@/components/blog/path-list";
import { webSecurityArticles } from "@/content/web-security/registry";

export default function WebSecuritySeriesPage() {
  return (
    <PathList
      icon={ShieldAlert}
      title={
        <>
          Web Security <span className="text-brand-primary">From Exploit to Fix</span>
        </>
      }
      description="12 exhaustive articles covering the major web vulnerability classes, mapped to the OWASP Top 10. Every attack shown working against real code, every fix shown closing it."
      basePath="/blog/web-security"
      articles={webSecurityArticles}
    />
  );
}
