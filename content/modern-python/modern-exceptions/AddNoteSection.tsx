import { CodeBlock } from "@/components/blog/interactive/code-block";

export function AddNoteSection() {
  return (
    <section>
      <h2
        id="add-note"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        exception.add_note() (3.11)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Sometimes you catch an exception further up the stack and want to attach context without
        wrapping it in a new exception. Before 3.11, your options were to either re-raise with a
        new type (losing the original) or mutate{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          args
        </code>{" "}
        (fragile). Python 3.11 added{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          add_note()
        </code>
        .
      </p>

      <CodeBlock
        code={`# Before 3.11: no clean way to annotate an exception you're re-raising
def process_batch(items: list[str]) -> None:
    for i, item in enumerate(items):
        try:
            process_item(item)
        except ValueError as e:
            # Only option: wrap and lose original type
            raise RuntimeError(f"Failed on item {i}: {item}") from e`}
      />

      <CodeBlock
        code={`# Python 3.11: add_note() attaches context and keeps the original type
def process_item(value: str) -> int:
    return int(value)

def process_batch(items: list[str]) -> None:
    for i, item in enumerate(items):
        try:
            process_item(item)
        except ValueError as e:
            e.add_note(f"Failed on item {i}: {item!r}")
            e.add_note(f"Batch had {len(items)} items total")
            raise   # re-raise the original -- same type, same traceback, plus notes

try:
    process_batch(["1", "2", "bad", "4"])
except ValueError as e:
    print(type(e).__name__)  # still ValueError, not RuntimeError
    for note in e.__notes__:
        print("Note:", note)`}
        output={`ValueError
Note: Failed on item 2: 'bad'
Note: Batch had 4 items total`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Notes appear at the end of the traceback automatically. The exception type stays the same,
        which matters for callers catching specific types. This is especially useful in test
        frameworks and CLI tools that want to add diagnostic context without changing control flow.
      </p>
    </section>
  );
}
