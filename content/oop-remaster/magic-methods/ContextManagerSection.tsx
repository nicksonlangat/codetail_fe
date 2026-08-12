import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ContextManagerSection() {
  return (
    <section>
      <h2
        id="context-manager"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Context managers: __enter__ and __exit__
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">with</code>{" "}
        statement is one of Python's best features. It guarantees cleanup runs even if an exception
        occurs. Under the hood, it calls two methods:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __enter__
        </code>{" "}
        when entering the block, and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __exit__
        </code>{" "}
        when leaving, whether normally or via exception.
      </p>

      <CodeBlock
        code={`import time

class Timer:
    def __enter__(self):
        self._start = time.perf_counter()
        return self   # this becomes the 'as' value

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.perf_counter() - self._start
        print(f"Elapsed: {elapsed:.4f}s")
        return False  # False means: don't suppress exceptions

with Timer() as t:
    total = sum(range(1_000_000))
    print(f"Sum: {total}")`}
        output={`Sum: 499999500000
Elapsed: 0.0312s`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          __exit__
        </code>{" "}
        receives three arguments about any exception that occurred:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          exc_type
        </code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">exc_val</code>
        ,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">exc_tb</code>
        . If no exception occurred, all three are{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">None</code>.
        Return{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">True</code>{" "}
        to suppress the exception, or{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">False</code>{" "}
        (or nothing) to let it propagate.
      </p>

      <CodeBlock
        code={`class ManagedFile:
    def __init__(self, path, mode="r"):
        self.path = path
        self.mode = mode
        self._file = None

    def __enter__(self):
        self._file = open(self.path, self.mode)
        return self._file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._file:
            self._file.close()
        return False   # let exceptions propagate

with ManagedFile("data.txt") as f:
    content = f.read()
# f is closed here, even if read() raised an exception`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        You do not need to implement this from scratch when{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          contextlib.contextmanager
        </code>{" "}
        offers a simpler decorator-based approach for straightforward cases. But understanding
        the dunder protocol helps you recognize what any context manager is doing under the hood.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          Any object with{" "}
          <code className="font-mono text-[12px]">__enter__</code> and{" "}
          <code className="font-mono text-[12px]">__exit__</code> works with{" "}
          <code className="font-mono text-[12px]">with</code>. No inheritance required. This is duck
          typing in action.
        </p>
      </div>
    </section>
  );
}
