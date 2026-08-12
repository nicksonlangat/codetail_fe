import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PropertyDecoratorSection() {
  return (
    <section>
      <h2
        id="property-decorator"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        @property: a controlled public interface
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here is a problem: you ship a class where{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          account.balance
        </code>{" "}
        is a plain attribute. Thousands of lines of code read it that way. Later you need to add
        validation when balance is set. If you change it to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          get_balance()
        </code>
        , you break all that code.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @property
        </code>{" "}
        decorator solves this. It lets you expose an attribute-style interface (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          account.balance
        </code>
        ) while controlling exactly what happens when that name is read or written.
      </p>

      <CodeBlock
        code={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner     = owner
        self._balance  = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, amount):
        if amount < 0:
            raise ValueError("balance cannot be negative")
        self._balance = amount

account = BankAccount("Alice", 100)

# Reads like a plain attribute
print(account.balance)   # 100

# Writes go through the setter
account.balance = 200
print(account.balance)   # 200

# Validation kicks in
account.balance = -50    # raises ValueError`}
        output={`100
200
ValueError: balance cannot be negative`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        All the code that reads{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          account.balance
        </code>{" "}
        still works unchanged. But now you control what happens. The internal storage (
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          _balance
        </code>
        ) is separate from the public name.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Computed properties
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Properties do not have to read from a stored attribute. You can compute a value on the fly
        and expose it as if it were an attribute:
      </p>

      <CodeBlock
        code={`class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        import math
        return math.pi * self.radius ** 2

    @property
    def diameter(self):
        return self.radius * 2

c = Circle(5)
print(c.area)      # 78.53...  computed, not stored
print(c.diameter)  # 10        computed, not stored

c.radius = 10
print(c.area)      # 314.15...  automatically correct`}
        output={`78.53981633974483
10
314.1592653589793`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The caller has no idea whether{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">area</code>{" "}
        is stored or computed. They just read it. That is the point of encapsulation: the
        implementation can change without breaking the interface.
      </p>
    </section>
  );
}
