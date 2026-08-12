import { ExceptionChainingSection } from "./ExceptionChainingSection";
import { AddNoteSection } from "./AddNoteSection";
import { ExceptionGroupsSection } from "./ExceptionGroupsSection";
import { BetterErrorsSection } from "./BetterErrorsSection";

export const toc = [
  { id: "exception-chaining", title: "Exception chaining: raise ... from" },
  { id: "add-note", title: "exception.add_note() (3.11)" },
  { id: "exception-groups", title: "ExceptionGroup and except* (3.11)" },
  { id: "better-errors", title: "Smarter built-in error messages" },
];

export default function ModernExceptionsArticle() {
  return (
    <>
      <ExceptionChainingSection />
      <AddNoteSection />
      <ExceptionGroupsSection />
      <BetterErrorsSection />
    </>
  );
}
