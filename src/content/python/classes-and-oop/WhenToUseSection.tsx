import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhenToUseSection() {
  return (
    <section>
      <h2 id="when-to-use" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        When to use classes
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Classes exist for one reason: bundling mutable state and the operations
        on that state. If you do not have persistent state across calls, a plain
        function is simpler and easier to test.
      </p>

      <CodeBlock
        code={`# Unnecessary class — no useful state
class MathHelper:
    def add(self, a, b):   return a + b
    def square(self, x):   return x * x

# Better: plain functions
def add(a, b):    return a + b
def square(x):    return x * x`}
      />

      <CodeBlock
        code={`# Good use: state + behavior together
class RateLimiter:
    def __init__(self, max_calls, period_seconds):
        self.max_calls      = max_calls
        self.period_seconds = period_seconds
        self._calls: list[float] = []

    def allow(self) -> bool:
        import time
        now = time.time()
        self._calls = [t for t in self._calls if now - t < self.period_seconds]
        if len(self._calls) >= self.max_calls:
            return False
        self._calls.append(now)
        return True

# Each endpoint gets its own independent limiter
api_limiter   = RateLimiter(100, 60)
login_limiter = RateLimiter(5,   60)`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">@dataclass for pure data</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        When you need structured data without behavior,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">@dataclass</code>{" "}
        generates{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__</code>,{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__repr__</code>,
        and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__eq__</code>{" "}
        for free.
      </p>

      <CodeBlock
        code={`from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float

@dataclass(frozen=True)    # immutable — safe in sets and dicts
class Color:
    r: int
    g: int
    b: int

@dataclass
class Config:
    host: str = "localhost"
    port: int  = 8080
    tags: list[str] = field(default_factory=list)   # mutable default

p = Point(1.0, 2.0)
print(p)                       # Point(x=1.0, y=2.0)
print(p == Point(1.0, 2.0))   # True

c = Config()
print(c.host, c.port)          # localhost 8080`}
        output={`Point(x=1.0, y=2.0)
True
localhost 8080`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Composition over inheritance</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Deep inheritance hierarchies are hard to change and reason about. When
        you find yourself inheriting just to share code, pass an object instead.
      </p>

      <CodeBlock
        code={`# Inheritance: Logger is tightly coupled to every subclass
class ServiceBase:
    def log(self, msg): print(f"[LOG] {msg}")

class UserService(ServiceBase):
    pass   # inherits log, but must carry all of ServiceBase

# Composition: inject the dependency
class Logger:
    def log(self, msg): print(f"[LOG] {msg}")

class UserService:
    def __init__(self, logger: Logger):
        self.logger = logger

    def create_user(self, name):
        self.logger.log(f"Creating {name}")

svc = UserService(Logger())
svc.create_user("Alice")   # [LOG] Creating Alice`}
        output={`[LOG] Creating Alice`}
      />
    </section>
  );
}
