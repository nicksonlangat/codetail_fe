import { VerboseErrorsSection } from "./VerboseErrorsSection";
import { DefaultCredentialsSection } from "./DefaultCredentialsSection";
import { CORSMisconfigurationSection } from "./CORSMisconfigurationSection";
import { ExposedStorageSection } from "./ExposedStorageSection";

export const toc = [
  { id: "verbose-errors", title: "Verbose errors: a stack trace is documentation for an attacker" },
  { id: "default-credentials", title: "Default credentials: someone is already scanning for these" },
  { id: "cors-misconfiguration", title: "CORS: the setting that can quietly undo your CSRF defenses" },
  { id: "exposed-storage-and-endpoints", title: "Exposed storage and leftover endpoints" },
];

export default function SecurityMisconfigurationArticle() {
  return (
    <>
      <VerboseErrorsSection />
      <DefaultCredentialsSection />
      <CORSMisconfigurationSection />
      <ExposedStorageSection />
    </>
  );
}
