import { OpenReadSection } from "./OpenReadSection";
import { WriteSection } from "./WriteSection";
import { PathlibSection } from "./PathlibSection";
import { JSONSection } from "./JSONSection";
import { CSVSection } from "./CSVSection";

export const toc = [
  { id: "open-read", title: "Opening and reading files" },
  { id: "writing", title: "Writing files" },
  { id: "pathlib", title: "pathlib" },
  { id: "json", title: "JSON files" },
  { id: "csv", title: "CSV files" },
];

export default function FileIOArticle() {
  return (
    <>
      <OpenReadSection />
      <WriteSection />
      <PathlibSection />
      <JSONSection />
      <CSVSection />
    </>
  );
}
