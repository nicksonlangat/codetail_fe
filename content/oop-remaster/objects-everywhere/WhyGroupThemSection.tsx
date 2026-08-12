import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhyGroupThemSection() {
  return (
    <section>
      <h2
        id="why-group-them"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        The problem classes solve
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before showing you how to write a class, it helps to feel the pain of not having one.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Imagine you are building a bank account system. Without classes, you might reach for
        dictionaries to hold the data and separate functions to act on them:
      </p>

      <CodeBlock
        code={`# No classes, just dicts and functions
def create_account(owner, balance=0):
    return {"owner": owner, "balance": balance}

def deposit(account, amount):
    account["balance"] += amount

def withdraw(account, amount):
    if amount > account["balance"]:
        raise ValueError("insufficient funds")
    account["balance"] -= amount

def get_balance(account):
    return account["balance"]

alice = create_account("Alice", 100)
bob   = create_account("Bob", 50)

deposit(alice, 200)
withdraw(bob, 30)

print(get_balance(alice))   # 300
print(get_balance(bob))     # 20`}
        output={`300
20`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        This works. But notice what you are doing manually every time: passing the account dict as
        the first argument to every function. The data and the functions that operate on it are
        separate. Nothing stops you from calling{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          deposit(bob, -500)
        </code>{" "}
        or from reaching directly into the dict with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          alice["balance"] = 999999
        </code>{" "}
        and bypassing the validation entirely.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        As the codebase grows, more functions accumulate. Some use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          account["balance"]
        </code>
        , some use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          account.get("balance", 0)
        </code>
        . Nobody can tell which functions belong to accounts and which belong to users. The
        relationship between data and operations is invisible.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        A class groups them
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A class does one thing: it bundles state (the data) and behavior (the functions that operate
        on that data) into a single named unit. Here is the same bank account as a class:
      </p>

      <CodeBlock
        code={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner   = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount

alice = BankAccount("Alice", 100)
bob   = BankAccount("Bob", 50)

alice.deposit(200)
bob.withdraw(30)

print(alice.balance)   # 300
print(bob.balance)     # 20`}
        output={`300
20`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The functions are no longer floating separately. They live on the object. When you call{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          alice.deposit(200)
        </code>
        , Python automatically passes{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">alice</code>{" "}
        as the first argument. You do not have to write{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          deposit(alice, 200)
        </code>{" "}
        every time. The object knows which data it belongs to.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          A class is not magic. It is a way of organizing code so that the data and the operations
          that belong together stay together. Everything else in OOP is built on top of that idea.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The next article walks through writing your first class from scratch, piece by piece. But
        now you understand why classes exist. Not because Python requires them. Because keeping data
        and behavior together makes code easier to understand, easier to extend, and harder to break
        accidentally.
      </p>
    </section>
  );
}
