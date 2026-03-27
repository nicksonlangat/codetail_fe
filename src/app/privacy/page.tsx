export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 27, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-[14px] leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p>When you create a Codetail account, we collect your name, email address, and password (stored as a bcrypt hash — we never store plaintext passwords). When you use the platform, we collect your code submissions, problem progress, AI review history, and notes.</p>
          <p>We also collect standard usage data: browser type, device information, IP address, and pages visited. This helps us improve the platform and diagnose issues.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and maintain the Codetail platform</li>
            <li>To track your learning progress and generate personalized recommendations</li>
            <li>To send AI-generated daily practice emails (Pro users, opt-out available)</li>
            <li>To process payments through our payment provider, Paddle</li>
            <li>To respond to support requests</li>
            <li>To improve our services and develop new features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Code Submissions</h2>
          <p>Your code submissions are stored to track progress and enable AI reviews. We do not sell, share, or use your code for any purpose other than providing the Codetail service. Your code is not used to train AI models.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>OpenAI</strong> — to generate AI reviews, hints, solutions, and practice problems. Your code is sent to OpenAI for review purposes only.</li>
            <li><strong>Paddle</strong> — to process subscription payments. Paddle handles all payment data; we do not store credit card numbers.</li>
            <li><strong>Resend</strong> — to send transactional and daily digest emails.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Data Retention</h2>
          <p>Your account data and progress are retained as long as your account is active. If you delete your account, we will remove your personal data within 30 days. Anonymized usage statistics may be retained indefinitely.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data at any time by emailing <a href="mailto:support@codetail.cc" className="text-primary hover:underline">support@codetail.cc</a>. If you are in the EU, you have additional rights under GDPR including data portability and the right to object to processing.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Cookies</h2>
          <p>We use essential cookies for authentication (session tokens). We do not use tracking cookies or third-party advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. Security</h2>
          <p>We use industry-standard security measures including HTTPS encryption, bcrypt password hashing, and JWT-based authentication. All data is stored in encrypted databases.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes via email or a notice on the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:support@codetail.cc" className="text-primary hover:underline">support@codetail.cc</a>.</p>
        </section>
      </div>
    </main>
  );
}
