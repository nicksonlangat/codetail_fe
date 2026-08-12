import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DictMergeSection() {
  return (
    <section>
      <h2
        id="dict-merge"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Dict merge with | (3.9)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Merging two dicts had three common approaches before 3.9. None of them were obvious at a
        glance.
      </p>

      <CodeBlock
        code={`defaults = {"timeout": 30, "retries": 3, "verbose": False}
overrides = {"timeout": 60, "debug": True}

# Option 1: dict() with unpacking -- verbose
merged = {**defaults, **overrides}

# Option 2: update() -- mutates in place, no new dict
config = dict(defaults)
config.update(overrides)

# Option 3: ChainMap -- lazy, reads from first dict that has the key
from collections import ChainMap
merged = dict(ChainMap(overrides, defaults))`}
      />

      <CodeBlock
        code={`defaults = {"timeout": 30, "retries": 3, "verbose": False}
overrides = {"timeout": 60, "debug": True}

# Python 3.9: | creates a new merged dict, right side wins on conflicts
config = defaults | overrides
print(config)

# |= merges in place, like dict.update()
config = dict(defaults)
config |= overrides
print(config)

# Left-to-right precedence: right operand wins
print({"a": 1} | {"a": 2})   # {'a': 2}`}
        output={`{'timeout': 60, 'retries': 3, 'verbose': False, 'debug': True}
{'timeout': 60, 'retries': 3, 'verbose': False, 'debug': True}
{'a': 2}`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The practical use: layering configs. Start with defaults, overlay environment-specific
        settings, overlay user-provided overrides. Each layer is a plain dict merge with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">|</code>
        .
      </p>

      <CodeBlock
        code={`base = {"host": "localhost", "port": 5432, "timeout": 30}
env  = {"host": "db.prod.example.com", "port": 5432}
user = {"timeout": 60}

final = base | env | user
print(final)`}
        output={`{'host': 'db.prod.example.com', 'port': 5432, 'timeout': 60}`}
      />
    </section>
  );
}
