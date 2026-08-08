import { useEffect } from "react";

// Prevents the page behind a modal/overlay from scrolling while it's open.
// Restores whatever overflow value was there before, rather than assuming
// it was ever unset.
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
