import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DataclassOptionsSection() {
  return (
    <section>
      <h2
        id="dataclass-options"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        dataclass options: slots, order, field(), __post_init__
      </h2>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        slots=True (3.10): leaner memory, faster attribute access
      </h3>

      <CodeBlock
        code={`from dataclasses import dataclass

# Without slots: every instance has a __dict__, which is a full dict
@dataclass
class PointDict:
    x: float
    y: float

# With slots: attributes stored in a compact fixed-size struct
@dataclass(slots=True)
class PointSlots:
    x: float
    y: float

import sys
p_dict  = PointDict(1.0, 2.0)
p_slots = PointSlots(1.0, 2.0)

print(sys.getsizeof(p_dict.__dict__))   # ~184 bytes
print(hasattr(p_slots, "__dict__"))     # False -- no dict at all`}
        output={`184
False`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          slots=True
        </code>{" "}
        when you create many instances (data pipelines, game objects, simulation entities). The
        trade-off: you cannot add arbitrary attributes at runtime, and slots do not work with
        multiple inheritance from non-slot parents.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        field(): mutable defaults and metadata
      </h3>

      <CodeBlock
        code={`from dataclasses import dataclass, field

@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
    tags: list[str] = field(default_factory=list)   # never a plain [] here
    max_retries: int = field(default=3, repr=False)  # hidden in repr

c = Config()
print(c)   # Config(host='localhost', port=8080, tags=[])`}
        output={`Config(host='localhost', port=8080, tags=[])`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Rule: any mutable default (list, dict, set) must use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          field(default_factory=...)
        </code>
        . Writing{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          tags: list[str] = []
        </code>{" "}
        is a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          ValueError
        </code>{" "}
        at class definition time. Dataclass catches this mistake for you.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        __post_init__: validation after generation
      </h3>

      <CodeBlock
        code={`from dataclasses import dataclass

@dataclass
class Range:
    start: float
    end: float

    def __post_init__(self) -> None:
        if self.end <= self.start:
            raise ValueError(f"end ({self.end}) must be greater than start ({self.start})")

    @property
    def length(self) -> float:
        return self.end - self.start

r = Range(1.0, 5.0)
print(r.length)   # 4.0

Range(5.0, 1.0)   # ValueError`}
        output={`4.0
ValueError: end (1.0) must be greater than start (5.0)`}
      />
    </section>
  );
}
