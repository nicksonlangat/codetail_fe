export function ClosingTheDetectionGapSection() {
  return (
    <section>
      <h2 id="closing-the-detection-gap" className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24">
        Closing the gap between the breach and noticing it
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Year after year, industry breach investigation reports keep finding the same shape:
        median detection time measured in months, not hours, and a large share of breaches are
        first noticed by someone outside the company, a customer, a journalist, a law enforcement
        notification, rather than by the company&apos;s own monitoring. Logging and alerting exist
        specifically to close that gap, and three things usually keep it open anyway.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Retention shorter than your detection time is a contradiction
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Logs retained for seven days are worthless for investigating something discovered three
        months later, and if your own numbers say detection realistically takes longer than a
        week, seven-day retention was never actually protecting you, just satisfying a checkbox.
        Set retention based on how long an investigation might realistically need to look back,
        not on what&apos;s cheapest to store.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        An alert nobody has ever tested is a hypothesis, not a control
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A detection rule that&apos;s never fired might be working perfectly. It might also have
        been broken by a refactor eighteen months ago and nobody has noticed, because it&apos;s
        never had a reason to fire. Regular incident response drills, deliberately triggering the
        condition an alert is supposed to catch, are the only way to find out which one it is
        before a real incident does.
      </p>

      <h3 className="text-base font-semibold text-brand-text mt-8 mb-3">
        Correlating a dozen separate log files during an active incident is too late
      </h3>

      <p className="text-[15px] leading-relaxed text-brand-text/90">
        If the application, the database, the load balancer, and the auth provider each keep logs
        in their own separate system, reconstructing one attacker&apos;s path across all four means
        building that correlation pipeline for the first time, under pressure, during the incident
        itself. Centralizing logs into one searchable place is infrastructure work that has to
        happen before there&apos;s anything to investigate, not work that gets improvised once
        there is.
      </p>
    </section>
  );
}
