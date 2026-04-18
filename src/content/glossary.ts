export type GlossaryEntry = {
  name: string;
  type: string;
  definition: string;
  example?: string;
  exampleOutput?: string;
};

export const GLOSSARY: Record<string, GlossaryEntry> = {
  sequence: {
    name: "sequence",
    type: "Python concept",
    definition:
      "An ordered, indexable collection. Sequences support len(), integer indexing (s[0]), slicing (s[1:3]), and iteration. Strings, lists, tuples, and ranges are sequences. Not all iterables are: sets and generators are iterable but you can't index into them.",
    example: `s = "hello"      # str is a sequence
nums = [1, 2, 3]  # list is a sequence

print(s[0])        # indexable
print(nums[1:3])   # sliceable
print(len(s))      # has a length`,
    exampleOutput: `h
[2, 3]
5`,
  },
  iterable: {
    name: "iterable",
    type: "Python concept",
    definition:
      "Anything you can loop over with a for loop. Broader than sequences: sets, dicts, generators, and file handles are all iterable, but they don't support indexing. Every sequence is an iterable, but not every iterable is a sequence.",
    example: `# All iterable, but only the first two are sequences:
for c in "hello": pass    # str - sequence ✓
for x in [1, 2, 3]: pass  # list - sequence ✓
for x in {1, 2, 3}: pass  # set — iterable only
for x in (n for n in range(3)): pass  # generator`,
  },
  immutable: {
    name: "immutable",
    type: "Python concept",
    definition:
      'An object whose value cannot be changed after it\'s created. Any "modification" creates a brand-new object rather than changing the original. Strings, integers, floats, and tuples are immutable. Lists and dicts are not.',
    example: `s = "hello"
print(id(s))   # memory address: 140234568

s += " world"  # creates a NEW string object
print(id(s))   # different address: 140235024`,
    exampleOutput: `140234568
140235024`,
  },
  mutable: {
    name: "mutable",
    type: "Python concept",
    definition:
      "An object whose contents can be changed in-place after creation. Lists, dicts, and sets are mutable. Because they can be modified without creating a new object, two variables can point to the same mutable object, which is a common source of bugs.",
    example: `nums = [1, 2, 3]
print(id(nums))   # 140234568

nums.append(4)    # modifies in-place
print(id(nums))   # still 140234568
print(nums)       # [1, 2, 3, 4]`,
    exampleOutput: `140234568
140234568
[1, 2, 3, 4]`,
  },
  unicode: {
    name: "Unicode",
    type: "standard",
    definition:
      "A universal standard that assigns a unique number (code point) to every character in every writing system: Latin, Arabic, Chinese, emoji, symbols, and more. Python 3 strings are Unicode by default, so they handle any language without special setup.",
    example: `print("café")     # accented characters
print("日本語")    # Japanese
print("\\u0041")   # escape → "A"
print(ord("A"))    # 65 (code point)`,
    exampleOutput: `café
日本語
A
65`,
  },
  "code point": {
    name: "code point",
    type: "Unicode",
    definition:
      "The unique integer assigned to a character in the Unicode standard. 'A' is U+0041 (65), '€' is U+20AC (8364), '😀' is U+1F600 (128512). Python's ord() converts a character to its code point; chr() does the reverse.",
    example: `print(ord("A"))    # 65
print(ord("€"))    # 8364
print(ord("😀"))   # 128512
print(chr(65))     # "A"`,
    exampleOutput: `65
8364
128512
A`,
  },
  "hash table": {
    name: "hash table",
    type: "data structure",
    definition:
      "A data structure that stores key-value pairs and uses a hash function to compute where each key lives in memory. This gives O(1) average lookup time regardless of size: looking up a key in a 1-million-entry dict is as fast as in a 10-entry dict.",
    example: `d = {"name": "Alice", "age": 30}

# O(1) lookup - doesn't scan the whole dict
print(d["name"])  # "Alice"`,
    exampleOutput: `Alice`,
  },
  "reference counting": {
    name: "reference counting",
    type: "Python internals",
    definition:
      "Python tracks how many variables point to each object. When the count hits zero, the object is garbage collected. This is why reassigning a variable doesn't destroy the original: if something else still references it, it stays alive.",
    example: `import sys
s = "hello"
t = s           # two references to same object

print(sys.getrefcount(s))  # 3 (s, t, getrefcount arg)
del t
print(sys.getrefcount(s))  # 2`,
    exampleOutput: `3
2`,
  },
  "f-string": {
    name: "f-string",
    type: "Python syntax",
    definition:
      "Formatted string literals (Python 3.6+). Prefix a string with f and embed any Python expression inside {}: variables, arithmetic, method calls, format specs. The expression is evaluated at runtime and inserted into the string.",
    example: `name = "Alice"
age = 30
price = 9.5

print(f"Hello, {name}!")
print(f"In 10 years: {age + 10}")
print(f"Price: \${price:.2f}")`,
    exampleOutput: `Hello, Alice!
In 10 years: 40
Price: $9.50`,
  },
  "string interning": {
    name: "string interning",
    type: "Python internals",
    definition:
      "Python automatically reuses memory for short strings and string literals that look like identifiers. Two variables assigned the same short string often point to the exact same object in memory. Don't rely on this behavior: use == to compare string values, not is.",
    example: `a = "hello"
b = "hello"
print(a is b)    # True (interned - same object)
print(a == b)    # True (same value)

c = "hello world"
d = "hello world"
print(c is d)    # may be False (not interned)
print(c == d)    # True (always use ==)`,
    exampleOutput: `True
True
False
True`,
  },
};
