import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ABCSection() {
  return (
    <section>
      <h2
        id="abc"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        ABC and @abstractmethod
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Python's{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">abc</code>{" "}
        module provides{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">ABC</code>{" "}
        (Abstract Base Class) and the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @abstractmethod
        </code>{" "}
        decorator. When you mark a method as abstract, any class that inherits from your ABC but
        does not implement that method cannot be instantiated. The error happens at class
        instantiation, not at the call site.
      </p>

      <CodeBlock
        code={`from abc import ABC, abstractmethod

class NotificationBackend(ABC):
    @abstractmethod
    def send(self, to: str, subject: str, body: str) -> None:
        """Send a notification to the given address."""

class EmailBackend(NotificationBackend):
    def send(self, to, subject, body):
        print(f"Emailing {to}: {subject}")

class SlackBackend(NotificationBackend):
    def notify(self, to, message):   # wrong name, not implementing send
        print(f"Slacking {to}: {message}")

# EmailBackend is fine
e = EmailBackend()   # works

# SlackBackend fails immediately, at instantiation
s = SlackBackend()   # TypeError`}
        output={`TypeError: Can't instantiate abstract class SlackBackend without an implementation for abstract method 'send'`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The error message is clear and tells you exactly what is missing. Compare that to the duck
        typing version, where you get{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          AttributeError
        </code>{" "}
        at some point during program execution, possibly deep in a call stack.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        ABCs can share implementation too
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Abstract methods define the contract. But the ABC can also provide concrete methods that
        are inherited by all subclasses. This is the distinction between an ABC and a pure interface.
      </p>

      <CodeBlock
        code={`from abc import ABC, abstractmethod

class NotificationBackend(ABC):
    @abstractmethod
    def send(self, to: str, subject: str, body: str) -> None:
        pass

    def send_bulk(self, recipients: list, subject: str, body: str) -> None:
        # Concrete method shared by all backends
        for to in recipients:
            self.send(to, subject, body)

class EmailBackend(NotificationBackend):
    def send(self, to, subject, body):
        print(f"Emailing {to}: {subject}")

e = EmailBackend()
e.send_bulk(["alice@example.com", "bob@example.com"], "Hi", "Hello!")`}
        output={`Emailing alice@example.com: Hi
Emailing bob@example.com: Hi`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          send_bulk()
        </code>{" "}
        is implemented once and works for every backend, because it calls{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          self.send()
        </code>{" "}
        which each backend implements its own way.
      </p>
    </section>
  );
}
