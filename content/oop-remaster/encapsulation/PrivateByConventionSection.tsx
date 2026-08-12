import { CodeBlock } from "@/components/blog/interactive/code-block";

export function PrivateByConventionSection() {
  return (
    <section>
      <h2
        id="private-by-convention"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Private by convention, not by lock
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Java and C++ have{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          private
        </code>{" "}
        keywords that the compiler enforces. Python does not. In Python, privacy is a convention
        communicated through naming.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Single underscore: "please don't touch this"
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A name starting with a single underscore is a signal to other developers: this is an
        internal detail. You can still access it, Python will not stop you, but you are on your own
        if you do and the behavior changes in a future version.
      </p>

      <CodeBlock
        code={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner    = owner
        self._balance = balance   # internal, not part of the public API

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

    def get_balance(self):
        return self._balance

account = BankAccount("Alice", 100)
account.deposit(50)
print(account.get_balance())   # 150

# You can still access _balance, but you're bypassing validation
account._balance = -999   # works, but you've broken the contract`}
        output={`150`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Double underscore: name mangling
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A name starting with two underscores (and not ending with two underscores) triggers name
        mangling. Python renames the attribute from{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __balance
        </code>{" "}
        to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          _ClassName__balance
        </code>{" "}
        under the hood. This makes it harder to access accidentally and protects it from being
        overridden by a subclass using the same name.
      </p>

      <CodeBlock
        code={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner     = owner
        self.__balance = balance   # name mangled to _BankAccount__balance

    def deposit(self, amount):
        self.__balance += amount

    def get_balance(self):
        return self.__balance

account = BankAccount("Alice", 100)
account.deposit(50)
print(account.get_balance())   # 150

# Trying to access directly fails
try:
    print(account.__balance)
except AttributeError as e:
    print(e)

# The real name after mangling
print(account._BankAccount__balance)   # 150 -- it's still there, just renamed`}
        output={`150
'BankAccount' object has no attribute '__balance'
150`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        In practice, most Python code uses a single underscore. The double underscore is reserved for
        cases where you genuinely need to protect a name from subclass collisions. Do not use it as
        a stronger version of private access control. That is not what it is for.
      </p>
    </section>
  );
}
