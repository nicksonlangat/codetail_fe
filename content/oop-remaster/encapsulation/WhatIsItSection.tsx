import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhatIsItSection() {
  return (
    <section>
      <h2
        id="what-is-it"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        What encapsulation actually is
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here is a bank account. Notice what is missing:
      </p>

      <CodeBlock
        code={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner   = owner
        self.balance = balance   # fully public

account = BankAccount("Alice", 100)

# Anyone can do this
account.balance = -999999   # no validation, no history, just chaos`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        No error. The balance is a plain attribute. Any code anywhere can reach in and set it to
        anything. That line bypasses all validation. There is nothing to bypass, because there is
        no validation.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Now add a requirement: log every deposit. Enforce a minimum balance. Round to two decimal
        places. Every piece of code that touches{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          account.balance
        </code>{" "}
        directly becomes a place you have to find and update. You cannot add the logic in one spot
        because the logic has no spot to live.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That is the problem encapsulation solves. Not security. Not privacy in the Java sense.
        The ability to change how something works inside without breaking the code that uses it
        from outside.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          Encapsulation is not a lock. It is a seam. You control what goes through it, so you can
          change what is behind it without touching anything else.
        </p>
      </div>
    </section>
  );
}
