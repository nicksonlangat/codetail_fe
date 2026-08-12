import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ChainMapSection() {
  return (
    <section>
      <h2
        id="chainmap"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        ChainMap: layered lookup without merging
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          ChainMap
        </code>{" "}
        groups multiple dicts into a single view. Lookups search each dict in order and return
        the first match. No copy is made. Writes always go to the first dict.
      </p>

      <CodeBlock
        code={`from collections import ChainMap

# Classic use: environment variable layering
defaults     = {"debug": False, "log_level": "INFO", "timeout": 30}
env_config   = {"log_level": "WARNING"}               # env overrides some
user_config  = {"debug": True, "timeout": 60}         # user overrides more

config = ChainMap(user_config, env_config, defaults)

print(config["debug"])      # True   -- from user_config
print(config["log_level"])  # WARNING -- from env_config
print(config["timeout"])    # 60     -- from user_config
print(config["missing"])    # KeyError -- not in any layer`}
        output={`True
WARNING
60
KeyError: 'missing'`}
      />

      <CodeBlock
        code={`from collections import ChainMap

# Writes go to the first map only -- originals untouched
user = {"x": 1}
base = {"x": 99, "y": 2}

layered = ChainMap(user, base)
layered["z"] = 100   # writes to 'user', not 'base'

print(dict(user))    # {'x': 1, 'z': 100}
print(dict(base))    # {'x': 99, 'y': 2}

# new_child() creates a fresh empty layer on top -- great for scopes
child = layered.new_child({"x": 42})
print(child["x"])    # 42 -- from child
print(child["y"])    # 2  -- from base, falls through
print(child.parents["x"])  # 1 -- back to parent scope`}
        output={`{'x': 1, 'z': 100}
{'x': 99, 'y': 2}
42
2
1`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        The difference from{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          dict | dict
        </code>
        :{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          |
        </code>{" "}
        creates a new merged dict. ChainMap keeps the originals separate and reads lazily, so
        changes to the underlying dicts are visible through the ChainMap. Use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">|</code>{" "}
        for a snapshot, use ChainMap for a live layered view.
      </p>
    </section>
  );
}
