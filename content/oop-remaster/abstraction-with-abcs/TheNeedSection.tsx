import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TheNeedSection() {
  return (
    <section>
      <h2
        id="the-need"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Duck typing works, until it doesn't
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Duck typing is powerful, but it offers no guarantees. If you define a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          NotificationService
        </code>{" "}
        that all notification backends should implement, nothing stops someone from writing a backend
        that forgets one of the required methods. The error only shows up at runtime, when the
        missing method is actually called.
      </p>

      <CodeBlock
        code={`# A contract described in a comment is not enforced
# All backends must implement: send(to, subject, body)

class EmailBackend:
    def send(self, to, subject, body):
        print(f"Emailing {to}: {subject}")

class SMSBackend:
    def send(self, to, subject, body):
        print(f"Texting {to}: {body}")

class SlackBackend:
    def notify(self, to, message):   # oops, wrong method name
        print(f"Slacking {to}: {message}")

def notify_user(backend, user):
    backend.send(user.email, "Hello", "Welcome!")

# This fails at runtime, not at class definition time
slack = SlackBackend()
notify_user(slack, user)   # AttributeError: 'SlackBackend' has no 'send'`}
        output={`AttributeError: 'SlackBackend' object has no attribute 'send'`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        For a small team or a personal project, this is often fine. For a library or a large
        codebase where multiple people implement the same interface, you want the error earlier.
        Ideally when someone defines the class, not when they call it in production.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Abstract base classes give you that earlier error.
      </p>
    </section>
  );
}
