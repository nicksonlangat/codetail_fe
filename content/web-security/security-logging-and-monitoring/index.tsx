import { WhatToLogSection } from "./WhatToLogSection";
import { WhatNeverToLogSection } from "./WhatNeverToLogSection";
import { AlertingOnSignalSection } from "./AlertingOnSignalSection";
import { ClosingTheDetectionGapSection } from "./ClosingTheDetectionGapSection";

export const toc = [
  { id: "what-to-log", title: "Logging enough to answer \"who did what, when\"" },
  { id: "what-never-to-log", title: "Logs are a copy of your data, with fewer safeguards" },
  { id: "alerting-on-the-right-signal", title: "Having logs isn't the same thing as having detection" },
  { id: "closing-the-detection-gap", title: "Closing the gap between the breach and noticing it" },
];

export default function SecurityLoggingAndMonitoringArticle() {
  return (
    <>
      <WhatToLogSection />
      <WhatNeverToLogSection />
      <AlertingOnSignalSection />
      <ClosingTheDetectionGapSection />
    </>
  );
}
