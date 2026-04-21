import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PathlibSection() {
  return (
    <section>
      <h2 id="pathlib" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        pathlib
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">pathlib.Path</code>{" "}
        is the modern way to work with file paths. It is object-oriented, cross-platform,
        and far more readable than string concatenation or{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">os.path</code>.
        Prefer it for all new code.
      </p>

      <CodeBlock
        code={`from pathlib import Path

p = Path("/home/user/documents/report.pdf")

# Parts and properties
print(p.name)       # report.pdf
print(p.stem)       # report
print(p.suffix)     # .pdf
print(p.parent)     # /home/user/documents

# Building paths with /
base    = Path("/home/user")
config  = base / "config" / "settings.json"
print(config)       # /home/user/config/settings.json

# Current directory and relatives
here    = Path.cwd()
home    = Path.home()
sibling = Path(__file__).parent / "data.csv"`}
        output={`report.pdf
report
.pdf
/home/user/documents
/home/user/config/settings.json`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Common operations</h3>

      <CodeBlock
        code={`from pathlib import Path

p = Path("data/output.txt")

# Check existence and type
print(p.exists())       # True/False
print(p.is_file())      # True if it's a regular file
print(p.is_dir())       # True if it's a directory

# Create directories
Path("logs/2024").mkdir(parents=True, exist_ok=True)

# Read and write directly — no open() needed
p.write_text("hello\n", encoding="utf-8")
content = p.read_text(encoding="utf-8")

p.write_bytes(b"\x00\x01\x02")
data = p.read_bytes()

# Glob for files
for csv_file in Path("data").glob("*.csv"):
    print(csv_file.name)

# Recursive glob
for py_file in Path(".").rglob("*.py"):
    print(py_file)`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">File operations</h3>

      <CodeBlock
        code={`from pathlib import Path
import shutil

src = Path("report.txt")
dst = Path("archive/report_backup.txt")

# Rename / move
src.rename(dst)               # moves within the same filesystem
shutil.move(str(src), str(dst))  # works across filesystems

# Copy
shutil.copy2(src, dst)        # copy with metadata

# Delete
src.unlink()                  # delete file
src.unlink(missing_ok=True)   # no error if absent (Python 3.8+)

Path("empty_dir").rmdir()     # delete empty dir
shutil.rmtree("dir_tree")     # delete directory and all contents`}
      />
    </section>
  );
}
