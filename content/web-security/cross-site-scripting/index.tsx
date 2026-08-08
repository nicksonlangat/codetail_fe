import { ReflectedXSSSection } from "./ReflectedXSSSection";
import { StoredXSSSection } from "./StoredXSSSection";
import { DOMXSSSection } from "./DOMXSSSection";
import { DefenseInDepthSection } from "./DefenseInDepthSection";

export const toc = [
  { id: "reflected-xss", title: "Reflected XSS: the payload comes from the URL" },
  { id: "stored-xss", title: "Stored XSS: the payload comes from your database" },
  { id: "dom-xss", title: "DOM-based XSS: no server involved at all" },
  { id: "defense-in-depth", title: "Output encoding, CSP, and HttpOnly cookies" },
];

export default function CrossSiteScriptingArticle() {
  return (
    <>
      <ReflectedXSSSection />
      <StoredXSSSection />
      <DOMXSSSection />
      <DefenseInDepthSection />
    </>
  );
}
