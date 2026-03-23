"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

interface Notification {
  id: number;
  message: string;
  dotColor: string;
  time: string;
}

const initialNotifications: Notification[] = [
  { id: 1, message: "You completed Arrays & Strings!", dotColor: "bg-green-500", time: "2m ago" },
  { id: 2, message: "New path unlocked: Dynamic Programming", dotColor: "bg-primary", time: "1h ago" },
  { id: 3, message: "Your streak is at risk!", dotColor: "bg-yellow-500", time: "3h ago" },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [count, setCount] = useState(3);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifications([]);
    setCount(0);
  }

  function reset() {
    setNotifications(initialNotifications);
    setCount(3);
    setIsOpen(false);
  }

  return (
    <div className="py-6 space-y-4">
      <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/50 mb-3">
        Bell + Dropdown
      </p>

      <div className="relative inline-block" ref={ref}>
        {/* Bell button */}
        <motion.button
          className="relative w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center cursor-pointer transition-all duration-500 hover:bg-muted"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="w-4.5 h-4.5 text-foreground" />

          {/* Badge */}
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={spring}
              className="absolute top-12 left-0 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border">
                <span className="text-[12px] font-semibold text-foreground">Notifications</span>
                {notifications.length > 0 && (
                  <motion.button
                    className="text-[10px] text-primary font-medium cursor-pointer transition-all duration-500 hover:underline"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring}
                    onClick={markAllRead}
                  >
                    Mark all read
                  </motion.button>
                )}
              </div>

              {/* Notifications list */}
              <div className="max-h-60 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {notifications.map((n, i) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8, transition: { delay: i * 0.05 } }}
                      transition={{ ...spring, delay: i * 0.04 }}
                      className="flex items-start gap-2.5 px-3.5 py-2.5 cursor-pointer transition-all duration-500 hover:bg-muted"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dotColor}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-foreground leading-snug">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={spring}
                    className="text-[12px] text-muted-foreground text-center py-6"
                  >
                    All caught up!
                  </motion.p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-3.5 py-2.5">
                <motion.button
                  className="text-[11px] text-primary font-medium cursor-pointer transition-all duration-500 hover:underline"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                >
                  View all notifications &rarr;
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset button */}
      {count === 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring}
          className="block text-[11px] text-muted-foreground cursor-pointer transition-all duration-500 hover:text-foreground mt-2"
          onClick={reset}
        >
          Reset notifications
        </motion.button>
      )}
    </div>
  );
}
