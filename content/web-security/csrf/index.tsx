import { TheAttackSection } from "./TheAttackSection";
import { CSRFTokensSection } from "./CSRFTokensSection";
import { SameSiteCookiesSection } from "./SameSiteCookiesSection";
import { DefenseInDepthSection } from "./DefenseInDepthSection";

export const toc = [
  { id: "the-attack", title: "The browser sends the cookie, the attacker sends the request" },
  { id: "csrf-tokens", title: "CSRF tokens: proving the request came from your own form" },
  { id: "samesite-cookies", title: "SameSite cookies, and the state-changing GET underneath" },
  { id: "defense-in-depth", title: "Layering the defenses, and what JSON APIs get for free" },
];

export default function CSRFArticle() {
  return (
    <>
      <TheAttackSection />
      <CSRFTokensSection />
      <SameSiteCookiesSection />
      <DefenseInDepthSection />
    </>
  );
}
