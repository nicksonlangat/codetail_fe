import { CodeBlock } from "@/components/blog/interactive/code-block";

export function RaiseSection() {
  return (
    <section>
      <h2 id="raise" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Raising exceptions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">raise</code>{" "}
        to signal that something went wrong. Pick the most specific built-in exception
        that fits, or define a custom one. A clear exception with a descriptive message
        saves hours of debugging.
      </p>

      <CodeBlock
        code={`def set_age(age: int) -> None:
    if not isinstance(age, int):
        raise TypeError(f"age must be int, got {type(age).__name__}")
    if age < 0 or age > 150:
        raise ValueError(f"age must be between 0 and 150, got {age}")

set_age(25)       # fine
set_age("old")    # TypeError: age must be int, got str
set_age(-1)       # ValueError: age must be between 0 and 150, got -1`}
        output={`TypeError: age must be int, got str
ValueError: age must be between 0 and 150, got -1`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">raise from — chaining exceptions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">raise NewException from original</code>{" "}
        attaches the original exception as the cause. The traceback shows both. This is
        important for library code — translate low-level exceptions into domain-level
        ones without hiding the root cause.
      </p>

      <CodeBlock
        code={`class DatabaseError(Exception):
    pass

def get_user(user_id: int):
    try:
        # simulated DB lookup
        raw = {"1": "Alice"}[str(user_id)]
        return raw
    except KeyError as e:
        raise DatabaseError(f"user {user_id} not found") from e

try:
    get_user(99)
except DatabaseError as e:
    print(e)         # user 99 not found
    print(e.__cause__)   # '99'  — the original KeyError`}
        output={`user 99 not found
'99'`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Custom exceptions</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Define custom exceptions by subclassing{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">Exception</code>.
        Group related exceptions under a base class so callers can catch them broadly
        or specifically.
      </p>

      <CodeBlock
        code={`class AppError(Exception):
    """Base class for all application errors."""

class ValidationError(AppError):
    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(f"{field}: {message}")

class NotFoundError(AppError):
    def __init__(self, resource: str, id):
        super().__init__(f"{resource} with id={id} not found")

def get_product(product_id: int):
    if product_id <= 0:
        raise ValidationError("product_id", "must be positive")
    if product_id > 100:
        raise NotFoundError("Product", product_id)
    return {"id": product_id, "name": "Widget"}

try:
    get_product(999)
except ValidationError as e:
    print(f"validation: {e.field} — {e}")
except NotFoundError as e:
    print(f"not found: {e}")
except AppError as e:
    print(f"app error: {e}")   # catches any other AppError`}
        output={`not found: Product with id=999 not found`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Re-raising</h3>

      <CodeBlock
        code={`import logging

def process(data):
    try:
        return int(data)
    except ValueError as e:
        logging.error("failed to parse data: %s", e)
        raise    # re-raise the same exception, preserving traceback

# Or raise a different exception
def load(path):
    try:
        with open(path) as f:
            return f.read()
    except OSError as e:
        raise RuntimeError(f"failed to load {path}") from e`}
      />
    </section>
  );
}
