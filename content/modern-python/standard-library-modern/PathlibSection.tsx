import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PathlibSection() {
  return (
    <section>
      <h2
        id="pathlib"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        pathlib: stop using os.path
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          os.path
        </code>{" "}
        works with strings.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          pathlib.Path
        </code>{" "}
        works with objects. The difference matters because string paths compose poorly,
        while Path objects carry their operations with them.
      </p>

      <CodeBlock
        code={`import os

# os.path: strings all the way, function soup
base = "/var/log"
app_dir = os.path.join(base, "myapp")
log_file = os.path.join(app_dir, "app.log")
stem = os.path.splitext(os.path.basename(log_file))[0]
parent = os.path.dirname(log_file)

print(log_file)   # /var/log/myapp/app.log
print(stem)       # app
print(parent)     # /var/log/myapp`}
        output={`/var/log/myapp/app.log
app
/var/log/myapp`}
      />

      <CodeBlock
        code={`from pathlib import Path

# pathlib: object-oriented, / operator for joining
base = Path("/var/log")
log_file = base / "myapp" / "app.log"

print(log_file)          # /var/log/myapp/app.log
print(log_file.stem)     # app
print(log_file.suffix)   # .log
print(log_file.parent)   # /var/log/myapp
print(log_file.name)     # app.log

# Read/write directly on Path objects
# log_file.write_text("hello")
# contents = log_file.read_text()

# Glob and rglob
# for py_file in Path("src").rglob("*.py"):
#     print(py_file)`}
        output={`/var/log/myapp/app.log
app
.log
/var/log/myapp
app.log`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Path.walk() (3.12): os.walk replacement
      </h3>

      <CodeBlock
        code={`from pathlib import Path

# Before 3.12: os.walk returns string tuples
import os
for dirpath, dirnames, filenames in os.walk("/tmp/project"):
    for filename in filenames:
        full = os.path.join(dirpath, filename)   # back to string hell

# Python 3.12: Path.walk() returns Path objects
for dirpath, dirnames, filenames in Path("/tmp/project").walk():
    for filename in filenames:
        full = dirpath / filename   # Path all the way through`}
      />
    </section>
  );
}
