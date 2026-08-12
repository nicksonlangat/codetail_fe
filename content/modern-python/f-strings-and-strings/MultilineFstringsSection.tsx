import { CodeBlock } from "@/components/blog/interactive/code-block";

export function MultilineFstringsSection() {
  return (
    <section>
      <h2
        id="multiline-fstrings"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Multiline f-strings and nested quotes (3.12)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Before 3.12, you could not use the same quote character inside an f-string expression as
        the one delimiting the string itself. It caused awkward workarounds with temporary
        variables or different quote styles.
      </p>

      <CodeBlock
        code={`# Pre-3.12: can't use " inside f"..." -- SyntaxError
names = ["Alice", "Bob", "Charlie"]

# Workaround 1: pre-compute
joined = ", ".join(names)
print(f"Users: {joined}")

# Workaround 2: use a dict-style access with different quotes
data = {"key": "value"}
print(f"Value: {data['key']}")   # single inside double: fine

# Workaround 3: use a backslash escape -- also a SyntaxError before 3.12
# print(f"Users: {', '.join(names)}")`}
        output={`Users: Alice, Bob, Charlie
Value: value`}
      />

      <CodeBlock
        code={`# Python 3.12: any quotes inside any f-string -- just works
names = ["Alice", "Bob", "Charlie"]
data = {"key": "value"}

print(f"Users: {', '.join(names)}")
print(f'Value: {data["key"]}')

# Nested f-strings work too
scores = {"Alice": 95, "Bob": 87}
report = f"Top: {f'{max(scores, key=scores.get)} ({max(scores.values())})'}"
print(report)`}
        output={`Users: Alice, Bob, Charlie
Value: value
Top: Alice (95)`}
      />

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Multiline f-strings for templates
      </h3>

      <CodeBlock
        code={`user = {"name": "Alice", "role": "admin", "last_login": "2026-01-15"}

# Clean multiline f-string -- no concatenation needed
email_body = f"""
Hello {user["name"]},

Your account ({user["role"]}) last logged in on {user["last_login"]}.

Regards,
The Team
""".strip()

print(email_body)`}
        output={`Hello Alice,

Your account (admin) last logged in on 2026-01-15.

Regards,
The Team`}
      />

      <div className="border-l-2 border-brand-primary pl-4 py-2 mb-6 mt-6">
        <p className="text-[14px] text-brand-text/80">
          The{" "}
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            .strip()
          </code>{" "}
          at the end removes the leading and trailing newlines from the triple-quoted string
          itself, so the output starts cleanly. This is a reliable pattern for multiline
          f-string templates.
        </p>
      </div>
    </section>
  );
}
