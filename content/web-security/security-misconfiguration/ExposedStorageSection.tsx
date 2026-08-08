import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ExposedStorageSection() {
  return (
    <section>
      <h2 id="exposed-storage-and-endpoints" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Exposed storage and leftover endpoints
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Cloud storage defaults have gotten safer over the years, largely because so many breaches
        turned out to be nothing more than a bucket policy set to public read.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A bucket policy, set once through a console checkbox and never revisited
        </p>
        <CodeBlock
          variant="vulnerable"
          language="JSON"
          code={`{
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::user-uploads/*"
  }]
}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This is a reasonable policy for a bucket serving public marketing assets. It&apos;s a
        breach waiting to be discovered for one named{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">user-uploads</code>,
        where the objects are ID documents, contracts, or private photos. Nobody needs to guess a
        filename to find these either, bucket listing is often left enabled alongside public read,
        so an attacker gets a directory of every file, not just the ones they happen to know the
        name of.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: private by default, access mediated through your own app
        </p>
        <CodeBlock
          variant="fixed"
          language="JSON"
          code={`{
  "Statement": [{
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::user-uploads/*",
    "Condition": { "Bool": { "aws:PrincipalIsAWSService": "false" } }
  }]
}`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Serve files through your application, which checks that the requesting user actually owns
        the object, and hand out short-lived signed URLs when a browser needs direct access. The
        bucket itself should never be the thing standing between a private file and the public
        internet.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Deploying the repo, not the build
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A surprising number of production incidents start with{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">example.com/.git/config</code>{" "}
        returning a real file. It happens when a deploy script copies the whole checked-out
        repository, source, tests, and the{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">.git</code>{" "}
        directory included, onto a server that then serves that directory as static files. Tools
        that reconstruct an entire commit history from an exposed{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">.git/objects</code>{" "}
        folder are a normal part of any penetration tester&apos;s toolkit, and they don&apos;t
        need anything beyond that one exposed directory to pull your full source history, including
        anything ever committed and later &quot;removed.&quot;
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The durable fix isn&apos;t a rule that blocks{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">/.git/</code>{" "}
        at the web server, useful, but one misconfigured route away from being forgotten again.
        It&apos;s deploying only the built artifact, whatever your framework actually needs to run,
        never the repository directory itself. Nothing to expose if it was never on the server in
        the first place.
      </p>
    </section>
  );
}
