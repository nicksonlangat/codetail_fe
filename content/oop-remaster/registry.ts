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

export const oopRemasterArticles: ArticleMeta[] = [
  {
    slug: "objects-everywhere",
    title: "Objects Everywhere",
    subtitle: "You've been using OOP since line one.",
    description:
      "Python is object-oriented by design, not by choice. Before writing a single class, understand what an object actually is, and why Python made everything one.",
    order: 1,
    estimatedMinutes: 15,
    tags: ["object", "type()", "dir()", "state", "behavior", "id()"],
    relatedChallenges: [],
    icon: "🔍",
  },
  {
    slug: "your-first-class",
    title: "Your First Class",
    subtitle: "Blueprint, instance, self. The three things that matter.",
    description:
      "class, __init__, and self without the hand-waving. The blueprint vs instance mental model made concrete, plus the four mistakes beginners always make.",
    order: 2,
    estimatedMinutes: 20,
    tags: ["class", "__init__", "self", "instance", "attributes", "methods"],
    relatedChallenges: ["bank-account", "shopping-cart"],
    icon: "🏗️",
  },
  {
    slug: "encapsulation",
    title: "Encapsulation",
    subtitle: "Control what the outside world can touch.",
    description:
      "What 'private' actually means in Python. Naming conventions, name mangling, and the @property decorator as a controlled public API.",
    order: 3,
    estimatedMinutes: 18,
    tags: ["encapsulation", "_private", "__mangled", "@property", "@setter"],
    relatedChallenges: ["bank-account"],
    icon: "🔐",
  },
  {
    slug: "inheritance",
    title: "Inheritance",
    subtitle: "IS-A relationships, super(), and when to walk away.",
    description:
      "Why inheritance exists, how super() actually works, what MRO is and why it matters, and the honest conversation about when inheritance hurts more than it helps.",
    order: 4,
    estimatedMinutes: 22,
    tags: ["inheritance", "super()", "MRO", "subclass", "override", "IS-A"],
    relatedChallenges: ["shape-hierarchy", "employee-system"],
    icon: "🧬",
  },
  {
    slug: "polymorphism-and-duck-typing",
    title: "Polymorphism and Duck Typing",
    subtitle: "Same call, different behavior. Python's way.",
    description:
      "What polymorphism means, how Python achieves it through duck typing instead of interfaces, and why checking isinstance() in business logic is usually a warning sign.",
    order: 5,
    estimatedMinutes: 18,
    tags: ["polymorphism", "duck typing", "override", "isinstance", "interface"],
    relatedChallenges: ["payment-processor", "file-exporter"],
    icon: "🦆",
  },
  {
    slug: "abstraction-with-abcs",
    title: "Abstraction with ABCs",
    subtitle: "Contracts that enforce themselves.",
    description:
      "Duck typing works until someone forgets to implement a method. Abstract base classes and Protocols add enforcement without sacrificing flexibility.",
    order: 6,
    estimatedMinutes: 16,
    tags: ["ABC", "@abstractmethod", "Protocol", "abstraction", "interface", "contract"],
    relatedChallenges: ["storage-backend", "notification-service"],
    icon: "📋",
  },
  {
    slug: "magic-methods",
    title: "Magic Methods",
    subtitle: "Make your objects feel like Python built them.",
    description:
      "The dunder methods that let your objects work with print(), len(), +, ==, for loops, and with statements. Each one shown with the gotcha that bites you if you skip it.",
    order: 7,
    estimatedMinutes: 25,
    tags: ["__repr__", "__eq__", "__hash__", "__add__", "__len__", "__iter__", "__enter__"],
    relatedChallenges: ["custom-list", "money-class"],
    icon: "✨",
  },
  {
    slug: "composition-and-modern-oop",
    title: "Composition and Modern OOP",
    subtitle: "The tools that make OOP actually pleasant.",
    description:
      "Why deep inheritance hierarchies rot, how composition fixes it, @dataclass for clean value objects, and @classmethod/@staticmethod when you need them.",
    order: 8,
    estimatedMinutes: 22,
    tags: ["composition", "@dataclass", "@classmethod", "@staticmethod", "dependency injection"],
    relatedChallenges: ["order-system", "config-manager"],
    icon: "🧩",
  },
];

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return oopRemasterArticles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string) {
  const idx = oopRemasterArticles.findIndex((a) => a.slug === slug);
  return {
    prev: idx > 0 ? oopRemasterArticles[idx - 1] : null,
    next: idx < oopRemasterArticles.length - 1 ? oopRemasterArticles[idx + 1] : null,
  };
}
