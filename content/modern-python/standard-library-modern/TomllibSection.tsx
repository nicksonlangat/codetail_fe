import { CodeBlock } from "@/components/blog/interactive/code-block";

export function TomllibSection() {
  return (
    <section>
      <h2
        id="tomllib"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        tomllib: built-in TOML parsing (3.11)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        TOML is the config format used by{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          pyproject.toml
        </code>{" "}
        and Cargo, Rust's package manager. Before 3.11, reading it required a third-party package
        (usually{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          tomli
        </code>{" "}
        or{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          toml
        </code>
        ). Python 3.11 ships{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          tomllib
        </code>{" "}
        in the standard library.
      </p>

      <CodeBlock
        code={`# config.toml
# [server]
# host = "localhost"
# port = 8080
# debug = false
#
# [database]
# url = "postgresql://localhost/mydb"
# pool_size = 10
# timeout = 30.0
#
# [features]
# enabled = ["auth", "logging", "metrics"]`}
      />

      <CodeBlock
        code={`import tomllib

# Must open in binary mode ("rb")
with open("config.toml", "rb") as f:
    config = tomllib.load(f)

print(config["server"]["host"])          # localhost
print(config["server"]["port"])          # 8080
print(config["database"]["pool_size"])   # 10
print(config["features"]["enabled"])     # ['auth', 'logging', 'metrics']

# Parse from string (bytes)
toml_str = b"""
[app]
name = "codetail"
version = "1.0.0"
"""
data = tomllib.loads(toml_str.decode())
print(data["app"]["name"])   # codetail`}
        output={`localhost
8080
10
['auth', 'logging', 'metrics']
codetail`}
      />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mt-6 mb-4">
        Note:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          tomllib
        </code>{" "}
        is read-only. There is no built-in writer. For writing TOML, you still need{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          tomli-w
        </code>{" "}
        or{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          tomllib
        </code>
        's companion package. For most use cases (reading config files), the standard library
        is all you need.
      </p>
    </section>
  );
}
