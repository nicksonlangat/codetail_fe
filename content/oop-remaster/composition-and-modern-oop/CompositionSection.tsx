import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CompositionSection() {
  return (
    <section>
      <h2
        id="composition"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Composition over inheritance
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Inheritance looks appealing because it lets you reuse code without copying it. But when
        used purely for code reuse, rather than to model genuine IS-A relationships, it creates
        fragile hierarchies that are painful to change.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here is a concrete example. You want a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          UserService
        </code>{" "}
        that can log and send emails. You reach for inheritance:
      </p>

      <CodeBlock
        code={`class Logger:
    def log(self, msg):
        print(f"[LOG] {msg}")

class Emailer:
    def email(self, to, body):
        print(f"Email to {to}: {body}")

# Multiple inheritance to "get" both
class UserService(Logger, Emailer):
    def create_user(self, name, email):
        self.log(f"Creating {name}")
        self.email(email, f"Welcome, {name}!")

svc = UserService()
svc.create_user("Alice", "alice@example.com")`}
        output={`[LOG] Creating Alice
Email to alice@example.com: Welcome, Alice!`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        It works. But{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          UserService
        </code>{" "}
        is not a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Logger</code>{" "}
        and is not an{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Emailer</code>
        . It uses them. Now every instance of{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          UserService
        </code>{" "}
        is permanently tied to those specific implementations. You cannot switch to a file-based
        logger in tests, or stub out the emailer, without changing the class itself.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        The composition version
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Composition means your class holds a reference to another object instead of inheriting
        from it. The dependency is passed in from outside:
      </p>

      <CodeBlock
        code={`class Logger:
    def log(self, msg):
        print(f"[LOG] {msg}")

class Emailer:
    def email(self, to, body):
        print(f"Email to {to}: {body}")

class UserService:
    def __init__(self, logger: Logger, emailer: Emailer):
        self._logger  = logger
        self._emailer = emailer

    def create_user(self, name, email):
        self._logger.log(f"Creating {name}")
        self._emailer.email(email, f"Welcome, {name}!")

# Production
svc = UserService(Logger(), Emailer())
svc.create_user("Alice", "alice@example.com")

# In tests: pass a silent logger, stub emailer
class SilentLogger:
    def log(self, msg): pass

class FakeEmailer:
    def __init__(self):
        self.sent = []
    def email(self, to, body):
        self.sent.append((to, body))

fake_emailer = FakeEmailer()
test_svc = UserService(SilentLogger(), fake_emailer)
test_svc.create_user("Bob", "bob@example.com")
print(fake_emailer.sent)   # [('bob@example.com', 'Welcome, Bob!')]`}
        output={`Email to alice@example.com: Welcome, Alice!
[LOG] Creating Alice
[('bob@example.com', 'Welcome, Bob!')]`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          UserService
        </code>{" "}
        now has no hardcoded dependencies. You swap implementations by passing different objects.
        This is dependency injection, and it does not require a framework. It is just composition.
      </p>
    </section>
  );
}
