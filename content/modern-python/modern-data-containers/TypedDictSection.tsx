import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TypedDictSection() {
  return (
    <section>
      <h2
        id="typeddict"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        TypedDict: typed dictionaries without class overhead
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        API responses, database rows, and config blobs often arrive as plain dicts. You could
        type them as{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          dict[str, Any]
        </code>{" "}
        and lose all type safety, or convert them to dataclasses and pay the conversion cost.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          TypedDict
        </code>{" "}
        is the third option: a typed dict that stays a dict at runtime.
      </p>

      <CodeBlock
        code={`# Before TypedDict: no type safety on dict fields
def create_user(data: dict) -> dict:
    return {
        "id": data["id"],
        "name": data["name"],
        "email": data["emial"],   # typo in key: silent at type-check time
    }`}
      />

      <CodeBlock
        code={`from typing import TypedDict

class User(TypedDict):
    id: int
    name: str
    email: str

class UserWithOptionals(TypedDict, total=False):   # all keys optional
    bio: str
    avatar_url: str

def create_user(data: User) -> User:
    return {
        "id": data["id"],
        "name": data["name"],
        "email": data["emial"],   # type checker catches this typo
    }

user: User = {"id": 1, "name": "Alice", "email": "alice@example.com"}
print(user["name"])   # Alice`}
        output={`Alice`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Required and NotRequired (3.11)
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before 3.11, making some keys optional and some required required two separate TypedDicts
        and inheritance. Now you can mix them in one definition:
      </p>

      <CodeBlock
        code={`from typing import NotRequired, Required, TypedDict

class Movie(TypedDict):
    title: str                          # required
    year: int                           # required
    director: NotRequired[str]          # optional
    rating: NotRequired[float]          # optional

m: Movie = {"title": "Dune", "year": 2021}   # valid, optional keys absent
print(m["title"])   # Dune`}
        output={`Dune`}
      />
    </section>
  );
}
