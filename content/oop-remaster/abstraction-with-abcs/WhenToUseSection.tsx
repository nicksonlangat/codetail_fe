import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhenToUseSection() {
  return (
    <section>
      <h2
        id="when-to-use"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        ABC vs Protocol: when to use which
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        There is no single right answer, but there are clear defaults.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Use an <strong>ABC</strong> when:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-relaxed text-brand-text/90 mb-6">
        <li>You own the full hierarchy and want enforcement at class definition time.</li>
        <li>
          The abstract base provides shared concrete methods that all subclasses should inherit.
        </li>
        <li>
          You want{" "}
          <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
            isinstance()
          </code>{" "}
          checks to reflect membership explicitly.
        </li>
      </ul>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Use a <strong>Protocol</strong> when:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-[15px] leading-relaxed text-brand-text/90 mb-6">
        <li>You are writing library or utility code and want to accept any compatible object.</li>
        <li>The implementors do not or cannot inherit from your base class.</li>
        <li>You want duck typing but with type-checker enforcement.</li>
      </ul>

      <CodeBlock
        code={`# ABC: you own everything, want enforcement and shared code
from abc import ABC, abstractmethod

class StorageBackend(ABC):
    @abstractmethod
    def read(self, key: str) -> bytes: ...

    @abstractmethod
    def write(self, key: str, data: bytes) -> None: ...

    def exists(self, key: str) -> bool:   # shared concrete method
        try:
            self.read(key)
            return True
        except KeyError:
            return False

# Protocol: you want to accept anything with a .read() method
from typing import Protocol

class Readable(Protocol):
    def read(self, n: int = -1) -> bytes: ...

def process(source: Readable) -> None:
    data = source.read()
    # works with open() file handles, BytesIO, network streams, anything`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          Readable
        </code>{" "}
        protocol in the example above already matches Python's built-in file objects, the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          BytesIO
        </code>{" "}
        class, network sockets, and any third-party object with a{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          read()
        </code>{" "}
        method. None of them need to know about your Protocol. That flexibility is the whole point.
      </p>
    </section>
  );
}
