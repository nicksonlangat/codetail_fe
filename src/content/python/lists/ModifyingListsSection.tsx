import { CodeBlock } from "@/components/blog/interactive/code-block";
import { InteractiveList } from "@/components/blog/interactive/interactive-list";

export function ModifyingListsSection() {
  return (
    <section>
      <h2 id="modifying-lists" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Modifying lists
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-6">
        Lists are mutable: you can add, remove, and rearrange items after creation.
        Try the operations below, then read the explanations.
      </p>

      <div className="mb-8">
        <InteractiveList initialItems={["apple", "banana", "cherry", "date"]} />
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Adding items</h3>
      <CodeBlock
        code={`fruits = ["apple", "banana"]

# append() - add one item to the end - O(1), fast
fruits.append("cherry")
print(fruits)    # ["apple", "banana", "cherry"]

# insert(index, value) - add at a specific position - O(n), shifts items right
fruits.insert(1, "avocado")
print(fruits)    # ["apple", "avocado", "banana", "cherry"]

# extend() - add all items from another iterable
fruits.extend(["date", "elderberry"])
print(fruits)    # ["apple", "avocado", "banana", "cherry", "date", "elderberry"]

# + creates a NEW list, doesn't modify in place
more = fruits + ["fig"]
print(more is fruits)   # False - different object`}
        output={`['apple', 'banana', 'cherry']
['apple', 'avocado', 'banana', 'cherry']
['apple', 'avocado', 'banana', 'cherry', 'date', 'elderberry']
False`}
      />

      <div className="border-l-2 border-warning bg-warning/5 pl-4 py-3 rounded-r-lg mt-3 mb-6">
        <p className="text-[13px] text-foreground/70">
          <strong>append vs extend:</strong>{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">fruits.append(["fig", "grape"])</code>{" "}
          adds the list as a single nested element.{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">fruits.extend(["fig", "grape"])</code>{" "}
          adds each item individually.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Removing items</h3>
      <CodeBlock
        code={`fruits = ["apple", "banana", "cherry", "banana"]

# remove(value) - removes FIRST occurrence by value, raises ValueError if missing
fruits.remove("banana")
print(fruits)    # ["apple", "cherry", "banana"]

# pop(index) - removes and returns item at index (default: last)
last = fruits.pop()
print(last)      # "banana"
print(fruits)    # ["apple", "cherry"]

first = fruits.pop(0)
print(first)     # "apple"

# del - remove by index or slice, no return value
items = [1, 2, 3, 4, 5]
del items[1]
print(items)     # [1, 3, 4, 5]

# clear() - remove everything
items.clear()
print(items)     # []`}
        output={`['apple', 'cherry', 'banana']
banana
['apple', 'cherry']
apple
[1, 3, 4, 5]
[]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Other operations</h3>
      <CodeBlock
        code={`nums = [3, 1, 4, 1, 5, 9, 2]

# copy() - shallow copy
copy = nums.copy()   # same as nums[:] or list(nums)

# reverse() - in-place
nums.reverse()
print(nums)    # [2, 9, 5, 1, 4, 1, 3]

# sort() - in-place
nums.sort()
print(nums)    # [1, 1, 2, 3, 4, 5, 9]

# count(value) - how many times value appears
print(nums.count(1))    # 2

# index(value) - position of first occurrence
print(nums.index(4))    # 4`}
        output={`[2, 9, 5, 1, 4, 1, 3]
[1, 1, 2, 3, 4, 5, 9]
2
4`}
      />
    </section>
  );
}
