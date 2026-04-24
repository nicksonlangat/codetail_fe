import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PackagesSection() {
  return (
    <section>
      <h2 id="packages" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Packages
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A package is a directory that contains an{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__.py</code>{" "}
        file. That file marks the directory as a package and can be empty or expose
        the package&apos;s public API. Packages let you organize related modules into
        a hierarchy that mirrors your project&apos;s structure.
      </p>

      <CodeBlock
        code={`# A typical project layout
myapp/
    __init__.py        # makes myapp a package
    models.py
    utils.py
    api/
        __init__.py    # makes api a nested package
        routes.py
        auth.py`}
      />

      <CodeBlock
        code={`# Importing from a package
import myapp.models                   # full dotted path
from myapp import utils               # module from a package
from myapp.api import routes          # module from a nested package
from myapp.api.auth import verify_token  # name from a nested module`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">__init__.py as a public API</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When someone imports your package, they see what{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__.py</code>{" "}
        exposes. Use it to pull the most important names up to the top level so
        callers don&apos;t need to know your internal file structure.
      </p>

      <CodeBlock
        code={`# myapp/__init__.py
from .models import User, Product      # re-export from submodules
from .utils import format_currency

# Now callers can write:
from myapp import User
# instead of navigating the internals:
from myapp.models import User`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">__all__ controls what gets exported</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__all__</code>{" "}
        is a list of names that{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">from module import *</code>{" "}
        will include. Even if you never use wildcard imports yourself, it serves
        as documentation: it tells readers which names are part of the public interface.
      </p>

      <CodeBlock
        code={`# myapp/utils.py
__all__ = ["format_currency", "parse_date"]  # public API

def format_currency(amount, symbol="$"):
    return f"{symbol}{amount:.2f}"

def parse_date(s):
    from datetime import datetime
    return datetime.strptime(s, "%Y-%m-%d")

def _build_query(params):   # underscore = private by convention
    pass`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Namespace packages</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python 3.3 and later support namespace packages: directories without{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__.py</code>.
        They are useful for splitting one logical package across multiple directories
        or repositories. For ordinary projects, always include{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__.py</code>.
        It is explicit and avoids surprising behavior.
      </p>
    </section>
  );
}
