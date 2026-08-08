import { IDORSection } from "./IDORSection";
import { FunctionLevelAccessSection } from "./FunctionLevelAccessSection";
import { ClientSideAuthorizationSection } from "./ClientSideAuthorizationSection";
import { DefaultDenySection } from "./DefaultDenySection";

export const toc = [
  { id: "idor", title: "Insecure direct object references: the URL was the exploit" },
  { id: "function-level-access", title: "Missing function-level access control" },
  { id: "client-side-authorization", title: "Hiding the button isn't access control" },
  { id: "default-deny", title: "Default deny, and putting the check in one place" },
];

export default function BrokenAccessControlArticle() {
  return (
    <>
      <IDORSection />
      <FunctionLevelAccessSection />
      <ClientSideAuthorizationSection />
      <DefaultDenySection />
    </>
  );
}
