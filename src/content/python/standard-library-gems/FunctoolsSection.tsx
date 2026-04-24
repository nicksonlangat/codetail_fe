import { CodeBlock } from "@/components/blog/interactive/code-block";

export function FunctoolsSection() {
  return (
    <section>
      <h2 id="functools" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        functools
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">functools</code>{" "}
        contains higher-order functions: tools that operate on or return other functions.
        Three of them are genuinely useful in everyday code.
      </p>

      <h3 className="text-base font-semibold mt-6 mb-3">lru_cache — memoization in one line</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@lru_cache</code>{" "}
        caches the results of a function. On subsequent calls with the same arguments,
        it returns the cached value instead of recomputing. Use it for pure functions
        with expensive or repeated calculations.
      </p>

      <CodeBlock
        code={`from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(35))   # 9227465

# Inspect how the cache is being used
print(fibonacci.cache_info())
# CacheInfo(hits=33, misses=36, maxsize=128, currsize=36)

# Clear the cache when needed
fibonacci.cache_clear()`}
        output={`9227465
CacheInfo(hits=33, misses=36, maxsize=128, currsize=36)`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-4 mb-4">
        Without caching, naive recursive Fibonacci for n=35 makes over 29 million
        function calls. With{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@lru_cache</code>,
        it makes 36. Arguments must be hashable — no lists or dicts.
      </p>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Python 3.9 added{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@cache</code>{" "}
        as a shorthand for{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@lru_cache(maxsize=None)</code>,
        which keeps every result forever. Use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@lru_cache</code>{" "}
        when you need a bounded cache; use{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@cache</code>{" "}
        when the input space is small.
      </p>

      <h3 className="text-base font-semibold mt-8 mb-3">partial — pre-fill arguments</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">partial</code>{" "}
        creates a new function with some arguments already filled in. It is a
        cleaner alternative to writing a one-line lambda wrapper.
      </p>

      <CodeBlock
        code={`from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube   = partial(power, exponent=3)

print(square(4))   # 16
print(cube(3))     # 27

# Common use: adapting a function for filter() or map()
def starts_with(prefix, s):
    return s.startswith(prefix)

is_py = partial(starts_with, "py")
files = ["pyproject.toml", "README.md", "pytest.ini", "setup.cfg"]
print(list(filter(is_py, files)))   # ['pyproject.toml', 'pytest.ini']`}
        output={`16
27
['pyproject.toml', 'pytest.ini']`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">reduce — fold a sequence</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">reduce</code>{" "}
        applies a function cumulatively to a sequence, reducing it to a single value.
        The optional third argument is the starting value.
      </p>

      <CodeBlock
        code={`from functools import reduce
import operator

nums = [1, 2, 3, 4, 5]

# Sum:     ((((1+2)+3)+4)+5) = 15
print(reduce(operator.add, nums))        # 15

# Product: 1*2*3*4*5 = 120
print(reduce(operator.mul, nums))        # 120

# With a starting value
print(reduce(operator.add, nums, 100))   # 115

# Flatten one level of nesting
nested = [[1, 2], [3, 4], [5, 6]]
flat = reduce(operator.add, nested)
print(flat)   # [1, 2, 3, 4, 5, 6]`}
        output={`15
120
115
[1, 2, 3, 4, 5, 6]`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-4">
        <p className="text-[13px] text-foreground/70 italic">
          For simple cases like sum and product, use the built-ins{" "}
          <span className="font-mono">sum()</span> and{" "}
          <span className="font-mono">math.prod()</span> instead.{" "}
          <span className="font-mono">reduce</span> earns its place when the combining
          operation is non-trivial or you receive the function as an argument.
        </p>
      </div>
    </section>
  );
}
