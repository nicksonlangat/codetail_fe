import { CodeBlock } from "@/components/blog/interactive/code-block";

export function VerifyingInstallsSection() {
  return (
    <section>
      <h2 id="verifying-what-you-install" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Piping curl into bash is the same bug in different clothes
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This line shows up in setup docs, Dockerfiles, and CI configs across the industry, usually
        copied straight from a project&apos;s own official install instructions.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          A Dockerfile
        </p>
        <CodeBlock variant="vulnerable" language="Bash" code={`RUN curl -sSL https://example.com/install.sh | bash`} />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        HTTPS here verifies you&apos;re talking to the real{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">example.com</code>.
        It says nothing about whether the script that server returns is the one you expect. If
        that account, that CDN, or that specific file ever gets compromised, even briefly, every
        build that runs this line during that window executes whatever the attacker put there,
        with the full privileges of your build process. There&apos;s no verification step at all,
        just trust that the response body is safe to run as root.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fixed: download, verify, then execute, as three separate steps
        </p>
        <CodeBlock
          variant="fixed"
          language="Bash"
          code={`curl -sSL https://example.com/install.sh -o install.sh
echo "9f86d081884c7d659a2feaa0c55ad015  install.sh" | sha256sum -c -
bash install.sh`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        The checksum has to come from somewhere other than the same source you&apos;re verifying,
        pinned in your own repository, from a release page you checked once, not fetched fresh
        from the site that could itself be compromised. If the downloaded file doesn&apos;t match,
        the build fails before a single line of it runs. That one extra step is the difference
        between &quot;this came from the domain I expected&quot; and &quot;this is the exact file
        I meant to run.&quot;
      </p>
    </section>
  );
}
