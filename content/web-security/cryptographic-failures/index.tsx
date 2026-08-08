import { PasswordHashingSection } from "./PasswordHashingSection";
import { SecretsAtRestSection } from "./SecretsAtRestSection";
import { TLSMisconfigurationSection } from "./TLSMisconfigurationSection";
import { KeyManagementSection } from "./KeyManagementSection";

export const toc = [
  { id: "password-hashing", title: "Password hashing: fast is exactly the wrong property" },
  { id: "secrets-at-rest", title: "Secrets at rest: in your database, and in your git history" },
  { id: "tls-misconfiguration", title: "TLS misconfiguration: the one-line fix that undoes everything" },
  { id: "key-management", title: "Key management: the part encryption tutorials skip" },
];

export default function CryptographicFailuresArticle() {
  return (
    <>
      <PasswordHashingSection />
      <SecretsAtRestSection />
      <TLSMisconfigurationSection />
      <KeyManagementSection />
    </>
  );
}
