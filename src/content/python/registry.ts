export type ArticleMeta = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  tags: string[];
  relatedChallenges: string[];
  icon: string;
};

export const pythonArticles: ArticleMeta[] = [
  {
    slug: "variables-and-types",
    title: "Variables & Types",
    subtitle: "What is data? Why does type matter?",
    description:
      "Everything in Python is an object. Understand what that really means — names, bindings, memory, and why type matters for every line you write.",
    order: 1,
    estimatedMinutes: 20,
    tags: ["variables", "types", "int", "float", "str", "bool", "None", "type()"],
    relatedChallenges: ["type-detective", "variable-swap"],
    icon: "🏷️",
  },
  {
    slug: "strings",
    title: "Strings",
    subtitle: "Text as a sequence. Every operation you'll ever need.",
    description:
      "Master Python strings from first principles. Interactive slicing, every method explained, performance patterns, and real-world usage.",
    order: 2,
    estimatedMinutes: 30,
    tags: ["strings", "slicing", "f-strings", "methods", "encoding", "formatting"],
    relatedChallenges: ["string-reversal", "palindrome-check", "csv-parser"],
    icon: "✏️",
  },
  {
    slug: "numbers-and-math",
    title: "Numbers & Math",
    subtitle: "Integers, floats, precision, real-world math.",
    description:
      "Why 0.1 + 0.2 ≠ 0.3, how Python handles big integers, and every math operation you'll use in production code.",
    order: 3,
    estimatedMinutes: 18,
    tags: ["int", "float", "decimal", "math", "operators", "precision"],
    relatedChallenges: ["tip-calculator", "compound-interest"],
    icon: "🔢",
  },
  {
    slug: "booleans-and-conditions",
    title: "Booleans & Conditions",
    subtitle: "Truth, logic, decision-making.",
    description:
      "How Python evaluates truth. Truthy vs falsy, short-circuit evaluation, comparison chains, and writing conditions that read like English.",
    order: 4,
    estimatedMinutes: 15,
    tags: ["bool", "if", "elif", "else", "and", "or", "not", "truthy", "falsy"],
    relatedChallenges: ["grade-calculator", "leap-year"],
    icon: "⚖️",
  },
  {
    slug: "lists",
    title: "Lists",
    subtitle: "Ordered collections. The workhorse data structure.",
    description:
      "Add, remove, sort, slice, nest, and comprehend. Lists are everywhere — understand them deeply and you unlock half of Python.",
    order: 5,
    estimatedMinutes: 28,
    tags: ["list", "append", "slice", "comprehension", "sort", "mutability"],
    relatedChallenges: ["flatten-list", "two-sum", "rotate-array"],
    icon: "📋",
  },
  {
    slug: "tuples",
    title: "Tuples",
    subtitle: "Immutability and why it matters.",
    description:
      "When you need data that doesn't change. Tuple packing, unpacking, named tuples, and the real reason tuples exist beyond 'immutable lists'.",
    order: 6,
    estimatedMinutes: 14,
    tags: ["tuple", "immutability", "unpacking", "namedtuple", "hashable"],
    relatedChallenges: ["coordinate-distance", "swap-values"],
    icon: "🔒",
  },
  {
    slug: "dictionaries",
    title: "Dictionaries",
    subtitle: "Key-value pairs. The most useful structure in Python.",
    description:
      "Hash tables made simple. Lookup, iteration, nesting, defaultdict, Counter, and the patterns that make dictionaries indispensable.",
    order: 7,
    estimatedMinutes: 25,
    tags: ["dict", "keys", "values", "items", "defaultdict", "Counter", "hash"],
    relatedChallenges: ["word-frequency", "group-anagrams", "inventory-system"],
    icon: "📖",
  },
  {
    slug: "sets",
    title: "Sets",
    subtitle: "Uniqueness, membership, set math.",
    description:
      "When order doesn't matter but uniqueness does. Union, intersection, difference — with interactive Venn diagrams that make set operations visual.",
    order: 8,
    estimatedMinutes: 14,
    tags: ["set", "frozenset", "union", "intersection", "difference", "membership"],
    relatedChallenges: ["unique-elements", "common-friends"],
    icon: "🔵",
  },
  {
    slug: "loops",
    title: "Loops",
    subtitle: "Iteration patterns, comprehensions, generators.",
    description:
      "For loops, while loops, enumerate, zip, comprehensions, and generators. Every iteration pattern Python offers, and when to use each one.",
    order: 9,
    estimatedMinutes: 25,
    tags: ["for", "while", "enumerate", "zip", "comprehension", "generator", "iterator"],
    relatedChallenges: ["fizzbuzz", "matrix-spiral", "chunk-list"],
    icon: "🔄",
  },
  {
    slug: "functions",
    title: "Functions",
    subtitle: "Abstraction, scope, closures, decorators.",
    description:
      "From def to decorators. Parameters, return values, scope rules, *args/**kwargs, closures, and writing functions that are a joy to use.",
    order: 10,
    estimatedMinutes: 30,
    tags: ["def", "return", "args", "kwargs", "scope", "closure", "decorator", "lambda"],
    relatedChallenges: ["memoize", "retry-decorator", "compose-functions"],
    icon: "⚡",
  },
  {
    slug: "error-handling",
    title: "Error Handling",
    subtitle: "Exceptions as control flow. Defensive coding.",
    description:
      "Try/except is more than catching errors. Custom exceptions, context managers, EAFP vs LBYL, and building code that fails gracefully.",
    order: 11,
    estimatedMinutes: 18,
    tags: ["try", "except", "finally", "raise", "custom exceptions", "context manager"],
    relatedChallenges: ["safe-divide", "retry-logic", "validate-input"],
    icon: "🛡️",
  },
  {
    slug: "file-io",
    title: "File I/O",
    subtitle: "Reading, writing, context managers.",
    description:
      "Open, read, write, close — and why you should almost never call close() directly. Working with text, CSV, JSON, and binary files.",
    order: 12,
    estimatedMinutes: 16,
    tags: ["open", "read", "write", "with", "csv", "json", "pathlib"],
    relatedChallenges: ["log-parser", "config-reader", "csv-transformer"],
    icon: "📁",
  },
  {
    slug: "classes-and-oop",
    title: "Classes & OOP",
    subtitle: "Objects, inheritance, when (and when not) to use OOP.",
    description:
      "Build your own types. __init__, methods, properties, inheritance, composition, and honest advice about when classes help vs when they hurt.",
    order: 13,
    estimatedMinutes: 30,
    tags: ["class", "self", "init", "inheritance", "property", "dunder", "composition"],
    relatedChallenges: ["bank-account", "shopping-cart", "linked-list"],
    icon: "🏗️",
  },
  {
    slug: "modules-and-imports",
    title: "Modules & Imports",
    subtitle: "Code organization, packages, the import system.",
    description:
      "How Python finds and loads code. Modules, packages, __init__.py, relative imports, and structuring projects that scale.",
    order: 14,
    estimatedMinutes: 14,
    tags: ["import", "module", "package", "__init__", "sys.path", "relative import"],
    relatedChallenges: ["plugin-loader", "package-structure"],
    icon: "📦",
  },
  {
    slug: "standard-library-gems",
    title: "Standard Library Gems",
    subtitle: "collections, itertools, pathlib, datetime, json.",
    description:
      "The batteries included. The most useful modules you're probably not using yet — with interactive demos showing why they exist.",
    order: 15,
    estimatedMinutes: 22,
    tags: ["collections", "itertools", "pathlib", "datetime", "json", "functools"],
    relatedChallenges: ["flatten-deep", "date-range", "json-transformer"],
    icon: "💎",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return pythonArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = pythonArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? pythonArticles[idx - 1] : null,
    next: idx < pythonArticles.length - 1 ? pythonArticles[idx + 1] : null,
  };
}
