import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CSVSection() {
  return (
    <section>
      <h2 id="csv" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        CSV files
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python&apos;s{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">csv</code>{" "}
        module handles quoting, escaping, and different delimiters correctly. Do not
        split CSV lines on commas manually — quoted fields with embedded commas will
        break it.
      </p>

      <CodeBlock
        code={`import csv

# Read with csv.reader — rows are lists of strings
with open("scores.csv", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)         # skip the header row
    for row in reader:
        name, score = row[0], int(row[1])
        print(f"{name}: {score}")

# Read with DictReader — rows are dicts keyed by header
with open("scores.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["score"])   # row is a dict`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Writing CSV</h3>

      <CodeBlock
        code={`import csv

rows = [
    ["Alice", 92, "A"],
    ["Bob",   78, "C+"],
    ["Carol", 85, "B"],
]

# csv.writer handles quoting and newlines
with open("results.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "score", "grade"])   # header
    writer.writerows(rows)                        # all data rows

# DictWriter — write dicts
students = [
    {"name": "Alice", "score": 92},
    {"name": "Bob",   "score": 78},
]
with open("students.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(students)`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2">
        <p className="text-[13px] text-foreground/70 italic">
          Always pass{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">newline=""</code>{" "}
          when opening a file for{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">csv.writer</code>.
          Without it, Windows adds an extra blank line between each row.
        </p>
      </div>
    </section>
  );
}
