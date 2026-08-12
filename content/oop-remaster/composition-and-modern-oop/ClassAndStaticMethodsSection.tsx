import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ClassAndStaticMethodsSection() {
  return (
    <section>
      <h2
        id="class-and-static-methods"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        @classmethod and @staticmethod
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Regular methods receive the instance as{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>.
        Two other kinds of methods do not.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        @classmethod: alternative constructors
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A class method receives the class itself as{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">cls</code>{" "}
        instead of an instance. The main use case is providing alternative ways to create instances
        (factory methods):
      </p>

      <CodeBlock
        code={`from dataclasses import dataclass
from datetime import datetime

@dataclass
class Event:
    title: str
    start: datetime
    end: datetime

    @classmethod
    def from_strings(cls, title: str, start: str, end: str) -> "Event":
        fmt = "%Y-%m-%d %H:%M"
        return cls(
            title=title,
            start=datetime.strptime(start, fmt),
            end=datetime.strptime(end, fmt),
        )

    @classmethod
    def all_day(cls, title: str, date: str) -> "Event":
        from datetime import time
        day = datetime.strptime(date, "%Y-%m-%d")
        return cls(
            title=title,
            start=day.replace(hour=0, minute=0),
            end=day.replace(hour=23, minute=59),
        )

# Three ways to create an Event
e1 = Event("Launch", datetime(2024, 6, 1, 9, 0), datetime(2024, 6, 1, 17, 0))
e2 = Event.from_strings("Launch", "2024-06-01 09:00", "2024-06-01 17:00")
e3 = Event.all_day("Holiday", "2024-12-25")

print(e2.title, e2.start)
print(e3.title, e3.start)`}
        output={`Launch 2024-06-01 09:00:00
Holiday 2024-12-25 00:00:00`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        @staticmethod: utility that belongs on the class
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A static method receives neither{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">self</code>{" "}
        nor{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">cls</code>.
        It is a plain function that lives in the class namespace because it is conceptually related
        to the class, even though it does not need access to instance or class state.
      </p>

      <CodeBlock
        code={`class PasswordPolicy:
    MIN_LENGTH = 12

    @staticmethod
    def is_strong(password: str) -> bool:
        if len(password) < PasswordPolicy.MIN_LENGTH:
            return False
        has_upper = any(c.isupper() for c in password)
        has_digit = any(c.isdigit() for c in password)
        return has_upper and has_digit

    @staticmethod
    def generate(length: int = 16) -> str:
        import secrets, string
        alphabet = string.ascii_letters + string.digits
        return "".join(secrets.choice(alphabet) for _ in range(length))

print(PasswordPolicy.is_strong("short"))           # False
print(PasswordPolicy.is_strong("LongPass123456"))  # True
print(PasswordPolicy.generate())                   # random 16-char password`}
        output={`False
True
aX8kRpL2mNqvWsZj`}
      />

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-6">
        <p className="text-[13px] text-brand-text-muted">
          Use{" "}
          <code className="font-mono text-[12px]">@classmethod</code> for factory methods.
          Use{" "}
          <code className="font-mono text-[12px]">@staticmethod</code> for helpers that belong
          conceptually to the class but need no access to state. If neither applies, write a module-level
          function.
        </p>
      </div>
    </section>
  );
}
