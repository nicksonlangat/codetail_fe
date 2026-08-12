import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CapstoneSection() {
  return (
    <section>
      <h2
        id="capstone"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Putting it together: a small order system
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here is a minimal but realistic order system that uses everything from this series. Read
        through it and match each concept to where it appears.
      </p>

      <CodeBlock
        code={`from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Protocol

# --- Value objects with @dataclass ---

@dataclass(frozen=True)
class Money:
    amount: float
    currency: str = "USD"

    def __add__(self, other: Money) -> Money:
        if self.currency != other.currency:
            raise ValueError("currency mismatch")
        return Money(self.amount + other.amount, self.currency)

    def __repr__(self):
        return f"{self.currency} {self.amount:.2f}"

@dataclass
class LineItem:
    name: str
    unit_price: Money
    quantity: int

    @property
    def total(self) -> Money:
        return Money(self.unit_price.amount * self.quantity, self.unit_price.currency)

# --- Protocol: anything that can process a payment ---

class PaymentProcessor(Protocol):
    def charge(self, amount: Money) -> bool: ...

# --- Concrete processors (no shared base class needed) ---

class CreditCardProcessor:
    def __init__(self, card_number: str):
        self._card = card_number

    def charge(self, amount: Money) -> bool:
        print(f"Charging {amount} to card ending {self._card[-4:]}")
        return True

class WalletProcessor:
    def __init__(self, balance: Money):
        self._balance = balance

    def charge(self, amount: Money) -> bool:
        if self._balance.amount < amount.amount:
            print("Insufficient wallet balance")
            return False
        self._balance = Money(self._balance.amount - amount.amount)
        print(f"Charged {amount} from wallet. Remaining: {self._balance}")
        return True

# --- Order: composition, @classmethod, @property ---

@dataclass
class Order:
    customer_name: str
    items: list[LineItem] = field(default_factory=list)

    @classmethod
    def new(cls, customer_name: str) -> Order:
        return cls(customer_name)

    def add_item(self, name: str, unit_price: float, quantity: int) -> Order:
        self.items.append(LineItem(name, Money(unit_price), quantity))
        return self   # builder pattern: enables chaining

    @property
    def total(self) -> Money:
        if not self.items:
            return Money(0.0)
        result = self.items[0].total
        for item in self.items[1:]:
            result = result + item.total
        return result

    def checkout(self, processor: PaymentProcessor) -> bool:
        print(f"Order for {self.customer_name}: {self.total}")
        for item in self.items:
            print(f"  {item.quantity}x {item.name} @ {item.unit_price} = {item.total}")
        return processor.charge(self.total)

# --- Usage ---

order = (
    Order.new("Alice")
    .add_item("Coffee",    4.50, 2)
    .add_item("Croissant", 3.25, 1)
)

cc  = CreditCardProcessor("4111111111111234")
ok  = order.checkout(cc)
print(f"Payment {'succeeded' if ok else 'failed'}")`}
        output={`Order for Alice: USD 12.25
  2x Coffee @ USD 4.50 = USD 9.00
  1x Croissant @ USD 3.25 = USD 3.25
Charging USD 12.25 to card ending 1234
Payment succeeded`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Every concept from this series appears somewhere in that code:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-relaxed text-brand-text/90 mb-6">
        <li>
          <strong>Encapsulation:</strong>{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            WalletProcessor._balance
          </code>{" "}
          is internal. The{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            charge()
          </code>{" "}
          method controls how it changes.
        </li>
        <li>
          <strong>Magic methods:</strong>{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            Money.__add__
          </code>{" "}
          and{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            Money.__repr__
          </code>{" "}
          make Money objects behave like first-class values.
        </li>
        <li>
          <strong>@dataclass with frozen=True:</strong>{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Money</code>{" "}
          is immutable. Adding two Money values returns a new one.
        </li>
        <li>
          <strong>@property:</strong>{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            Order.total
          </code>{" "}
          and{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            LineItem.total
          </code>{" "}
          are computed, not stored.
        </li>
        <li>
          <strong>@classmethod:</strong>{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            Order.new()
          </code>{" "}
          is a named factory method.
        </li>
        <li>
          <strong>Protocol:</strong>{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            PaymentProcessor
          </code>{" "}
          defines the contract.{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            checkout()
          </code>{" "}
          accepts any object that matches it.
        </li>
        <li>
          <strong>Composition:</strong>{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Order</code>{" "}
          does not inherit from anything. It takes a processor as a dependency and delegates to it.
        </li>
      </ul>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That is OOP in Python. Not a rigid architecture. A set of tools you reach for when they
        make the code clearer, more changeable, and easier to test.
      </p>
    </section>
  );
}
