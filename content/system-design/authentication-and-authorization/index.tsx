import { AuthNvsAuthZSection } from "./AuthNvsAuthZSection";
import { SessionsAndTokensSection } from "./SessionsAndTokensSection";
import { OAuth2Section } from "./OAuth2Section";
import { AuthZModelsSection } from "./AuthZModelsSection";

export const toc = [
  { id: "authn-authz", title: "Authentication vs Authorization" },
  { id: "sessions-tokens", title: "Sessions vs Tokens" },
  { id: "oauth2", title: "OAuth 2.0 and OpenID Connect" },
  { id: "authz-models", title: "Authorization Models" },
];

export default function AuthenticationAndAuthorizationArticle() {
  return (
    <>
      <AuthNvsAuthZSection />
      <SessionsAndTokensSection />
      <OAuth2Section />
      <AuthZModelsSection />
    </>
  );
}
