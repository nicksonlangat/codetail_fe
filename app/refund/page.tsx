import { LegalPage } from "@/components/legal/legal-page";

export default function RefundPage() {
  return (
    <LegalPage title="Refund Policy" lastUpdated="March 27, 2026">
      <section>
        <h2 className="text-lg font-semibold text-brand-text mb-2">Refunds</h2>
        <p>
          All purchases made through Codetail are processed by{" "}
          <a
            href="https://www.paddle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            Paddle
          </a>
          , our Merchant of Record. Paddle&apos;s buyer terms and refund policy apply to all
          transactions.
        </p>
        <p className="mt-2">
          If you are not satisfied with your purchase for any reason, you may request a full
          refund within 14 days of your purchase. There are no conditions, qualifiers, or
          exceptions. We will process your refund within 5 business days.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-text mb-2">How to Request a Refund</h2>
        <p>You can request a refund by:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            Emailing{" "}
            <a href="mailto:support@codetail.cc" className="text-brand-primary hover:underline">
              support@codetail.cc
            </a>{" "}
            with your account email
          </li>
          <li>Using the cancellation link in your subscription confirmation email</li>
          <li>
            Contacting Paddle directly through their{" "}
            <a
              href="https://www.paddle.com/legal/buyer-terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              Buyer portal
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-text mb-2">Cancellation</h2>
        <p>
          You may cancel your subscription at any time. Cancellation takes effect at the end of
          your current billing period. You will not be charged again after cancellation, and you
          retain access until the period ends.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-text mb-2">Refund Method</h2>
        <p>
          Refunds are processed by Paddle and returned to your original payment method. Processing
          time depends on your bank or card issuer, typically 5 to 10 business days.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-text mb-2">Contact</h2>
        <p>
          For refund requests or questions, contact{" "}
          <a href="mailto:support@codetail.cc" className="text-brand-primary hover:underline">
            support@codetail.cc
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
