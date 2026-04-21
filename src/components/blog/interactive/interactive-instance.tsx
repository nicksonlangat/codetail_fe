"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Account = {
  id: number;
  owner: string;
  balance: number;
  history: string[];
};

export function InteractiveInstance() {
  const nextId = useRef(1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [owner, setOwner] = useState("Alice");
  const [initialBalance, setInitialBalance] = useState(100);
  const [amount, setAmount] = useState(50);
  const [selected, setSelected] = useState<number | null>(null);

  function createAccount() {
    const id = nextId.current++;
    const acc: Account = {
      id,
      owner,
      balance: initialBalance,
      history: [`__init__: owner="${owner}", balance=${initialBalance}`],
    };
    setAccounts(prev => [...prev, acc]);
    setSelected(id);
  }

  function deposit(id: number) {
    setAccounts(prev =>
      prev.map(a => {
        if (a.id !== id) return a;
        const newBal = a.balance + amount;
        return { ...a, balance: newBal, history: [...a.history, `deposit(${amount}) → balance=${newBal}`] };
      })
    );
  }

  function withdraw(id: number) {
    setAccounts(prev =>
      prev.map(a => {
        if (a.id !== id) return a;
        if (amount > a.balance) {
          return { ...a, history: [...a.history, `withdraw(${amount}) → ValueError: insufficient funds`] };
        }
        const newBal = a.balance - amount;
        return { ...a, balance: newBal, history: [...a.history, `withdraw(${amount}) → balance=${newBal}`] };
      })
    );
  }

  const selectedAccount = accounts.find(a => a.id === selected) ?? null;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="bg-muted/50 px-4 py-2 border-b border-border text-[12px] font-mono text-muted-foreground">
        BankAccount class explorer
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">owner</label>
            <input
              value={owner}
              onChange={e => setOwner(e.target.value)}
              className="border border-border rounded px-2 py-1 text-[12px] font-mono bg-background w-24"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground block mb-1">balance</label>
            <input
              type="number"
              value={initialBalance}
              onChange={e => setInitialBalance(Number(e.target.value))}
              className="border border-border rounded px-2 py-1 text-[12px] font-mono bg-background w-20"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={createAccount}
            className="px-3 py-1.5 text-[12px] font-mono bg-primary text-primary-foreground rounded-lg"
          >
            BankAccount(owner, balance)
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[32px]">
          <AnimatePresence>
            {accounts.map(acc => (
              <motion.button
                key={acc.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(acc.id)}
                className={`px-3 py-1.5 text-[12px] font-mono rounded-lg border transition-colors ${
                  selected === acc.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-foreground"
                }`}
              >
                {acc.owner} (${acc.balance})
              </motion.button>
            ))}
          </AnimatePresence>
          {accounts.length === 0 && (
            <p className="text-[12px] text-muted-foreground italic self-center">
              No instances yet — create one above
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {selectedAccount && (
            <motion.div
              key={selectedAccount.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="bg-muted/30 px-3 py-2 border-b border-border flex items-center gap-2">
                <span className="text-[12px] font-mono font-semibold">{selectedAccount.owner}</span>
                <span className="text-[11px] text-muted-foreground">instance of BankAccount</span>
              </div>
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/20 rounded px-2 py-1.5">
                    <span className="text-[10px] text-muted-foreground block">self.owner</span>
                    <span className="text-[12px] font-mono">&quot;{selectedAccount.owner}&quot;</span>
                  </div>
                  <div className="bg-muted/20 rounded px-2 py-1.5">
                    <span className="text-[10px] text-muted-foreground block">self.balance</span>
                    <motion.span
                      key={selectedAccount.balance}
                      initial={{ color: "var(--color-green-500)" }}
                      animate={{ color: "currentColor" }}
                      transition={{ duration: 1 }}
                      className="text-[12px] font-mono"
                    >
                      {selectedAccount.balance}
                    </motion.span>
                  </div>
                </div>

                <div className="flex gap-2 items-end flex-wrap">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      className="border border-border rounded px-2 py-1 text-[12px] font-mono bg-background w-16"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deposit(selectedAccount.id)}
                    className="px-3 py-1.5 text-[11px] font-mono bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg"
                  >
                    .deposit(amount)
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => withdraw(selectedAccount.id)}
                    className="px-3 py-1.5 text-[11px] font-mono bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg"
                  >
                    .withdraw(amount)
                  </motion.button>
                </div>

                <div className="bg-background border border-border rounded font-mono text-[11px] p-2 max-h-28 overflow-y-auto space-y-0.5">
                  {selectedAccount.history.map((h, i) => (
                    <div
                      key={i}
                      className={h.includes("ValueError") ? "text-red-500" : "text-muted-foreground"}
                    >
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
