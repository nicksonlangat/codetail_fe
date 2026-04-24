import { CodeBlock } from "@/components/blog/interactive/code-block";

export function SysPathSection() {
  return (
    <section>
      <h2 id="sys-path" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        How Python finds modules
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When you write{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">import utils</code>,
        Python searches a list of directories called{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sys.path</code>{" "}
        in order. It imports the first match it finds. If nothing matches, you
        get{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">ModuleNotFoundError</code>.
      </p>

      <CodeBlock
        code={`import sys

for path in sys.path:
    print(path)`}
        output={`/home/user/project                            # script directory
/home/user/.venv/lib/python3.12/site-packages  # installed packages
/usr/lib/python3.12
/usr/lib/python3.12/lib-dynload`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4 mb-4">
        Python searches in this order:
      </p>

      <ol className="list-decimal list-inside space-y-1.5 text-[15px] text-foreground/90 mb-6 pl-1">
        <li>The directory containing the script being run (or the current directory in the REPL)</li>
        <li>
          Directories listed in the{" "}
          <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">PYTHONPATH</code>{" "}
          environment variable
        </li>
        <li>Standard library directories</li>
        <li>Site-packages (where pip installs third-party packages)</li>
      </ol>

      <h3 className="text-base font-semibold mt-8 mb-3">Why ModuleNotFoundError happens</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most common causes:
      </p>

      <CodeBlock
        code={`# 1. Package not installed in this environment
import requests   # fix: pip install requests

# 2. Wrong virtual environment — always check which Python you're using
import sys
print(sys.executable)   # shows the exact binary
# /home/user/wrong-project/.venv/bin/python

# 3. Module file is in the wrong location relative to the script
# script at:  project/scripts/run.py
# module at:  project/utils.py
# Python only looks in project/scripts/, not project/
# fix: structure as a package and install it properly`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-4">
        <p className="text-[13px] text-foreground/70 italic">
          Never modify{" "}
          <span className="font-mono">sys.path</span>{" "}
          in production code. Use a proper package structure and install it in
          development mode with{" "}
          <span className="font-mono">pip install -e .</span>{" "}
          so Python finds it the right way.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Module caching</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python caches every imported module in{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">sys.modules</code>.
        Importing the same module a second time does not re-execute its code — it
        returns the cached object immediately. This is why import side effects only
        run once.
      </p>

      <CodeBlock
        code={`import sys
import math

# Already cached from the import above
print("math" in sys.modules)        # True
print(sys.modules["math"] is math)  # True — same object, not a copy`}
        output={`True
True`}
      />
    </section>
  );
}
