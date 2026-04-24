import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ImportSyntaxSection() {
  return (
    <section>
      <h2 id="import-syntax" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Import syntax
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python has four import forms. Each serves a different purpose.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-3">import module</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Imports the whole module. You access names through the module object using
        dot notation. This keeps your local namespace clean and makes every name&apos;s
        origin obvious at a glance.
      </p>

      <CodeBlock
        code={`import os
import json

home = os.path.expanduser("~")
data = json.loads('{"key": "value"}')

# The source is unambiguous — you always know where a name came from
print(os.getcwd())   # /home/user/project`}
        output={`/home/user/project`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">from module import name</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Imports specific names directly into your namespace.
        Use this when you need only one or two things from a large module and the
        context is clear without the module prefix.
      </p>

      <CodeBlock
        code={`from math import sqrt, pi
from pathlib import Path
from datetime import datetime, timedelta

print(sqrt(25))    # 5.0
print(pi)          # 3.141592653589793

# Multiple imports from the same module can span lines
from os.path import (
    join,
    exists,
    dirname,
)`}
        output={`5.0
3.141592653589793`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">import module as alias</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Aliases shorten long module names. The data science ecosystem has settled
        on a few conventions — use them so your code looks familiar to everyone else.
      </p>

      <CodeBlock
        code={`import numpy as np          # universal convention
import pandas as pd         # universal convention
import matplotlib.pyplot as plt
import datetime as dt       # useful when the full name is repetitive

arr   = np.array([1, 2, 3])
today = dt.date.today()`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Wildcard imports — avoid them</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">from module import *</code>{" "}
        dumps every public name from the module into your current namespace.
        This makes it impossible to tell where any name came from, and it silently
        overwrites names that were already defined.
      </p>

      <CodeBlock
        code={`# Bad — where does chain come from? Where does sqrt come from?
from itertools import *
from math import *

result = chain([1, 2], [3, 4])   # itertools? math? your own code?
val = sqrt(9)                    # ambiguous

# Good — every source is explicit
from itertools import chain
from math import sqrt`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4 mb-4">
        The only accepted use of wildcard imports is inside{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__.py</code>{" "}
        to re-export a curated public API, controlled by{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__all__</code>.
      </p>
    </section>
  );
}
