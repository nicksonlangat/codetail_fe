import { StackLogo } from "@/components/brand/stack-logos";
import { StackTile } from "@/components/dashboard/stack-tile";

// StackLogo only has real artwork for these; anything else (e.g. "sql")
// falls back to StackTile's text-initial treatment.
const STACKS_WITH_LOGO = new Set(["python", "django", "fastapi", "go"]);

export function StackIcon({ stack, className }: { stack: string; className?: string }) {
  return STACKS_WITH_LOGO.has(stack) ? (
    <StackLogo stack={stack} className={className} />
  ) : (
    <StackTile stack={stack} className={className} />
  );
}
