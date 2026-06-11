"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", minDate }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const today = startOfDay(new Date());
  const floor = minDate ? startOfDay(minDate) : today;

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  const select = (day: Date) => {
    if (isBefore(day, floor)) return;
    onChange(day);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 text-[12px] px-3 py-2 rounded-lg bg-muted border border-border/60 text-left cursor-pointer transition-all duration-500 hover:border-border focus:outline-none focus:ring-1 focus:ring-primary/50"
      >
        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className={value ? "text-foreground" : "text-muted-foreground/40"}>
          {value ? format(value, "MMM d, yyyy") : placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="ml-auto p-0.5 rounded text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={spring}
            className="absolute top-full left-0 mt-1.5 z-[200] w-[260px] bg-card border border-border rounded-xl shadow-xl p-3"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setMonth((m) => subMonths(m, 1))}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-all duration-500"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[12px] font-semibold tracking-tight">
                {format(month, "MMMM yyyy")}
              </span>
              <button
                type="button"
                onClick={() => setMonth((m) => addMonths(m, 1))}
                className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-all duration-500"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div key={d} className="text-center text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {days.map((day) => {
                const isSelected = value ? isSameDay(day, value) : false;
                const isToday = isSameDay(day, today);
                const disabled = isBefore(day, floor);
                const outside = !isSameMonth(day, month);
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => select(day)}
                    disabled={disabled}
                    className={`w-full aspect-square flex items-center justify-center text-[11px] rounded-md transition-all duration-200 cursor-pointer
                      ${isSelected ? "bg-primary text-primary-foreground font-semibold" : ""}
                      ${!isSelected && isToday ? "text-primary font-semibold" : ""}
                      ${!isSelected && !outside && !disabled ? "hover:bg-muted text-foreground" : ""}
                      ${outside ? "text-muted-foreground/25" : ""}
                      ${disabled ? "text-muted-foreground/20 cursor-not-allowed" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
