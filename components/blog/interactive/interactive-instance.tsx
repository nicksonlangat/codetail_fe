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
    setAccounts((prev) => [...prev, acc]);
    setSelected(id);
  }

  function deposit(id: number) {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const newBal = a.balance + amount;
        return { ...a, balance: newBal, history: [...a.history, `deposit(${amount}) -> balance=${newBal}`] };
      })
    );
  }

  function withdraw(id: number) {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (amount > a.balance) {
          return { ...a, history: [...a.history, `withdraw(${amount}) -> ValueError: insufficient funds`] };
        }
        const newBal = a.balance - amount;
        return { ...a, balance: newBal, history: [...a.history, `withdraw(${amount}) -> balance=${newBal}`] };
      })
    );
  }

  const selectedAccount = accounts.find((a) => a.id === selected) ?? null;

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden bg-white">
      <div className="bg-brand-surface/50 px-4 py-2 border-b border-brand-border text-[12px] font-mono text-brand-text-muted">
        BankAccount class explorer
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-[11px] text-brand-text-muted block mb-1">owner</label>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="border border-brand-border rounded px-2 py-1 text-[12px] font-mono bg-brand-surface w-24 outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-brand-text-muted block mb-1">balance</label>
            <input
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(Number(e.target.value))}
              className="border border-brand-border rounded px-2 py-1 text-[12px] font-mono bg-brand-surface w-20 outline-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={createAccount}
            className="px-3 py-1.5 text-[12px] font-mono bg-brand-primary text-white rounded-lg cursor-pointer outline-none transition-all duration-500"
          >
            BankAccount(owner, balance)
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[32px]">
          <AnimatePresence>
            {accounts.map((acc) => (
              <motion.button
                key={acc.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelected(acc.id)}
                className={`px-3 py-1.5 text-[12px] font-mono rounded-lg border cursor-pointer outline-none transition-all duration-500 ${
                  selected === acc.id
                    ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                    : "border-brand-border bg-brand-surface/30 text-brand-text"
                }`}
              >
                {acc.owner} (${acc.balance})
              </motion.button>
            ))}
          </AnimatePresence>
          {accounts.length === 0 && (
            <p className="text-[12px] text-brand-text-subtle italic self-center">
              No instances yet, create one above
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
              className="border border-brand-border rounded-lg overflow-hidden"
            >
              <div className="bg-brand-surface/30 px-3 py-2 border-b border-brand-border flex items-center gap-2">
                <span className="text-[12px] font-mono font-semibold text-brand-text">{selectedAccount.owner}</span>
                <span className="text-[11px] text-brand-text-muted">instance of BankAccount</span>
              </div>
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-brand-surface/20 rounded px-2 py-1.5">
                    <span className="text-[10px] text-brand-text-muted block">self.owner</span>
                    <span className="text-[12px] font-mono text-brand-text">&quot;{selectedAccount.owner}&quot;</span>
                  </div>
                  <div className="bg-brand-surface/20 rounded px-2 py-1.5">
                    <span className="text-[10px] text-brand-text-muted block">self.balance</span>
                    <motion.span
                      key={selectedAccount.balance}
                      initial={{ color: "var(--brand-success)" }}
                      animate={{ color: "var(--brand-text)" }}
                      transition={{ duration: 1 }}
                      className="text-[12px] font-mono"
                    >
                      {selectedAccount.balance}
                    </motion.span>
                  </div>
                </div>

                <div className="flex gap-2 items-end flex-wrap">
                  <div>
                    <label className="text-[10px] text-brand-text-muted block mb-0.5">amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="border border-brand-border rounded px-2 py-1 text-[12px] font-mono bg-brand-surface w-16 outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deposit(selectedAccount.id)}
                    className="px-3 py-1.5 text-[11px] font-mono bg-brand-success/10 text-brand-success border border-brand-success/20 rounded-lg cursor-pointer outline-none transition-all duration-500"
                  >
                    .deposit(amount)
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => withdraw(selectedAccount.id)}
                    className="px-3 py-1.5 text-[11px] font-mono bg-brand-destructive/10 text-brand-destructive border border-brand-destructive/20 rounded-lg cursor-pointer outline-none transition-all duration-500"
                  >
                    .withdraw(amount)
                  </motion.button>
                </div>

                <div className="bg-brand-surface/40 border border-brand-border rounded font-mono text-[11px] p-2 max-h-28 overflow-y-auto space-y-0.5">
                  {selectedAccount.history.map((h, i) => (
                    <div
                      key={i}
                      className={h.includes("ValueError") ? "text-brand-destructive" : "text-brand-text-muted"}
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
