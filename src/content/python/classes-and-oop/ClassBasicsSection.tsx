import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveInstance } from "@/components/blog/interactive/interactive-instance";

export function ClassBasicsSection() {
  return (
    <section>
      <h2 id="class-basics" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Class basics
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A class is a blueprint. Calling it creates an <em>instance</em> — an
        object with its own copy of the data defined in{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">__init__</code>.
        Every method receives the instance as its first argument, conventionally
        named <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">self</code>.
      </p>

      <CodeBlock
        code={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner   = owner      # instance attribute
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount

    def __repr__(self):
        return f"BankAccount({self.owner!r}, {self.balance})"

# Each call creates a separate, independent instance
alice = BankAccount("Alice", 100)
bob   = BankAccount("Bob")        # balance defaults to 0

alice.deposit(50)
print(alice.balance)   # 150
print(bob.balance)     # 0  — completely independent
print(alice)           # BankAccount('Alice', 150)`}
        output={`150
0
BankAccount('Alice', 150)`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Class attributes vs instance attributes</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Class attributes live on the class itself and are shared across all instances.
        Instance attributes live on the object and are unique to each one.
      </p>

      <CodeBlock
        code={`class BankAccount:
    interest_rate = 0.02   # class attribute — shared by all instances

    def __init__(self, owner, balance=0):
        self.owner   = owner     # instance attribute — unique per object
        self.balance = balance

    def apply_interest(self):
        self.balance += self.balance * BankAccount.interest_rate

a = BankAccount("Alice", 1000)
b = BankAccount("Bob",    500)

BankAccount.interest_rate = 0.05   # changes for all instances
a.apply_interest()
print(a.balance)   # 1050.0
print(b.balance)   # 500 — apply_interest not called on b`}
        output={`1050.0
500`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Create instances and call methods:
      </p>

      <InteractiveInstance />
    </section>
  );
}
