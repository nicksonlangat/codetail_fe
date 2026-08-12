import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DataclassSection() {
  return (
    <section>
      <h2
        id="dataclass"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        @dataclass: stop writing boilerplate
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A huge portion of classes in real code are just containers for data. You write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __init__
        </code>{" "}
        to store the arguments,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __repr__
        </code>{" "}
        so it prints nicely,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __eq__
        </code>{" "}
        so two instances with the same data compare equal. The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @dataclass
        </code>{" "}
        decorator generates all of that automatically.
      </p>

      <CodeBlock
        code={`from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

# __init__, __repr__, and __eq__ are all generated
p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
p3 = Point(3.0, 4.0)

print(p1)          # Point(x=1.0, y=2.0)
print(p1 == p2)    # True
print(p1 == p3)    # False`}
        output={`Point(x=1.0, y=2.0)
True
False`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Default values and field()
      </h3>

      <CodeBlock
        code={`from dataclasses import dataclass, field

@dataclass
class Config:
    host: str = "localhost"
    port: int  = 8080
    tags: list[str] = field(default_factory=list)  # mutable defaults need field()

c1 = Config()
c2 = Config(host="prod.example.com", port=443)

print(c1)   # Config(host='localhost', port=8080, tags=[])
print(c2)   # Config(host='prod.example.com', port=443, tags=[])`}
        output={`Config(host='localhost', port=8080, tags=[])
Config(host='prod.example.com', port=443, tags=[])`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Gotcha: never use a mutable object (list, dict) as a plain default value in a dataclass.
        Use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          field(default_factory=list)
        </code>{" "}
        instead. The reason is the same shared-mutable-class-attribute problem from Article 2.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        frozen=True for immutable value objects
      </h3>

      <CodeBlock
        code={`from dataclasses import dataclass

@dataclass(frozen=True)   # instances are immutable and hashable
class Color:
    r: int
    g: int
    b: int

    def to_hex(self):
        return f"#{self.r:02x}{self.g:02x}{self.b:02x}"

red = Color(255, 0, 0)
print(red.to_hex())     # #ff0000

# Immutable: cannot change attributes
try:
    red.r = 128
except Exception as e:
    print(e)

# Hashable: can use in sets and as dict keys
palette = {Color(255, 0, 0), Color(0, 255, 0), Color(0, 0, 255)}
print(len(palette))   # 3`}
        output={`#ff0000
cannot assign to field 'r'
3`}
      />
    </section>
  );
}
