import { BaseVsInstruct } from "@/components/blog/interactive/base-vs-instruct";

export function WhyRawModelDoesntChatSection() {
  return (
    <section>
      <h2
        id="why-a-raw-model-doesnt-chat"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        Why a raw pretrained model doesn&apos;t chat
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A common assumption: train a language model on enough of the internet and it naturally
        learns to be helpful, because helpfulness is what a smart, well-read entity would do.
        That&apos;s wrong, and the previous article explains why. Pretraining, as covered in{" "}
        <strong>Pretraining at Scale</strong>, has exactly one objective: predict the next token
        given the tokens before it, over a huge scrape of web pages, books, and code. Nothing in
        that objective ever asked the model to be helpful. It asked the model to be a good guesser
        of what text comes next.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Feed a base model the prompt &ldquo;How do I bake bread?&rdquo; and it doesn&apos;t reach
        for an answer. It reaches for whatever continuation looks statistically plausible given
        everything it saw during training that started that way. Sometimes that&apos;s a direct
        answer, because plenty of web text is direct answers. Just as often it&apos;s a list of
        similar questions, because that prompt looks exactly like the first line of a forum thread
        or a FAQ page, and those get followed by more questions, not answers.
      </p>

      <BaseVsInstruct />

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Toggle between the two modes above. The base model completion isn&apos;t broken or buggy,
        it&apos;s doing exactly what it was trained to do: continue the text in a way that matches
        the distribution of similar text it saw. A prompt that starts a forum thread gets continued
        like a forum thread. A prompt that reads like a worksheet prompt gets continued like a
        worksheet, with more prompts underneath it. The model has no notion of &ldquo;the user asked
        me something, so I should answer it,&rdquo; because pretraining never drew that boundary.
        There is no user, no assistant, just one long stream of tokens to keep going.
      </p>

      <div className="border-l-2 border-brand-primary bg-brand-primary/5 pl-4 py-3 rounded-r-lg mb-6">
        <p className="text-[13px] text-brand-text-muted italic">
          Rule: a base model completes text plausibly. An assistant answers a question directly,
          in a consistent voice, and stops when it&apos;s done. Those are different skills, and
          pretraining only teaches the first one.
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Getting from one to the other isn&apos;t a matter of prompting harder or waiting for a
        bigger model. It requires more training, on different data, pointed at a different goal.
        That&apos;s the rest of this article: three techniques, each one layered on top of the
        last, that turn a fluent text-continuer into something that behaves like an assistant.
      </p>
    </section>
  );
}
