import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full h-10 rounded-lg border border-transparent bg-brand-surface px-3.5 text-[13px] text-brand-text placeholder:text-brand-text-subtle outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-500 ${className}`}
        {...props}
      />
    );
  }
);
