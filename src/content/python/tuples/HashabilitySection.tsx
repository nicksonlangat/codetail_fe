import { CodeBlock } from "@/components/blog/interactive/code-block";

export function HashabilitySection() {
  return (
    <section>
      <h2 id="hashability" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        Hashability
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A hashable object has a stable integer identity that never changes during its
        lifetime. Python requires this for any object used as a dictionary key or placed
        in a set. Lists are not hashable because they can change. Tuples are hashable
        because they cannot.
      </p>

      <CodeBlock
        code={`# Tuples can be dict keys
grid = {
    (0, 0): "origin",
    (1, 0): "right",
    (0, 1): "up",
}
print(grid[(1, 0)])    # right

# Lists cannot
# bad = {[0, 0]: "origin"}   # TypeError: unhashable type: 'list'

# Tuples can be in sets
visited = set()
visited.add((3, 5))
visited.add((1, 2))
print((3, 5) in visited)    # True`}
        output={`right
True`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Practical: graph traversal</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The most common use of tuple hashability is tracking visited positions in a
        grid or graph. A set of tuples gives you O(1) membership tests with readable code.
      </p>

      <CodeBlock
        code={`def bfs(start: tuple, grid: set) -> list:
    from collections import deque

    visited = {start}
    queue   = deque([start])
    order   = []

    while queue:
        x, y = queue.popleft()
        order.append((x, y))

        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            neighbor = (x + dx, y + dy)
            if neighbor in grid and neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order

cells = {(0,0), (0,1), (1,0), (1,1), (2,0)}
print(bfs((0, 0), cells))`}
        output={`[(0, 0), (0, 1), (1, 0), (1, 1), (2, 0)]`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">When tuples are not hashable</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        A tuple is only hashable if all of its elements are hashable. Put a list inside
        and the whole tuple becomes unhashable.
      </p>

      <CodeBlock
        code={`hash((1, 2, 3))        # works fine
hash((1, "hello", True))  # works fine

# A tuple containing a list is not hashable
t = (1, [2, 3])
hash(t)                # TypeError: unhashable type: 'list'`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mt-2">
        <p className="text-[13px] text-foreground/70 italic">
          If you need a hashable fixed-length sequence with mutable elements, freeze them first.
          For example, convert the inner list to a tuple:{" "}
          <code className="font-mono text-[12px] bg-muted px-1 py-0.5 rounded">
            (1, tuple([2, 3]))
          </code>{" "}
          is hashable.
        </p>
      </div>
    </section>
  );
}
