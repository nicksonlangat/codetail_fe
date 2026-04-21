import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PatternsSection() {
  return (
    <section>
      <h2 id="patterns" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Patterns
      </h2>

      <h3 className="text-base font-semibold mb-3">EAFP vs LBYL</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Two philosophies for dealing with conditions that might fail.{" "}
        <strong>LBYL</strong> (Look Before You Leap) checks before acting.{" "}
        <strong>EAFP</strong> (Easier to Ask Forgiveness than Permission) just tries
        and catches the failure. Python culture favours EAFP — it is often more readable
        and avoids race conditions.
      </p>

      <CodeBlock
        code={`# LBYL — check first
def get_value_lbyl(d, key):
    if key in d:          # check
        return d[key]     # then act
    return None

# EAFP — try and catch
def get_value_eafp(d, key):
    try:
        return d[key]     # try
    except KeyError:      # handle failure
        return None

# EAFP has fewer race conditions in concurrent code:
# between "if file exists" and "open file", the file can be deleted
# LBYL (prone to TOCTOU):
import os
if os.path.exists("data.txt"):
    with open("data.txt") as f:   # file could be gone now
        data = f.read()

# EAFP (safe):
try:
    with open("data.txt") as f:
        data = f.read()
except FileNotFoundError:
    data = None`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Graceful degradation</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Catch exceptions at the right level — where you have enough context to handle
        them meaningfully. Catch too low and you suppress useful errors. Catch too high
        and you lose precision.
      </p>

      <CodeBlock
        code={`import json
import logging

def load_user_config(path: str) -> dict:
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        logging.info("no config at %s, using defaults", path)
        return {}
    except json.JSONDecodeError as e:
        logging.warning("invalid config at %s: %s", path, e)
        return {}

# The caller gets a clean dict regardless — it never sees the exception
config = load_user_config("~/.myapp.json")`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Exception groups (Python 3.11+)</h3>

      <CodeBlock
        code={`# Python 3.11 introduced ExceptionGroup for handling multiple exceptions
# raised concurrently (e.g., from asyncio task groups)

try:
    raise ExceptionGroup("multiple failures", [
        ValueError("bad value"),
        TypeError("wrong type"),
    ])
except* ValueError as eg:
    print("value errors:", eg.exceptions)
except* TypeError as eg:
    print("type errors:", eg.exceptions)`}
        output={`value errors: (ValueError('bad value'),)
type errors: (TypeError('wrong type'),)`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">What not to do</h3>

      <CodeBlock
        code={`# Bad — bare except swallows everything
try:
    risky()
except:
    pass

# Bad — catching Exception too broadly hides bugs
try:
    result = complex_calculation()
except Exception:
    result = 0   # was it a real 0 or a bug?

# Bad — using exceptions for normal control flow
def find_index(items, target):
    try:
        return items.index(target)
    except ValueError:
        return -1   # just use list.index() + a check, or next()`}
      />
    </section>
  );
}
