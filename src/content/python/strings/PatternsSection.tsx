import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="real-world-patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Real-world patterns
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        The string operations you&apos;ll reach for constantly in production.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">Clean and normalize user input</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        User-submitted text arrives dirty. Strip whitespace and normalize case before storing
        or comparing.
      </p>
      <CodeBlock
        code={`raw_username = "  Alice  "
raw_email    = "Alice@EXAMPLE.COM "

username = raw_username.strip().lower()   # "alice"
email    = raw_email.strip().lower()      # "alice@example.com"

# Always normalize before comparing
if username == "alice":
    print("Found user")`}
        output={`Found user`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Parse delimited data</h3>
      <p className="text-[14px] text-foreground/80 mb-3">
        When you receive a flat string of comma-separated values, split and strip each field.
      </p>
      <CodeBlock
        code={`line = "Alice, 30, engineer , New York"

fields = [f.strip() for f in line.split(",")]
# ['Alice', '30', 'engineer', 'New York']

name, age, role, city = fields
print(f"{name} is a {role} in {city}")`}
        output={`Alice is a engineer in New York`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Build URLs and paths safely</h3>
      <CodeBlock
        code={`base = "https://api.example.com/"
endpoint = "/users/profile/"

# Strip slashes before joining to avoid double-slash bugs
url = f"{base.rstrip('/')}/{endpoint.strip('/')}"
# "https://api.example.com/users/profile/"

# For file paths use pathlib, not string joins
from pathlib import Path
path = Path("/home/alice") / "documents" / "report.pdf"
print(path)   # /home/alice/documents/report.pdf`}
        output={`https://api.example.com/users/profile/
/home/alice/documents/report.pdf`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Truncate text for display</h3>
      <CodeBlock
        code={`def truncate(text: str, max_len: int = 100) -> str:
    if len(text) <= max_len:
        return text
    return text[:max_len - 3].rstrip() + "..."

print(truncate("The quick brown fox jumped over the lazy dog", 25))
# "The quick brown fox..."

# Word-aware wrapping from the standard library
import textwrap
print(textwrap.fill("The quick brown fox jumped over the lazy dog", width=25))`}
        output={`The quick brown fox...
The quick brown fox
jumped over the lazy dog`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Filter files by extension</h3>
      <CodeBlock
        code={`filenames = ["report.pdf", "data.csv", "photo.png", "notes.txt", "image.jpg"]

# endswith() with a tuple checks any of several suffixes at once
images = [f for f in filenames if f.endswith((".jpg", ".png", ".gif", ".webp"))]
# ['photo.png', 'image.jpg']

urls = ["https://example.com", "http://old.com", "ftp://files.com"]
secure = [u for u in urls if u.startswith("https://")]
# ['https://example.com']`}
        output={`['photo.png', 'image.jpg']
['https://example.com']`}
      />
    </section>
  );
}
