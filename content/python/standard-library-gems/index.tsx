import { CollectionsSection } from "./CollectionsSection";
import { ItertoolsSection } from "./ItertoolsSection";
import { FunctoolsSection } from "./FunctoolsSection";
import { DatetimeSection } from "./DatetimeSection";
import { JsonSection } from "./JsonSection";

export const toc = [
  { id: "collections", title: "collections" },
  { id: "itertools", title: "itertools" },
  { id: "functools", title: "functools" },
  { id: "datetime", title: "datetime" },
  { id: "json", title: "json" },
];

export default function StandardLibraryGemsArticle() {
  return (
    <>
      <CollectionsSection />
      <ItertoolsSection />
      <FunctoolsSection />
      <DatetimeSection />
      <JsonSection />
    </>
  );
}
