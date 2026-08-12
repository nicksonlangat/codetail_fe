import { CodeBlock } from "@/components/blog/interactive/code-block";

export function ZoneinfoSection() {
  return (
    <section>
      <h2
        id="zoneinfo"
        className="text-xl font-semibold text-brand-text mt-12 mb-4 scroll-mt-24"
      >
        zoneinfo: timezones without pytz (3.9)
      </h2>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        For years, handling timezones in Python meant installing{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          pytz
        </code>{" "}
        and learning its quirks (always use{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          localize()
        </code>
        , never pass a pytz timezone to{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          replace()
        </code>
        ). Python 3.9 ships{" "}
        <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">
          zoneinfo
        </code>{" "}
        in the standard library, backed by the system timezone database.
      </p>

      <CodeBlock
        code={`# Before 3.9: had to install pytz
import pytz
from datetime import datetime

tz = pytz.timezone("America/New_York")
now = datetime.now(tz)                 # OK
also_now = datetime(2024, 1, 1, tzinfo=tz)  # Wrong! Must use localize()

# The correct way with pytz:
also_now = tz.localize(datetime(2024, 1, 1))   # confusing API`}
      />

      <CodeBlock
        code={`from datetime import datetime
from zoneinfo import ZoneInfo

# Python 3.9: works like a normal tzinfo -- no special API
now = datetime.now(ZoneInfo("America/New_York"))
print(now)

# Creating aware datetimes
meeting = datetime(2026, 3, 15, 14, 30, tzinfo=ZoneInfo("Europe/London"))
print(meeting)

# Converting between timezones
in_new_york = meeting.astimezone(ZoneInfo("America/New_York"))
print(in_new_york)

# UTC is always available
from datetime import timezone
utc_now = datetime.now(timezone.utc)
print(utc_now)`}
        output={`2026-08-10 09:23:41.123456-04:00
2026-03-15 14:30:00+00:00
2026-03-15 10:30:00-04:00
2026-08-10 13:23:41.123456+00:00`}
      />

      <div className="border-l-2 border-brand-primary pl-4 py-2 mb-6 mt-6">
        <p className="text-[14px] text-brand-text/80">
          On some Linux systems without a system timezone database, you need to{" "}
          <code className="font-mono text-[12px] bg-brand-surface px-1 py-0.5 rounded">
            pip install tzdata
          </code>{" "}
          as a fallback. This is the only external package needed and it is a pure-data package.
          On macOS and Windows, the system database is always available.
        </p>
      </div>
    </section>
  );
}
