import { CodeBlock } from "@/components/blog/interactive/code-block";
import { Term } from "@/components/blog/interactive/term";
import { InteractiveSetBuilder } from "@/components/blog/interactive/interactive-set-builder";

export function CreatingSetsSection() {
  return (
    <section>
      <h2 id="creating-sets" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Creating sets
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A set is an unordered collection of{" "}
        <Term term="unique">unique</Term>{" "}
        elements. Each value appears at most once. Adding a duplicate does nothing.
        Sets are backed by a hash table — membership tests are O(1) regardless of size.
      </p>

      <CodeBlock
        code={`# Curly brace literal
primes = {2, 3, 5, 7, 11}

# set() constructor — converts any iterable
from_list  = set([1, 2, 2, 3, 3, 3])   # {1, 2, 3}
from_str   = set("hello")               # {'h', 'e', 'l', 'o'} — duplicates removed
from_range = set(range(5))              # {0, 1, 2, 3, 4}

# Empty set — must use set(), not {}
empty = set()           # {} would create an empty dict
print(type(empty))      # <class 'set'>

print(from_list)        # {1, 2, 3}
print(from_str)         # {'h', 'e', 'l', 'o'}`}
        output={`<class 'set'>
{1, 2, 3}
{'h', 'e', 'l', 'o'}`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2 mb-6">
        <p className="text-[13px] text-foreground/70 italic">
          Sets are unordered. Python does not guarantee any particular iteration order.
          Never write code that depends on the order items come out of a set.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Uniqueness is enforced automatically</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most common use of{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">set()</code>{" "}
        is deduplication: convert a list to a set and every duplicate disappears.
        The order of remaining items is not preserved.
      </p>

      <CodeBlock
        code={`votes = ["yes", "no", "yes", "yes", "maybe", "no"]

unique_responses = set(votes)
print(unique_responses)      # {'yes', 'no', 'maybe'}
print(len(unique_responses)) # 3

# Deduplicate while preserving order (Python 3.7+)
seen  = set()
dedup = [x for x in votes if not (x in seen or seen.add(x))]
print(dedup)                 # ['yes', 'no', 'maybe']`}
        output={`{'yes', 'no', 'maybe'}
3
['yes', 'no', 'maybe']`}
      />

      <p className="text-[15px] leading-relaxed text-foreground/90 mt-6 mb-4">
        Watch how{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">set()</code>{" "}
        collapses duplicates. Strikethrough items in the list are the ones that get dropped.
      </p>

      <InteractiveSetBuilder />
    </section>
  );
}
