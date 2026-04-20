import { CodeBlock } from "@/components/blog/interactive/code-block";

export function AccessingListsSection() {
  return (
    <section>
      <h2 id="accessing-lists" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Indexing and slicing
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Lists are sequences, so everything from the Strings article applies: positive indices
        count from the left, negative from the right, and slicing extracts a sublist.
      </p>

      <CodeBlock
        code={`items = ["a", "b", "c", "d", "e"]
#          0    1    2    3    4
#         -5   -4   -3   -2   -1

print(items[0])    # "a"  - first
print(items[-1])   # "e"  - last
print(items[-2])   # "d"  - second from last

print(items[1:3])    # ["b", "c"] - indices 1 and 2
print(items[:2])     # ["a", "b"] - first two
print(items[2:])     # ["c", "d", "e"] - from index 2 onward
print(items[::-1])   # ["e", "d", "c", "b", "a"] - reversed`}
        output={`a
e
d
['b', 'c']
['a', 'b']
['c', 'd', 'e']
['e', 'd', 'c', 'b', 'a']`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Slice assignment</h3>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        Unlike strings, lists are mutable. You can assign directly to an index or a slice,
        which modifies the list in place.
      </p>
      <CodeBlock
        code={`items = [1, 2, 3, 4, 5]

# Replace a single element
items[0] = 10
print(items)    # [10, 2, 3, 4, 5]

# Replace a slice - replacement can be a different length
items[1:3] = [20, 30, 40]
print(items)    # [10, 20, 30, 40, 4, 5]

# Delete a slice
del items[1:3]
print(items)    # [10, 40, 4, 5]

# Clear via slice
items[:] = []
print(items)    # []`}
        output={`[10, 2, 3, 4, 5]
[10, 20, 30, 40, 4, 5]
[10, 40, 4, 5]
[]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Nested lists</h3>
      <CodeBlock
        code={`grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

# Access: row first, then column
print(grid[0][0])   # 1 - top-left
print(grid[2][2])   # 9 - bottom-right

# Iterate rows
for row in grid:
    print(row)

# Get a column (list comprehension)
col_1 = [row[1] for row in grid]
print(col_1)    # [2, 5, 8]`}
        output={`1
9
[1, 2, 3]
[4, 5, 6]
[7, 8, 9]
[2, 5, 8]`}
      />
    </section>
  );
}
