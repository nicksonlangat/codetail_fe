export function WhatToPersistSection() {
  return (
    <section>
      <h2 id="deciding-what-to-persist" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Not everything a user says is meant to outlive the conversation
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        &quot;Make the summary shorter this time&quot; is a preference for this task. &quot;I go
        by Alex, not my legal name&quot; is a durable fact about the person. Treating both the
        same way, remembering everything or remembering nothing, gets one of them wrong every
        time.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The design choice underneath that distinction is whether memory writes are explicit or
        implicit. An explicit write is a user action, &quot;remember this,&quot; or a settings
        page, clear about what got stored and easy to review or delete later. An implicit write
        has the model itself flag &quot;this seems worth remembering&quot; during a normal
        conversation, which scales better, nobody has to think to ask, and fails in a specific,
        uncomfortable way: silently storing something wrong, or something sensitive the user
        never intended to persist past that one conversation.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Implicit memory isn&apos;t wrong to build. It needs the same posture as any system storing
        personal data without an explicit confirmation for each write: the user can see what was
        stored, and can delete it, and the categories of thing the model is allowed to
        automatically remember are deliberately scoped, not &quot;whatever it decides seems
        important&quot; unbounded.
      </p>
    </section>
  );
}
