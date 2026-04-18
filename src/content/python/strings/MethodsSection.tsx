import { MethodExplorer } from "@/components/blog/interactive/method-explorer";
import type { ExplorerMethod } from "@/components/blog/interactive/method-explorer";

const CATEGORIES = ["search", "transform", "test", "split/join", "format"];

const STRING_METHODS: ExplorerMethod[] = [
  // Search
  {
    name: "find",
    category: "search",
    signature: "str.find(sub[, start[, end]]) -> int",
    description:
      "Returns the lowest index where sub is found, or -1 if not found. Optional start/end limit the search range.",
    analogy: "Like Ctrl+F in your browser. Find the first occurrence and return its position.",
    examples: [
      { label: "basic", code: '"hello world".find("world")', output: "6" },
      { label: "not found", code: '"hello world".find("xyz")', output: "-1" },
      { label: "with range", code: '"abcabc".find("b", 2)', output: "4" },
    ],
    gotcha:
      "Use find() when not finding is acceptable. Use index() when the value must exist. index() raises ValueError if not found.",
  },
  {
    name: "count",
    category: "search",
    signature: "str.count(sub[, start[, end]]) -> int",
    description: "Returns the number of non-overlapping occurrences of sub in the string.",
    examples: [
      { label: "substring", code: '"banana".count("an")', output: "2" },
      { label: "single char", code: '"mississippi".count("s")', output: "4" },
    ],
  },
  {
    name: "startswith",
    category: "search",
    signature: "str.startswith(prefix[, start[, end]]) -> bool",
    description:
      "Returns True if the string starts with the given prefix. Accepts a tuple of prefixes to check any of several options.",
    examples: [
      { label: "single", code: '"https://example.com".startswith("https")', output: "True" },
      { label: "tuple", code: '"report.pdf".startswith((".pdf", ".csv"))', output: "False" },
    ],
  },
  {
    name: "endswith",
    category: "search",
    signature: "str.endswith(suffix[, start[, end]]) -> bool",
    description: "Returns True if the string ends with the given suffix. Accepts a tuple of suffixes.",
    examples: [
      { label: "single", code: '"photo.jpg".endswith(".jpg")', output: "True" },
      { label: "tuple", code: '"photo.png".endswith((".jpg", ".png", ".gif"))', output: "True" },
    ],
  },
  // Transform
  {
    name: "upper",
    category: "transform",
    signature: "str.upper() -> str",
    description: "Returns a new string with all cased characters converted to uppercase.",
    examples: [
      { label: "basic", code: '"hello world".upper()', output: "HELLO WORLD" },
      { label: "mixed", code: '"Python 3.12".upper()', output: "PYTHON 3.12" },
    ],
  },
  {
    name: "lower",
    category: "transform",
    signature: "str.lower() -> str",
    description:
      "Returns a new string with all cased characters converted to lowercase. Indispensable for case-insensitive comparisons.",
    examples: [
      { label: "basic", code: '"HELLO WORLD".lower()', output: "hello world" },
      { label: "comparison", code: '"Alice".lower() == "alice".lower()', output: "True" },
    ],
  },
  {
    name: "strip",
    category: "transform",
    signature: "str.strip([chars]) -> str",
    description:
      "Removes leading and trailing whitespace (or specified characters). lstrip() and rstrip() do just one side.",
    analogy: "Like trimming the crust off bread. Clean up the edges without touching the middle.",
    examples: [
      { label: "whitespace", code: '"  hello  ".strip()', output: "hello" },
      { label: "chars", code: '"###hello###".strip("#")', output: "hello" },
      { label: "lstrip", code: '"  hello  ".lstrip()', output: "hello  " },
    ],
    gotcha:
      "strip(chars) removes any combination of those characters from both ends, not that exact string. '  abc  '.strip(' ') removes spaces, not the literal string ' '.",
  },
  {
    name: "replace",
    category: "transform",
    signature: "str.replace(old, new[, count]) -> str",
    description:
      "Returns a copy with all occurrences of old replaced by new. Optional count limits replacements.",
    examples: [
      { label: "all", code: '"foo bar foo".replace("foo", "baz")', output: "baz bar baz" },
      { label: "limited", code: '"aaa".replace("a", "b", 2)', output: "bba" },
    ],
  },
  // Test
  {
    name: "isdigit",
    category: "test",
    signature: "str.isdigit() -> bool",
    description: "Returns True if all characters are digit characters and the string is non-empty.",
    examples: [
      { label: "digits", code: '"12345".isdigit()', output: "True" },
      { label: "float", code: '"123.45".isdigit()', output: "False" },
    ],
    gotcha:
      "isdigit() returns True for Unicode digits like superscripts. Use isdecimal() if you need only ASCII 0-9.",
  },
  {
    name: "isalpha",
    category: "test",
    signature: "str.isalpha() -> bool",
    description:
      "Returns True if all characters are alphabetic and the string is non-empty. Spaces and digits make it return False.",
    examples: [
      { label: "alpha", code: '"hello".isalpha()', output: "True" },
      { label: "with space", code: '"hello world".isalpha()', output: "False" },
    ],
  },
  {
    name: "isupper",
    category: "test",
    signature: "str.isupper() -> bool",
    description:
      "Returns True if all cased characters are uppercase and there is at least one cased character.",
    examples: [
      { label: "upper", code: '"HELLO".isupper()', output: "True" },
      { label: "with numbers", code: '"HELLO123".isupper()', output: "True" },
      { label: "no letters", code: '"123".isupper()', output: "False" },
    ],
  },
  // Split/Join
  {
    name: "split",
    category: "split/join",
    signature: "str.split([sep[, maxsplit]]) -> list",
    description:
      "Splits on sep (default: any whitespace) and returns a list. maxsplit limits the number of splits.",
    analogy: "Like cutting a rope at every knot. You get separate pieces.",
    examples: [
      { label: "whitespace", code: '"one two three".split()', output: "['one', 'two', 'three']" },
      { label: "delimiter", code: '"a,b,c".split(",")', output: "['a', 'b', 'c']" },
      { label: "maxsplit", code: '"a:b:c:d".split(":", 2)', output: "['a', 'b', 'c:d']" },
    ],
    gotcha:
      'split() with no argument collapses multiple whitespace and strips leading/trailing. split(" ") does not. It creates empty strings for consecutive spaces.',
  },
  {
    name: "join",
    category: "split/join",
    signature: "str.join(iterable) -> str",
    description:
      "Joins an iterable of strings using the string as separator. The inverse of split(). Also the correct way to build strings in a loop.",
    analogy: "Like putting glue between Lego bricks. The separator goes between every element.",
    examples: [
      { label: "basic", code: '", ".join(["Alice", "Bob", "Charlie"])', output: "Alice, Bob, Charlie" },
      { label: "path", code: '"/".join(["usr", "local", "bin"])', output: "usr/local/bin" },
      { label: "concat", code: '"".join(["h", "e", "l", "l", "o"])', output: "hello" },
    ],
    gotcha:
      'join() only accepts iterables of strings. If your list contains integers, convert first: ", ".join(str(x) for x in nums).',
  },
  {
    name: "partition",
    category: "split/join",
    signature: "str.partition(sep) -> tuple",
    description:
      "Splits at the first occurrence of sep, returning (before, sep, after). If not found, returns (str, '', '').",
    examples: [
      {
        label: "found",
        code: '"user@example.com".partition("@")',
        output: "('user', '@', 'example.com')",
      },
      { label: "not found", code: '"hello".partition("@")', output: "('hello', '', '')" },
    ],
  },
  // Format
  {
    name: "zfill",
    category: "format",
    signature: "str.zfill(width) -> str",
    description:
      "Pads the string on the left with zeros to reach the given width. Handles leading signs correctly.",
    examples: [
      { label: "basic", code: '"42".zfill(6)', output: "000042" },
      { label: "negative", code: '"-42".zfill(6)', output: "-00042" },
    ],
  },
  {
    name: "center",
    category: "format",
    signature: "str.center(width[, fillchar]) -> str",
    description:
      "Centers the string in a field of given width, padding with fillchar (default space) on both sides.",
    examples: [
      { label: "spaces", code: '"hello".center(11)', output: "   hello   " },
      { label: "custom", code: '"hello".center(11, "-")', output: "---hello---" },
    ],
  },
  {
    name: "ljust",
    category: "format",
    signature: "str.ljust(width[, fillchar]) -> str",
    description:
      "Left-justifies the string in a field of given width, padding with fillchar on the right. rjust() does the opposite.",
    examples: [
      { label: "ljust", code: '"name".ljust(12) + "|"', output: "name        |" },
      { label: "rjust", code: '"42".rjust(8, "0")', output: "00000042" },
    ],
  },
];

export function MethodsSection() {
  return (
    <section>
      <h2 id="string-methods" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        String methods
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Python ships 40+ string methods. Below are the ones you&apos;ll actually reach for in
        production, organized by purpose, with examples and the gotchas that trip people up.
      </p>

      <MethodExplorer methods={STRING_METHODS} categories={CATEGORIES} />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-6">
        <p className="text-[13px] text-foreground/70">
          <strong>Remember:</strong> strings are immutable. Every method returns a{" "}
          <em>new</em> string. None modify in place. Writing{" "}
          <code className="font-mono bg-muted px-1 rounded">s.upper()</code> without assigning
          the result does nothing to <code className="font-mono bg-muted px-1 rounded">s</code>.
        </p>
      </div>
    </section>
  );
}
