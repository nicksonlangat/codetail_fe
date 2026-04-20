import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ComprehensionsSection() {
  return (
    <section>
      <h2 id="comprehensions" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Dict comprehensions
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A dict comprehension builds a new dictionary in a single expression, the same
        way a list comprehension builds a list. The syntax is{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">
          {"{ key: value for item in iterable }"}
        </code>.
      </p>

      <CodeBlock
        code={`# Square each number
squares = {n: n ** 2 for n in range(6)}
print(squares)
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Map a list to a dict
names   = ["Alice", "Bob", "Carol"]
lengths = {name: len(name) for name in names}
print(lengths)
# {'Alice': 5, 'Bob': 3, 'Carol': 5}`}
        output={`{0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
{'Alice': 5, 'Bob': 3, 'Carol': 5}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">With a filter condition</h3>

      <CodeBlock
        code={`scores = {"Alice": 92, "Bob": 45, "Carol": 85, "Dan": 38}

# Keep only passing scores
passing = {name: s for name, s in scores.items() if s >= 50}
print(passing)
# {'Alice': 92, 'Carol': 85}`}
        output={`{'Alice': 92, 'Carol': 85}`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Inverting a dict</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Swapping keys and values is a one-liner with a comprehension. It only works
        correctly when all values are unique and hashable.
      </p>

      <CodeBlock
        code={`country_capital = {
    "France":  "Paris",
    "Germany": "Berlin",
    "Japan":   "Tokyo",
}

capital_country = {v: k for k, v in country_capital.items()}
print(capital_country)
# {'Paris': 'France', 'Berlin': 'Germany', 'Tokyo': 'Japan'}

print(capital_country["Tokyo"])    # Japan`}
        output={`{'Paris': 'France', 'Berlin': 'Germany', 'Tokyo': 'Japan'}
Japan`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Building from two lists</h3>

      <CodeBlock
        code={`keys   = ["host", "port", "user"]
values = ["localhost", 5432, "admin"]

config = {k: v for k, v in zip(keys, values)}
print(config)
# {'host': 'localhost', 'port': 5432, 'user': 'admin'}

# dict(zip(...)) is equivalent and slightly shorter
config = dict(zip(keys, values))
print(config)
# {'host': 'localhost', 'port': 5432, 'user': 'admin'}`}
        output={`{'host': 'localhost', 'port': 5432, 'user': 'admin'}
{'host': 'localhost', 'port': 5432, 'user': 'admin'}`}
      />
    </section>
  );
}
