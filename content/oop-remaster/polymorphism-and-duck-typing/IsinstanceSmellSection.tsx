import { CodeBlock } from "@/components/blog/interactive/code-block";

export function IsinstanceSmellSection() {
  return (
    <section>
      <h2
        id="isinstance-smell"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        isinstance checks in business logic are a warning sign
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          isinstance()
        </code>{" "}
        has legitimate uses: validating input at function boundaries, checking types before an
        operation that is genuinely type-specific. But when you see it in the middle of business
        logic, it is almost always a sign that polymorphism should be doing that work instead.
      </p>

      <CodeBlock
        code={`# Wrong: type-checking in business logic
def process_payment(payment):
    if isinstance(payment, CreditCard):
        charge_credit_card(payment)
    elif isinstance(payment, BankTransfer):
        initiate_transfer(payment)
    elif isinstance(payment, Crypto):
        broadcast_transaction(payment)
    # Every time you add a payment type, you edit this function.
    # It never ends.`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Every new payment type means editing{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          process_payment()
        </code>
        . The logic that belongs inside each payment type lives outside it. The fix is to put the
        behavior on the object:
      </p>

      <CodeBlock
        code={`class CreditCard:
    def process(self):
        charge_credit_card(self)

class BankTransfer:
    def process(self):
        initiate_transfer(self)

class Crypto:
    def process(self):
        broadcast_transaction(self)

# Now process_payment never changes, regardless of new types
def process_payment(payment):
    payment.process()

# Adding PayPal? Write PayPal.process(), done.
# process_payment() stays the same.`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The second version follows the Open-Closed Principle: the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          process_payment()
        </code>{" "}
        function is open for extension (add new payment types) but closed for modification (you
        never touch it again). The isinstance version is the opposite.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          When you find yourself writing{" "}
          <code className="font-mono text-[12px]">if isinstance(x, A): ... elif isinstance(x, B): ...</code>
          , ask: can each class implement this behavior itself? Usually yes.
        </p>
      </div>
    </section>
  );
}
