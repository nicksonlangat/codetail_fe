export default function RefundPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 27, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-[14px] leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Refunds</h2>
          <p>All purchases made through Codetail are processed by <a href="https://www.paddle.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paddle</a>, our Merchant of Record. Paddle&apos;s buyer terms and refund policy apply to all transactions.</p>
          <p>If you are not satisfied with your purchase for any reason, you may request a full refund. There are no conditions, qualifiers, or exceptions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">How to Request a Refund</h2>
          <p>You can request a refund by:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Emailing <a href="mailto:support@codetail.cc" className="text-primary hover:underline">support@codetail.cc</a> with your account email</li>
            <li>Using the cancellation link in your subscription confirmation email</li>
            <li>Contacting Paddle directly through their <a href="https://www.paddle.com/legal/buyer-terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Buyer portal</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Cancellation</h2>
          <p>You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. You will not be charged again after cancellation, and you retain access until the period ends.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Refund Method</h2>
          <p>Refunds are processed by Paddle and returned to your original payment method. Processing time depends on your bank or card issuer, typically 5–10 business days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>For refund requests or questions, contact <a href="mailto:support@codetail.cc" className="text-primary hover:underline">support@codetail.cc</a>.</p>
        </section>
      </div>
    </main>
  );
}
