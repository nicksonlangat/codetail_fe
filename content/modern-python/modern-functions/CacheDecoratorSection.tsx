import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CacheDecoratorSection() {
  return (
    <section>
      <h2
        id="cache-decorator"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        @functools.cache and @lru_cache (3.9)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Memoisation before 3.9 meant writing your own dict cache, or using{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @lru_cache(maxsize=None)
        </code>{" "}
        which required the awkward{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          maxsize=None
        </code>{" "}
        argument to disable the size limit. Python 3.9 added{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          @cache
        </code>{" "}
        as a clean alias for the unbounded case.
      </p>

      <CodeBlock
        code={`import functools
import time

# Manual cache: the old way
_fib_cache: dict[int, int] = {}

def fib_manual(n: int) -> int:
    if n in _fib_cache:
        return _fib_cache[n]
    if n < 2:
        return n
    result = fib_manual(n - 1) + fib_manual(n - 2)
    _fib_cache[n] = result
    return result

# 3.9: @cache -- same semantics, no boilerplate
@functools.cache
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))
print(fib.cache_info())`}
        output={`12586269025
CacheInfo(hits=48, misses=51, maxsize=None, currsize=51)`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        @lru_cache with a size limit
      </h3>

      <CodeBlock
        code={`from functools import lru_cache

# Keep only the 128 most recent results
@lru_cache(maxsize=128)
def fetch_user_from_db(user_id: int) -> dict:
    # Simulating a DB call
    print(f"  [DB] fetching user {user_id}")
    return {"id": user_id, "name": f"User{user_id}"}

print(fetch_user_from_db(1))
print(fetch_user_from_db(2))
print(fetch_user_from_db(1))   # cache hit, no DB call
print(fetch_user_from_db.cache_info())`}
        output={`  [DB] fetching user 1
{'id': 1, 'name': 'User1'}
  [DB] fetching user 2
{'id': 2, 'name': 'User2'}
{'id': 1, 'name': 'User1'}
CacheInfo(hits=1, misses=2, maxsize=128, currsize=2)`}
      />

      <div className="border-l-2 border-brand-primary pl-4 py-2 mb-6 mt-6">
        <p className="text-[14px] text-brand-text/80">
          Rule: use{" "}
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            @cache
          </code>{" "}
          for pure functions with no side effects and unbounded inputs (maths, parsing). Use{" "}
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            @lru_cache(maxsize=N)
          </code>{" "}
          when you care about memory: a large key space would grow without bound otherwise.
          Arguments must be hashable for either decorator to work.
        </p>
      </div>
    </section>
  );
}
