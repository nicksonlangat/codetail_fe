export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 27, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-[14px] leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By creating an account or using Codetail ("the Service"), you agree to these Terms and Conditions. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">2. Description of Service</h2>
          <p>Codetail is a coding practice platform that provides curated and AI-generated programming challenges, code execution, AI-powered code reviews, and learning paths for Python, Django, and related technologies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">3. Accounts</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 16 years old to use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">4. Free and Pro Plans</h2>
          <p>Codetail offers a free tier with limited access and a Pro subscription with full access. Free users receive limited AI reviews, hints, and problem access per day. Pro users receive unlimited access to all features.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">5. Payments and Billing</h2>
          <p>Pro subscriptions are billed monthly ($9/month) or yearly ($90/year) through our payment processor, Paddle. By subscribing, you authorize recurring charges until you cancel. Prices may change with 30 days notice.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">6. Cancellation</h2>
          <p>You may cancel your Pro subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You retain Pro access until the period ends. No partial refunds are issued for unused time within a billing period.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">7. Code and Content</h2>
          <p>You retain ownership of all code you write and submit on Codetail. By submitting code, you grant Codetail a limited license to store, process, and display your code for the purpose of providing the Service (progress tracking, AI reviews, etc.). We do not claim ownership of your code and do not use it to train AI models.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">8. AI-Generated Content</h2>
          <p>Codetail uses AI (OpenAI) to generate challenges, reviews, hints, and solutions. AI-generated content is provided as-is and may contain errors. You should verify AI suggestions before using them in production code.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">9. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the Service to execute malicious code or attempt to compromise our systems</li>
            <li>Share your account credentials with others</li>
            <li>Scrape, reverse-engineer, or redistribute Codetail content</li>
            <li>Use the Service for any illegal purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Limitation of Liability</h2>
          <p>Codetail is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service, including but not limited to loss of data, loss of profits, or consequential damages. Our total liability is limited to the amount you paid us in the 12 months preceding any claim.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">11. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify you of significant changes via email.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">12. Contact</h2>
          <p>Questions about these terms? Contact us at <a href="mailto:support@codetail.cc" className="text-primary hover:underline">support@codetail.cc</a>.</p>
        </section>
      </div>
    </main>
  );
}
