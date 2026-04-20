import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DecoratorsSection() {
  return (
    <section>
      <h2 id="decorators" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Decorators
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A decorator is a function that takes another function and returns a replacement.
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@</code>{" "}
        syntax is shorthand for{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">func = decorator(func)</code>.
        Decorators let you add behaviour — logging, timing, caching, authentication —
        to functions without touching their code.
      </p>

      <CodeBlock
        code={`# A decorator is just a function that wraps another
def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

# @log_calls is the same as: add = log_calls(add)
@log_calls
def add(x, y):
    return x + y

add(3, 4)
# calling add
# add returned 7`}
        output={`calling add
add returned 7`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Preserving metadata with @wraps</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Without{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@wraps</code>,
        the decorated function loses its name and docstring. Always use it.
      </p>

      <CodeBlock
        code={`from functools import wraps

def log_calls(func):
    @wraps(func)             # copies __name__, __doc__, etc.
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(x: int, y: int) -> int:
    """Add two numbers."""
    return x + y

print(add.__name__)    # add  (not 'wrapper')
print(add.__doc__)     # Add two numbers.`}
        output={`add
Add two numbers.`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Decorators with arguments</h3>

      <CodeBlock
        code={`from functools import wraps

def retry(times=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1:
                        raise
                    print(f"attempt {attempt + 1} failed: {e}, retrying...")
        return wrapper
    return decorator

@retry(times=3)
def flaky_task():
    import random
    if random.random() < 0.7:
        raise RuntimeError("network error")
    return "done"`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Stacking decorators</h3>

      <CodeBlock
        code={`from functools import wraps, lru_cache

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

# Applied bottom-up: lru_cache first, then timer
@timer
@lru_cache(maxsize=128)
def fib(n):
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)

fib(30)`}
        output={`fib: 0.0001s`}
      />
    </section>
  );
}
