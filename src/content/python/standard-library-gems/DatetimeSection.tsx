import { CodeBlock } from "@/components/blog/interactive/code-block";

export function DatetimeSection() {
  return (
    <section>
      <h2 id="datetime" className="text-xl font-semibold mt-12 mb-4 scroll-mt-24">
        datetime
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        The{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">datetime</code>{" "}
        module provides three types you will use constantly:{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">date</code>{" "}
        (year, month, day),{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">datetime</code>{" "}
        (date plus time), and{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">timedelta</code>{" "}
        (a duration you can add or subtract).
      </p>

      <CodeBlock
        code={`from datetime import date, datetime, timedelta

today = date.today()
now   = datetime.now()

print(today)   # 2024-03-15
print(now)     # 2024-03-15 14:32:07.891234

# Construct specific dates
deadline = date(2024, 12, 31)
meeting  = datetime(2024, 3, 20, 9, 30)   # March 20 at 09:30

# Date arithmetic
in_30_days = today + timedelta(days=30)
diff = deadline - today
print(diff.days)   # number of days until deadline`}
        output={`2024-03-15
2024-03-15 14:32:07.891234
291`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Formatting and parsing</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">strftime</code>{" "}
        formats a datetime to a string.{" "}
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">strptime</code>{" "}
        parses a string back into a datetime. The format codes are the same in both.
      </p>

      <CodeBlock
        code={`from datetime import datetime

dt = datetime(2024, 3, 15, 14, 32, 7)

# Format: datetime → string
print(dt.strftime("%Y-%m-%d"))             # 2024-03-15
print(dt.strftime("%d %B %Y"))             # 15 March 2024
print(dt.strftime("%I:%M %p"))             # 02:32 PM
print(dt.strftime("%Y-%m-%dT%H:%M:%S"))   # 2024-03-15T14:32:07

# Parse: string → datetime
raw    = "2024-03-15 14:32:07"
parsed = datetime.strptime(raw, "%Y-%m-%d %H:%M:%S")
print(type(parsed))   # <class 'datetime.datetime'>`}
        output={`2024-03-15
15 March 2024
02:32 PM
2024-03-15T14:32:07
<class 'datetime.datetime'>`}
      />

      <h3 className="text-base font-semibold mt-8 mb-3">Timezone-aware datetimes</h3>

      <p className="text-[15px] leading-relaxed text-foreground/90 mb-4">
        <code className="font-mono text-[13px] bg-muted px-1.5 py-0.5 rounded">datetime.now()</code>{" "}
        returns a naive datetime with no timezone attached. For APIs, databases,
        and any code that crosses timezones, use timezone-aware datetimes from the start.
      </p>

      <CodeBlock
        code={`from datetime import datetime, timezone, timedelta

# UTC — always use this for storage and APIs
now_utc = datetime.now(timezone.utc)
print(now_utc)   # 2024-03-15 14:32:07.123456+00:00

# Convert to a specific UTC offset
tz_plus2 = timezone(timedelta(hours=2))
local = now_utc.astimezone(tz_plus2)
print(local)     # 2024-03-15 16:32:07.123456+02:00

# Parse an ISO 8601 string with timezone (Python 3.7+)
ts = datetime.fromisoformat("2024-03-15T14:32:07+00:00")
print(ts.tzinfo)   # UTC`}
        output={`2024-03-15 14:32:07.123456+00:00
2024-03-15 16:32:07.123456+02:00
UTC`}
      />

      <div className="border-l-2 border-primary bg-primary/5 pl-4 py-3 rounded-r-lg mb-6 mt-4">
        <p className="text-[13px] text-foreground/70 italic">
          Store datetimes in UTC. Convert to local time only at the display layer.
          This one rule prevents the majority of timezone-related bugs.
        </p>
      </div>

      <h3 className="text-base font-semibold mt-8 mb-3">Common format codes</h3>

      <CodeBlock
        code={`# The codes you use most often
# %Y  four-digit year:       2024
# %m  zero-padded month:     03
# %d  zero-padded day:       15
# %H  24-hour hour:          14
# %I  12-hour hour:          02
# %M  minute:                32
# %S  second:                07
# %p  AM/PM:                 PM
# %B  full month name:       March
# %A  full weekday name:     Friday
# %f  microseconds:          891234
# %z  UTC offset:            +0000`}
      />
    </section>
  );
}
