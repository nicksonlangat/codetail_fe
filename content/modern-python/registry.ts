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

export const modernPythonArticles: ArticleMeta[] = [
  {
    slug: "type-hints",
    title: "Type Hints Done Right",
    subtitle: "From typing.List to list[int]. The full evolution.",
    description:
      "The typing module was a necessary hack. Built-in generics (3.9), the union shorthand (3.10), type aliases with the type keyword (3.12) — how to write annotations the way Python intended.",
    order: 1,
    estimatedMinutes: 20,
    tags: ["type hints", "list[int]", "str | None", "TypeAlias", "type", "generics"],
    relatedChallenges: [],
    icon: "🏷️",
  },
  {
    slug: "pattern-matching",
    title: "Structural Pattern Matching",
    subtitle: "Replace your isinstance ladders. For good.",
    description:
      "The if/elif isinstance chain was how Python branched on shape. match/case (3.10) matches and destructures at the same time. Literal, capture, class, sequence, and mapping patterns with real examples.",
    order: 2,
    estimatedMinutes: 22,
    tags: ["match", "case", "pattern matching", "isinstance", "structural", "3.10"],
    relatedChallenges: [],
    icon: "🔀",
  },
  {
    slug: "modern-data-containers",
    title: "Modern Data Containers",
    subtitle: "Stop writing __init__ by hand.",
    description:
      "Twenty lines of boilerplate for a simple data class. Then @dataclass arrived. Now slots=True (3.10), TypedDict, NamedTuple class syntax, and a clear guide on which to reach for.",
    order: 3,
    estimatedMinutes: 20,
    tags: ["@dataclass", "TypedDict", "NamedTuple", "slots", "frozen", "field()"],
    relatedChallenges: [],
    icon: "📦",
  },
  {
    slug: "f-strings-and-strings",
    title: "f-Strings and the String Renaissance",
    subtitle: "% and .format() are history. Here is what replaced them.",
    description:
      "f-strings were just the start. f\"{value=}\" for debugging (3.8), removeprefix and removesuffix burying lstrip (3.9), number formatting shortcuts, and 3.12's expanded f-string grammar.",
    order: 4,
    estimatedMinutes: 16,
    tags: ["f-string", "f\"{x=}\"", "removeprefix", "removesuffix", "formatting", "3.12"],
    relatedChallenges: [],
    icon: "✏️",
  },
  {
    slug: "modern-functions",
    title: "Functions, Evolved",
    subtitle: "Signatures, walrus, cache. The details that matter.",
    description:
      "Positional-only parameters with / (3.8), the walrus operator collapsing read-then-check patterns (3.8), @functools.cache over the verbose lru_cache spell, and singledispatch replacing isinstance chains.",
    order: 5,
    estimatedMinutes: 20,
    tags: ["positional-only", "walrus", ":=", "@cache", "singledispatch", "keyword-only"],
    relatedChallenges: [],
    icon: "⚡",
  },
  {
    slug: "modern-exceptions",
    title: "Exception Handling You Are Not Using",
    subtitle: "raise from, add_note, ExceptionGroup. The modern toolkit.",
    description:
      "raise X from Y has been in Python since 3.0 and almost nobody uses it. add_note() annotates without wrapping (3.11). ExceptionGroup and except* handle concurrent failures (3.11). Python 3.10 error messages that actually help.",
    order: 6,
    estimatedMinutes: 16,
    tags: ["raise from", "add_note", "ExceptionGroup", "except*", "exception chaining", "3.11"],
    relatedChallenges: [],
    icon: "🛡️",
  },
  {
    slug: "modern-collections",
    title: "Dictionaries and Collections",
    subtitle: "{**a, **b} is fine. a | b is better.",
    description:
      "The merge operator for dicts (3.9), Counter arithmetic, itertools.pairwise (3.10) and itertools.batched (3.12) replacing hand-rolled chunking recipes, ChainMap for layered configs.",
    order: 7,
    estimatedMinutes: 18,
    tags: ["dict merge", "|", "Counter", "batched", "pairwise", "ChainMap", "3.12"],
    relatedChallenges: [],
    icon: "🗂️",
  },
  {
    slug: "standard-library-modern",
    title: "Standard Library You Should Already Be Using",
    subtitle: "pathlib, zoneinfo, tomllib, cached_property.",
    description:
      "os.path is a museum piece. pathlib.Path is the current answer, and Path.walk() (3.12) kills the last reason to use os.walk. zoneinfo replaces pytz (3.9). tomllib ships with the interpreter (3.11). The functools tools worth knowing.",
    order: 8,
    estimatedMinutes: 22,
    tags: ["pathlib", "zoneinfo", "tomllib", "cached_property", "singledispatch", "Path.walk"],
    relatedChallenges: [],
    icon: "🔧",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return modernPythonArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = modernPythonArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? modernPythonArticles[idx - 1] : null,
    next: idx < modernPythonArticles.length - 1 ? modernPythonArticles[idx + 1] : null,
  };
}
