import { CredentialStuffingSection } from "./CredentialStuffingSection";
import { SessionFixationSection } from "./SessionFixationSection";
import { PasswordResetSection } from "./PasswordResetSection";
import { TokenExpiryAndRotationSection } from "./TokenExpiryAndRotationSection";

export const toc = [
  { id: "credential-stuffing", title: "Credential stuffing: the bug isn't in your code" },
  { id: "session-fixation", title: "Session fixation: the ID doesn't change when you think it does" },
  { id: "password-reset", title: "Password reset: authentication's back door" },
  { id: "token-expiry-and-rotation", title: "Token expiry and rotation" },
];

export default function AuthenticationAndSessionManagementArticle() {
  return (
    <>
      <CredentialStuffingSection />
      <SessionFixationSection />
      <PasswordResetSection />
      <TokenExpiryAndRotationSection />
    </>
  );
}
