# PRD: AI Engineering — From Prompt to Production

**Status:** Shipped, all 15 articles live
**Author:** Codetail
**Created:** 2026-07-28
**Updated:** 2026-07-29
**Shipped:** 2026-07-29

---

## 1. Vision

A fourth long-form series for the Codetail Library, and the applied counterpart to **LLMs from Scratch**. Where that series explains why a language model works (tokenization, attention, training), this series explains how to build a product on top of one you didn't train: calling APIs, prompting, RAG, tool-using agents, evals, cost, safety, and shipping.

Same voice and format as the other three series (Python, System Design, LLMs from Scratch): exhaustive, code-first, principal-engineer tone, interactive demos where they earn their place. Not a prompting cheat sheet, not a LangChain tutorial.

---

## 2. Relationship to existing series

| Series | Answers | Register |
|---|---|---|
| LLMs from Scratch | Why does a model behave this way, internally? | Theory, math, a GPT you implement yourself |
| System Design | How does a system scale and stay up? | Systems/infra, interactive diagrams |
| **AI Engineering (new)** | How do you build a real product on top of a hosted model? | Applied, API-level, product engineering |

No overlap in content: this series never re-derives attention or backprop, it links back to LLMs from Scratch when the "why" is relevant and moves on.

---

## 3. Target audience

- Backend/product engineers bolting AI features onto an existing app for the first time
- Engineers who can call `chat.completions.create` but have never built RAG, an agent loop, or an eval harness
- Engineers preparing for "AI engineer" interviews, which are practice-heavy, not derivation-heavy
- Readers who bounce off LLMs from Scratch because they don't care about the math and just want to ship

---

## 4. Naming & infrastructure

- **Title:** AI Engineering
- **Subtitle:** From Prompt to Production
- **Route:** `/blog/ai-engineering/[slug]`, mirrors the other three series exactly
- **Registry:** `content/ai-engineering/registry.ts`, same `ArticleMeta[]` shape as `content/python/registry.ts`
- **Content folders:** `content/ai-engineering/<slug>/index.tsx` + `*Section.tsx`, mirrors `content/llms-from-scratch/`
- **Loader:** `content/ai-engineering/article-loader.ts`, same lazy-import pattern
- **Landing page:** `app/(dashboard)/blog/ai-engineering/page.tsx`, thin `PathList` wrapper like the other three
- **Article page:** `app/(dashboard)/blog/ai-engineering/[slug]/page.tsx`, mirrors the existing `[slug]` pages
- **Hub card:** once content exists, add a fourth entry to the `SERIES` array in `app/(dashboard)/blog/page.tsx` — no new hub UI needed, it was built to take an arbitrary series list

No new architecture. Every piece of infrastructure this needs already exists and is proven by the three shipped series.

---

## 5. Article list (15, shipped as proposed)

Every article below shipped with the exact slug, order, tag set, and estimated read time proposed here, no drift during writing. Live at `/blog/ai-engineering/<slug>`.

1. ✅ **What Is an LLM API** — *You're not training a model, you're renting one, by the token.*
   Request/response shape, tokens as the billing and latency unit, the context window as the one resource you actually manage.
   `~18m` · `llm-api, tokens, context-window, inference`  · 🔌 · `/blog/ai-engineering/what-is-an-llm-api`

2. ✅ **Prompting as Interface Design** — *A prompt is a spec, not a magic spell.*
   System/user/assistant roles, few-shot examples, why "just be clearer" is most of the actual skill.
   `~20m` · `prompting, few-shot, system-prompt, prompt-engineering` · ✍️ · `/blog/ai-engineering/prompting-as-interface-design`

3. ✅ **Structured Output and Tool Calling** — *Getting reliable JSON out of a model that predicts text.*
   Tool/function schemas, forced JSON modes, why tool calling is the real API surface for agents.
   `~22m` · `tool-calling, function-calling, structured-output, json-mode` · 🧩 · `/blog/ai-engineering/structured-output-and-tool-calling`

4. ✅ **Context Engineering** — *Why "just paste more text in" fails.*
   What actually belongs in the window, context rot, prompt assembly as a first-class engineering problem.
   `~18m` · `context-engineering, context-window, prompt-assembly` · 📦 · `/blog/ai-engineering/context-engineering`

5. ✅ **Embeddings and Vector Search in Practice** — *Chunking is where RAG quality is actually won or lost.*
   Chunking strategy, embedding model choice, ANN indexes. The engineering, not the math (that's LLMs from Scratch).
   `~22m` · `embeddings, vector-search, chunking, ann-index` · 🧭 · `/blog/ai-engineering/embeddings-and-vector-search-in-practice`

6. ✅ **Retrieval-Augmented Generation** — *The pipeline everyone draws as one box.*
   Ingest, chunk, embed, retrieve, rerank, generate, and where each stage quietly breaks.
   `~24m` · `rag, retrieval, reranking, pipeline` · 📚 · `/blog/ai-engineering/retrieval-augmented-generation`

7. ✅ **Agents and Tool Use** — *Plan, call a tool, observe, repeat.*
   The ReAct-style loop, why agents fail silently instead of loudly, what "agentic" actually buys you.
   `~24m` · `agents, react, tool-use, autonomy` · 🤖 · `/blog/ai-engineering/agents-and-tool-use`

8. ✅ **Multi-Agent Systems** — *When one agent stops being enough.*
   Orchestrator/worker patterns, handoffs, shared state, and the case for staying single-agent longer than you think.
   `~22m` · `multi-agent, orchestration, handoffs` · 🪢 · `/blog/ai-engineering/multi-agent-systems`

9. ✅ **Memory for AI Applications** — *"Memory" is a product decision, not a feature flag.*
   Short-term context vs. a real long-term store, summarization strategies, what to persist and what to forget.
   `~18m` · `memory, summarization, personalization` · 🗄️ · `/blog/ai-engineering/memory-for-ai-applications`

10. ✅ **Evaluating AI Systems** — *"It feels better" is not an eval.*
    LLM-as-judge, golden datasets, regression-testing a prompt change like you'd regression-test code.
    `~22m` · `evals, llm-as-judge, golden-dataset, regression-testing` · 🧪 · `/blog/ai-engineering/evaluating-ai-systems`

11. ✅ **Fine-Tuning vs. Prompting vs. RAG** — *A decision framework, not a tutorial.*
    When fine-tuning earns its cost, what LoRA/instruction tuning practically looks like, when better prompting wins outright.
    `~20m` · `fine-tuning, lora, decision-framework` · ⚖️ · `/blog/ai-engineering/fine-tuning-vs-prompting-vs-rag`

12. ✅ **Latency, Cost, and Streaming** — *Token economics is a real budget line, treat it like one.*
    Streaming responses, prompt caching, model cascades/routing to cut cost without cutting quality.
    `~18m` · `latency, cost, streaming, prompt-caching, model-routing` · ⚡ · `/blog/ai-engineering/latency-cost-and-streaming`

13. ✅ **Guardrails, Safety, and Prompt Injection** — *The attack surface of an LLM app isn't the model, it's everything feeding it.*
    Jailbreaks, prompt injection via tool output and RAG documents, output filtering. Shipped with an explicit tie back to the Web Security series' injection article: the same data-versus-instructions failure, one layer up.
    `~20m` · `prompt-injection, guardrails, jailbreaks, safety` · 🛡️ · `/blog/ai-engineering/guardrails-safety-and-prompt-injection`

14. ✅ **Observability for LLM Applications** — *Debugging something non-deterministic.*
    Tracing a request through an agent loop, logging prompts/completions without leaking secrets or PII. Shipped with an explicit tie back to the Web Security series' logging article, plus a new leakage vector named that ordinary request logging doesn't have: RAG-retrieved content entering a trace incidentally.
    `~18m` · `observability, tracing, logging` · 🔭 · `/blog/ai-engineering/observability-for-llm-applications`

15. ✅ **Shipping an AI Product** (capstone) — *Every prior article, tied into one working system.*
    Shipped as a narrative architecture walkthrough of one concrete worked example (a support assistant with RAG and one scoped tool), not a checklist like the Web Security capstone, per the format this article's own vision called for. Ends with an explicit list of what the example deliberately doesn't do (no fine-tuning, no multi-agent) and why that restraint was the right call.
    `~32m` · `capstone, architecture, deployment` · 🚀 · `/blog/ai-engineering/shipping-an-ai-product`

**Ordering logic:** API mental model → prompting → tools/context → retrieval → agents/multi-agent/memory → "is it actually working" concerns (evals, fine-tuning, cost, safety, observability) → capstone. Same shape as the other three series: build up, then assemble everything in a final article.

---

## 6. Voice

Same rules as every other `content/*` series, defined in `webapp/CLAUDE.md` under "Blog Article Voice." No em dashes, no AI-assistant tells, lead with the wrong mental model before the right one, one concrete analogy per concept. No new calibration reference needed, use the existing one (`content/python/variables-and-types/*.tsx`).

---

## 7. Decisions (resolved before starting, held through shipping)

1. **Evals stayed at position 10, not moved after RAG.** The RAG article forward-references the evals article by name when it raises the retrieval-quality-judging problem, exactly as planned, rather than reordering around it.
2. **No new interactive components.** Every code sample across all 15 articles used the plain `CodeBlock` component, no `variant` prop, unlike the Web Security series. That variant (`"vulnerable" | "fixed"`, red/green tinted borders) is specific to security defects, and reusing its visual chrome here would have been semantically wrong, a weaker prompt or a naive chunker isn't a vulnerability. Worth flagging for future series: `CodeBlock`'s `variant` prop belongs to Web Security specifically, not a general "before/after" convention to reach for elsewhere.
3. **Icon: `WandSparkles`**, shipped as planned, distinct from `Brain` (LLMs from Scratch) and `ShieldAlert` (Web Security).
4. **Article 5 links back to LLMs from Scratch's embeddings article**, as planned, rather than re-deriving cosine similarity.

---

## 8. Post-launch notes

- **The `variant` prop stayed scoped to Web Security.** See decision 2 above. This is the kind of reuse temptation worth naming explicitly in a PRD once it's noticed, a shared component's optional prop doesn't mean every series should use every prop.
- **Cross-series links, used twice, both substantive.** Guardrails, Safety, and Prompt Injection (article 13) and Observability (article 14) both link back to specific Web Security articles (Injection, and Security Logging and Monitoring) because the underlying failure is genuinely the same mechanism one layer up, not a decorative reference. Two links across 15 articles; this was treated as a real threshold, not a device to reach for whenever two series share a keyword.
- **The apostrophe-escaping lint catch recurred on nearly every article**, same as the Web Security series. Fixed every time it was caught (`tsc`/`eslint` ran after every single article, not just at the end), but it's clearly a standing gap in how headings and short caption text get drafted, not something proactive discipline fully solved this time either. Worth a lighter-weight fix for the next series: grep for the contraction list (`isn't`, `doesn't`, `can't`, `it's`, `won't`, `wouldn't`) across new JSX text before running `eslint` at all, not after.
- **The two-pass voice audit from the Web Security series (see [[feedback_ai_content_voice_audit]]) was applied proactively from article 1 instead of discovered after the fact.** A full-series grep pass at the end (quoted-strawman openers, "X isn't Y, it's Z", cross-article callback phrasing) came back clean on the first check, no second rewrite pass was needed the way Web Security's articles 5-12 needed one. Evidence the lesson transferred, not just a one-off fix.
- **`/blog` hub required zero changes to its own code**, a second confirmation (after Web Security) that the hub's `SERIES` array and search were genuinely built to take an arbitrary series list.

---

*Article status tracked in `content/ai-engineering/article-loader.ts` — a slug present in the loader map means the article is written and live. All 15 are present.*
