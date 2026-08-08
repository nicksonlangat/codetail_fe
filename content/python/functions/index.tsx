import { DefiningFunctionsSection } from "./DefiningFunctionsSection";
import { ParametersSection } from "./ParametersSection";
import { ScopeSection } from "./ScopeSection";
import { LambdaSection } from "./LambdaSection";
import { ClosuresSection } from "./ClosuresSection";
import { DecoratorsSection } from "./DecoratorsSection";

export const toc = [
  { id: "defining", title: "Defining functions" },
  { id: "parameters", title: "Parameters" },
  { id: "scope", title: "Scope" },
  { id: "lambda", title: "Lambda and higher-order functions" },
  { id: "closures", title: "Closures" },
  { id: "decorators", title: "Decorators" },
];

export default function FunctionsArticle() {
  return (
    <>
      <DefiningFunctionsSection />
      <ParametersSection />
      <ScopeSection />
      <LambdaSection />
      <ClosuresSection />
      <DecoratorsSection />
    </>
  );
}
