import { CodeBlock } from "@/components/blog/interactive/code-block";

export function RemovePrefixSuffixSection() {
  return (
    <section>
      <h2
        id="remove-prefix-suffix"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        removeprefix and removesuffix (3.9)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Stripping a known prefix or suffix used to require either a slice with a hardcoded length,
        or a conditional plus{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          lstrip
        </code>{" "}
        (which has different semantics and is easy to misuse).
      </p>

      <CodeBlock
        code={`url = "https://example.com/api/users"
filename = "report_2024.pdf"

# Before 3.9: fragile, hardcoded offsets
protocol = "https://"
if url.startswith(protocol):
    url_without_protocol = url[len(protocol):]
else:
    url_without_protocol = url

# Also the wrong tool: lstrip strips *characters*, not a prefix string
# "https://".lstrip("https://") -- would remove 'h', 't', 'p', 's', ':', '/' individually
# so "http://example.com" would also be stripped -- silent bug

# After 3.9: does exactly what it says
url_without_protocol = url.removeprefix("https://")
filename_no_ext = filename.removesuffix(".pdf")

print(url_without_protocol)   # example.com/api/users
print(filename_no_ext)        # report_2024

# Safe when prefix/suffix is absent: returns original string unchanged
print("example.com".removeprefix("https://"))   # example.com`}
        output={`example.com/api/users
report_2024
example.com`}
      />

      <div className="border-l-2 border-brand-primary pl-4 py-2 mb-6 mt-6">
        <p className="text-[14px] text-brand-text/80">
          The critical difference from{" "}
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            lstrip
          </code>
          :{" "}
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            lstrip
          </code>{" "}
          strips any combination of the given characters, character by character.{" "}
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            removeprefix
          </code>{" "}
          strips the exact string, once, and only if it matches. They are not interchangeable.
        </p>
      </div>

      <CodeBlock
        code={`# Practical: cleaning log line prefixes
lines = [
    "[ERROR] disk full",
    "[WARN] low memory",
    "[INFO] server started",
    "raw line without prefix",
]

cleaned = [line.removeprefix("[ERROR] ")
               .removeprefix("[WARN] ")
               .removeprefix("[INFO] ")
           for line in lines]

for line in cleaned:
    print(line)`}
        output={`disk full
low memory
server started
raw line without prefix`}
      />
    </section>
  );
}
