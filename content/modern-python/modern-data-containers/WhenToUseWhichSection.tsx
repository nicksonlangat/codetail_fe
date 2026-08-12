import { CodeBlock } from "@/components/blog/interactive/code-block";

export function WhenToUseWhichSection() {
  return (
    <section>
      <h2
        id="when-to-use-which"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Choosing between dict, TypedDict, NamedTuple, and dataclass
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Four containers, and each is the right answer for a specific situation. Picking the wrong
        one is not a disaster, but it creates friction.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">NamedTuple</h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Use when you need tuple semantics: positional indexing, unpacking, immutability. Common
        for return values where you want both named access and tuple unpacking.
      </p>

      <CodeBlock
        code={`from typing import NamedTuple

class Coordinate(NamedTuple):
    lat: float
    lng: float
    altitude: float = 0.0

pos = Coordinate(51.5, -0.12)

# Named access
print(pos.lat)   # 51.5

# Tuple unpacking
lat, lng, alt = pos
print(lat, lng)  # 51.5 -0.12

# Positional indexing
print(pos[0])    # 51.5

# Hashable, works in sets and dict keys
visited = {pos}
print(len(visited))  # 1`}
        output={`51.5
51.5 -0.12
51.5
1`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">The decision</h3>

      <div className="rounded-xl border border-brand-border overflow-hidden mb-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-brand-surface border-b border-brand-border">
              <th className="text-left px-4 py-3 font-semibold text-brand-text">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-brand-text">Reach for it when</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            <tr>
              <td className="px-4 py-3 font-mono text-brand-primary">dict</td>
              <td className="px-4 py-3 text-brand-text/80">keys are dynamic or unknown at definition time</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-primary">TypedDict</td>
              <td className="px-4 py-3 text-brand-text/80">data comes from JSON or an API and must stay a dict</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-primary">NamedTuple</td>
              <td className="px-4 py-3 text-brand-text/80">immutable record, tuple unpacking needed</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-primary">@dataclass</td>
              <td className="px-4 py-3 text-brand-text/80">object needs methods, validation, or mutable fields</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-primary">@dataclass(frozen=True)</td>
              <td className="px-4 py-3 text-brand-text/80">immutable value object that needs to be hashable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        code={`# The same concept across all four, for reference

# dict: flexible but untyped
user = {"id": 1, "name": "Alice"}

# TypedDict: typed dict, stays a dict at runtime
from typing import TypedDict
class User(TypedDict):
    id: int
    name: str

# NamedTuple: immutable, tuple-compatible
from typing import NamedTuple
class User(NamedTuple):
    id: int
    name: str

# dataclass: full class, mutable by default
from dataclasses import dataclass
@dataclass
class User:
    id: int
    name: str

# frozen dataclass: immutable, hashable
@dataclass(frozen=True)
class User:
    id: int
    name: str`}
      />
    </section>
  );
}
