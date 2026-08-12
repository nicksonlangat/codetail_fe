import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ProtocolSection() {
  return (
    <section>
      <h2
        id="protocol"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Protocol: structural subtyping
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        ABCs use nominal subtyping: to be considered a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          NotificationBackend
        </code>
        , you must explicitly inherit from it. Python 3.8 introduced{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Protocol</code>{" "}
        from the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">typing</code>{" "}
        module, which uses structural subtyping: any class that has the right methods qualifies,
        regardless of what it inherits from.
      </p>

      <CodeBlock
        code={`from typing import Protocol

class Sendable(Protocol):
    def send(self, to: str, subject: str, body: str) -> None:
        ...

# No inheritance required
class EmailBackend:
    def send(self, to, subject, body):
        print(f"Emailing {to}: {subject}")

class SMSBackend:
    def send(self, to, subject, body):
        print(f"Texting {to}: {body}")

def notify(backend: Sendable, to: str, subject: str, body: str) -> None:
    backend.send(to, subject, body)

# Both pass the type checker, neither inherits from Sendable
notify(EmailBackend(), "alice@example.com", "Hi", "Hello")
notify(SMSBackend(), "+1555000000", "Hi", "Hello")`}
        output={`Emailing alice@example.com: Hi
Texting +1555000000: Hi`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Protocols are primarily a type-checking tool. A static type checker like mypy or pyright
        will flag code that passes the wrong type without you needing to add{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          isinstance()
        </code>{" "}
        checks everywhere.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        runtime_checkable
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        By default, you cannot use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          isinstance(x, Sendable)
        </code>{" "}
        at runtime. Add the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @runtime_checkable
        </code>{" "}
        decorator if you need that:
      </p>

      <CodeBlock
        code={`from typing import Protocol, runtime_checkable

@runtime_checkable
class Sendable(Protocol):
    def send(self, to: str, subject: str, body: str) -> None:
        ...

class EmailBackend:
    def send(self, to, subject, body):
        print(f"Emailing {to}: {subject}")

e = EmailBackend()
print(isinstance(e, Sendable))   # True -- has .send()`}
        output={`True`}
      />
    </section>
  );
}
