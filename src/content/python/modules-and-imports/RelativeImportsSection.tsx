import { CodeBlock } from "@/components/blog/interactive/code-block";

export function RelativeImportsSection() {
  return (
    <section>
      <h2 id="relative-imports" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Relative imports
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Inside a package, you can import from sibling modules using dots. One dot
        means the current package. Two dots mean the parent package. Relative imports
        only work inside packages — not in scripts you run directly.
      </p>

      <CodeBlock
        code={`# Project structure:
# myapp/
#   __init__.py
#   models.py
#   utils.py
#   api/
#     __init__.py
#     routes.py
#     auth.py

# Inside myapp/api/routes.py:
from . import auth                 # sibling module in same package
from .auth import verify_token     # specific name from sibling

from .. import models              # module in parent package
from ..utils import format_date    # specific name from parent module`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Absolute vs relative — which to prefer</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Absolute imports are explicit and work from anywhere. Relative imports are
        shorter inside deeply nested packages. The Python community generally prefers
        absolute imports — they survive renaming and restructuring without breaking.
      </p>

      <CodeBlock
        code={`# myapp/api/routes.py

# Absolute — always clear, always works
from myapp.models import User
from myapp.utils import format_date

# Relative — shorter, but breaks if you move or rename the package
from ..models import User
from ..utils import format_date`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-4">
        <p className="text-[13px] text-foreground/70 italic">
          If you run a file directly and it uses relative imports, Python raises{" "}
          <span className="font-mono">ImportError: attempted relative import with no known parent package</span>.
          Relative imports require the file to be part of an installed package,
          not a standalone script.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Circular imports</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A circular import occurs when module A imports B, and B imports A. Python
        partially executes A before finishing B&apos;s import of A, which gives B
        an incomplete view of A. The result is usually an{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">ImportError</code>{" "}
        or a missing attribute at runtime.
      </p>

      <CodeBlock
        code={`# a.py — imports from b
from b import greet

def name():
    return "Alice"

# b.py — imports from a (circular!)
from a import name

def greet():
    return f"Hello, {name()}"
# ImportError: cannot import name 'name' from partially initialized module 'a'`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4 mb-4">
        Fix circular imports by moving shared code into a third module that both
        A and B import, or by deferring the import inside the function where it
        is actually used.
      </p>

      <CodeBlock
        code={`# shared.py — neither a.py nor b.py imports the other
def name():
    return "Alice"

# b.py — imports only from shared
from shared import name

def greet():
    return f"Hello, {name()}"

# a.py — imports only from shared and b
from shared import name
from b import greet

print(greet())   # Hello, Alice`}
        output={`Hello, Alice`}
      />
    </section>
  );
}
