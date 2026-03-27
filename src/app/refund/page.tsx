export default function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 27, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-[14px] leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-semibold text-foreground">14-Day Money-Back Guarantee</h2>
          <p>If you are not satisfied with your Codetail Pro subscription, you can request a full refund within 14 days of your initial purchase. No questions asked.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">How to Request a Refund</h2>
          <p>Email <a href="mailto:support@codetail.cc" className="text-primary hover:underline">support@codetail.cc</a> with your account email and the word "refund" in the subject line. We will process your refund within 5 business days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">After 14 Days</h2>
          <p>After the 14-day window, we do not offer refunds for the current billing period. You can cancel your subscription at any time, and you will retain access until the end of your current billing period.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Yearly Subscriptions</h2>
          <p>Yearly subscriptions are eligible for the same 14-day money-back guarantee from the date of purchase. After 14 days, cancellation takes effect at the end of the yearly billing period.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Refund Method</h2>
          <p>Refunds are processed through Paddle, our payment provider, and returned to your original payment method. Processing time depends on your bank or card issuer, typically 5–10 business days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Exceptions</h2>
          <p>We reserve the right to deny refund requests in cases of abuse, such as repeated sign-up-and-refund cycles, or violations of our Terms and Conditions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>For refund requests or questions, contact <a href="mailto:support@codetail.cc" className="text-primary hover:underline">support@codetail.cc</a>.</p>
        </section>
      </div>
    </main>
  );
}
