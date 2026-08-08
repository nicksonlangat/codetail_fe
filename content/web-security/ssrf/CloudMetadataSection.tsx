import { CodeBlock } from "@/components/blog/interactive/code-block";

export function CloudMetadataSection() {
  return (
    <section>
      <h2 id="cloud-metadata" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        The cloud metadata endpoint: SSRF&apos;s most expensive payoff
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every major cloud provider gives a running instance a way to ask &quot;what am I,&quot;
        over HTTP, at a fixed internal address that isn&apos;t routable from outside the cloud
        network. On AWS it&apos;s{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">169.254.169.254</code>,
        and one path on it hands out live credentials.
      </p>

      <div className="bg-white border border-brand-border rounded-xl p-4 mb-6 not-prose">
        <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">
          Fed straight into the vulnerable endpoint from the last section
        </p>
        <CodeBlock
          variant="vulnerable"
          language="HTTP"
          code={`POST /fetch-preview
url=http://169.254.169.254/latest/meta-data/iam/security-credentials/my-role-name`}
        />
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That endpoint responds with a real, temporary access key, secret key, and session token
        for whatever IAM role the instance is running as. No authentication required, because the
        whole design assumes only code already running on that exact instance could ever ask.
        SSRF breaks that assumption the same way it breaks &quot;internal means trusted&quot;
        everywhere else: the request really is coming from the instance, the attacker just chose
        where the instance points its own outbound call.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This isn&apos;t a theoretical worst case. It&apos;s the documented mechanism behind the
        2019 Capital One breach: an SSRF vulnerability was used to query the AWS metadata service,
        the resulting temporary credentials were used to access S3 buckets, and the incident
        exposed data belonging to more than 100 million people. One unvalidated URL turned into
        one of the largest breaches of the decade.
      </p>

      <div className="border-l-2 border-brand-warning bg-brand-warning/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted">
          <strong>In practice:</strong> enforce IMDSv2 on every EC2 instance (
          <code className="font-mono text-[12px]">aws ec2 modify-instance-metadata-options --http-tokens required</code>
          ). It requires a{" "}
          <code className="font-mono text-[12px]">PUT</code> request to fetch a session token
          before any metadata{" "}
          <code className="font-mono text-[12px]">GET</code> works, and caps how many network hops
          that token can travel. A plain SSRF vector that only forces your server to issue a{" "}
          <code className="font-mono text-[12px]">GET</code> typically can&apos;t reproduce that
          handshake, which closes off this specific attack even before you&apos;ve fixed the
          underlying SSRF bug.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        IMDSv2 is a mitigation for one specific target, not a fix for SSRF itself. The actual bug,
        a server that fetches any URL it&apos;s handed, is still there and still worth closing on
        its own terms.
      </p>
    </section>
  );
}
