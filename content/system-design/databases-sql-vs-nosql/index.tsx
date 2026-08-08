import { RelationalSection } from "./RelationalSection";
import { NoSQLTypesSection } from "./NoSQLTypesSection";
import { ACIDvsBaseSection } from "./ACIDvsBaseSection";
import { ChoosingSection } from "./ChoosingSection";

export const toc = [
  { id: "relational-databases", title: "Relational Databases and ACID" },
  { id: "nosql-types", title: "NoSQL: Four Different Models" },
  { id: "acid-vs-base", title: "ACID vs BASE" },
  { id: "choosing-a-database", title: "Choosing the Right Database" },
];

export default function DatabasesSqlVsNosqlArticle() {
  return (
    <>
      <RelationalSection />
      <NoSQLTypesSection />
      <ACIDvsBaseSection />
      <ChoosingSection />
    </>
  );
}
