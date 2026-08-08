"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Share2, ChevronLeft, ChevronRight, FileText, StickyNote,
  RotateCcw, Play, Send, FlaskConical, Lightbulb, WandSparkles, BookOpen,
  CheckCircle2, XCircle, Lock, Loader2,
} from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MonacoCodeEditor } from "@/components/editors/monaco-code-editor";
import { NotesEditor } from "@/components/editors/notes-editor";

const ENTRANCE = { type: "spring" as const, stiffness: 300, damping: 30 };
const TAB_SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const KW = "text-brand-primary";

const STARTER_CODE = `def word_frequency(words: list) -> dict:
    pass
`;

const TESTS = [
  { input: '["go","python","go","rust"]', expected: '{"go":2,"python":1,"rust":1}' },
  { input: "[]", expected: "{}" },
  { input: '["django"]', expected: '{"django":1}' },
  { input: '["a","b","a","c","b","a"]', expected: '{"a":3,"b":2,"c":1}' },
  { input: '["x","y","z"]', expected: '{"x":1,"y":1,"z":1}' },
  { input: '["ok","ok"]', expected: '{"ok":2}' },
];

const BOTTOM_TABS = [
  { id: "tests", label: "Test Cases", icon: FlaskConical },
  { id: "hints", label: "Hints", icon: Lightbulb },
  { id: "review", label: "AI Review", icon: WandSparkles },
  { id: "solution", label: "Solution", icon: BookOpen },
] as const;

type BottomTab = (typeof BOTTOM_TABS)[number]["id"];

function CodeChip({ children }: { children: string }) {
  return (
    <code className="rounded bg-brand-primary/10 text-brand-primary font-mono text-[12px] px-1.5 py-0.5">
      {children}
    </code>
  );
}

const colHandle =
  "w-[3px] bg-brand-border hover:bg-brand-primary cursor-col-resize transition-all duration-500 shrink-0";
const rowHandle =
  "h-[3px] bg-brand-border hover:bg-brand-primary cursor-row-resize transition-all duration-500 shrink-0";

const LEFT_TABS = [
  { id: "description", label: "Description", icon: FileText },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;

type LeftTab = (typeof LEFT_TABS)[number]["id"];

export function ChallengePreview() {
  const [bottomTab, setBottomTab] = useState<BottomTab>("tests");
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [code, setCode] = useState(STARTER_CODE);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const implemented = code.trim() !== STARTER_CODE.trim();
  const solved = hasRun && implemented;

  function handleRun() {
    if (running) return;
    setBottomTab("tests");
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setHasRun(true);
    }, 900);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ENTRANCE, delay: 0.15 }}
      className="relative max-w-6xl mx-auto px-6 pb-32"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 -top-16 h-64 bg-brand-primary/10 blur-3xl rounded-full"
      />

      <div className="relative rounded-2xl border border-brand-border bg-white shadow-2xl overflow-x-auto">
        <div className="min-w-220">
          {/* app header */}
          <div className="flex items-center justify-between h-14 px-5 border-b border-brand-border shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <ArrowLeft className="size-4 text-brand-text-muted" />
              <span className="font-semibold text-brand-text">Python Fundamentals</span>
              <span className="text-brand-text-subtle">/</span>
              <span className="text-brand-text-muted">Dicts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border text-brand-text-muted text-xs font-medium px-2.5 py-1.5">
                <Share2 className="size-3.5" /> Share
              </span>
              <span className="inline-flex items-center rounded-lg border border-brand-border text-brand-text-muted text-xs font-medium px-2 py-1.5">
                <ChevronLeft className="size-3.5" />
              </span>
              <span className="text-xs text-brand-text-subtle font-mono px-1">2 / 12</span>
              <span className="inline-flex items-center gap-0.5 rounded-lg border border-brand-border text-brand-text-muted text-xs font-medium px-2.5 py-1.5">
                Next <ChevronRight className="size-3.5" />
              </span>
            </div>
          </div>

          <ResizablePanelGroup orientation="horizontal" className="h-150">
            {/* description pane */}
            <ResizablePanel defaultSize={45} minSize={28}>
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center gap-5 h-11 px-6 border-b border-brand-border shrink-0">
                  {LEFT_TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setLeftTab(id)}
                      className={`relative flex items-center gap-1.5 h-full text-xs font-medium cursor-pointer transition-all duration-500 ${
                        leftTab === id
                          ? "text-brand-text"
                          : "text-brand-text-muted hover:text-brand-text"
                      }`}
                    >
                      <Icon className="size-3.5" /> {label}
                      {leftTab === id && (
                        <motion.span
                          layoutId="left-tab-underline"
                          transition={TAB_SPRING}
                          className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-primary"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                {leftTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={TAB_SPRING}
                    className="p-6 space-y-5"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-brand-text">Word Frequency</h3>
                      <div className="mt-2 flex gap-1.5">
                        <span className="rounded-md bg-brand-primary/10 text-brand-primary text-[11px] font-medium px-2 py-0.5">
                          easy
                        </span>
                        <span className="rounded-md bg-brand-surface text-brand-text-muted text-[11px] font-medium px-2 py-0.5">
                          Write Code
                        </span>
                        <span className="rounded-md bg-brand-surface text-brand-text-muted text-[11px] font-medium px-2 py-0.5">
                          Building Dicts
                        </span>
                      </div>
                    </div>

                    <hr className="border-brand-border" />

                    <div>
                      <h4 className="text-sm font-semibold text-brand-text mb-1.5">Scenario</h4>
                      <p className="text-[13px] leading-6 text-brand-text-muted">
                        A search analytics pipeline counts how often each term appears in a query
                        log before ranking results by popularity.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-brand-text mb-1.5">Constraints</h4>
                      <ul className="text-[13px] leading-6 text-brand-text-muted list-disc pl-4 space-y-0.5">
                        <li>
                          Preserve case, <CodeChip>&quot;Go&quot;</CodeChip> and{" "}
                          <CodeChip>&quot;go&quot;</CodeChip> are different words
                        </li>
                        <li>Return an empty dict for an empty list</li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-brand-text-subtle mb-1.5">
                        Function signature
                      </p>
                      <div className="rounded-lg bg-brand-surface px-4 py-2.5 font-mono text-[12.5px] text-brand-text">
                        <span className={KW}>def</span> word_frequency(words: list) -&gt; dict:
                      </div>
                    </div>

                    <div className="rounded-xl border border-brand-border p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-brand-text-subtle mb-1.5">
                        Example 1
                      </p>
                      <p className="font-mono text-[12.5px] text-brand-text">
                        Input: words = [&quot;go&quot;, &quot;python&quot;, &quot;go&quot;,{" "}
                        &quot;rust&quot;]
                      </p>
                      <p className="font-mono text-[12.5px] text-brand-text">
                        Output: {"{"}&quot;go&quot;: <span className={KW}>2</span>,{" "}
                        &quot;python&quot;: <span className={KW}>1</span>, &quot;rust&quot;:{" "}
                        <span className={KW}>1</span>
                        {"}"}
                      </p>
                      <p className="mt-1.5 text-[12px] text-brand-text-muted">
                        &quot;go&quot; appears twice, others once.
                      </p>
                    </div>
                  </motion.div>
                )}

                {leftTab === "notes" && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={TAB_SPRING}
                    className="h-full"
                  >
                    <NotesEditor content="<p>dict.get(word, 0) + 1 avoids a <code>KeyError</code> entirely, no need to check membership first.</p>" />
                  </motion.div>
                )}
                </AnimatePresence>

                {leftTab === "description" && (
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none"
                  />
                )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className={colHandle} />

            {/* editor + tests pane */}
            <ResizablePanel defaultSize={55} minSize={30}>
              <ResizablePanelGroup orientation="vertical" className="h-full">
                <ResizablePanel defaultSize={55} minSize={25}>
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between h-11 px-4 border-b border-brand-border shrink-0">
                      <span className="text-xs text-brand-text">
                        <span className="text-brand-text-muted">Python</span> main.py
                      </span>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="size-3.5 text-brand-text-muted" />
                        <button
                          type="button"
                          onClick={handleRun}
                          disabled={running}
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-border text-brand-text-muted text-[11px] font-medium px-2.5 py-1.5 cursor-pointer transition-all duration-500 hover:bg-brand-surface disabled:cursor-default"
                        >
                          {running ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Play className="size-3" />
                          )}{" "}
                          Run
                        </button>
                        <button
                          type="button"
                          onClick={handleRun}
                          disabled={running}
                          className="inline-flex items-center gap-1 rounded-lg bg-brand-primary text-white text-[11px] font-medium px-2.5 py-1.5 cursor-pointer transition-all duration-500 hover:bg-brand-primary-hover disabled:cursor-default"
                        >
                          {running ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Send className="size-3" />
                          )}{" "}
                          Submit
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 min-h-0">
                      <MonacoCodeEditor value={code} onChange={setCode} language="python" />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle className={rowHandle} />

                <ResizablePanel defaultSize={45} minSize={20}>
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex items-center gap-5 h-10 px-4 border-b border-brand-border shrink-0">
                      {BOTTOM_TABS.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setBottomTab(id)}
                          className={`relative flex items-center gap-1.5 h-full text-xs font-medium cursor-pointer transition-all duration-500 ${
                            bottomTab === id
                              ? "text-brand-text"
                              : "text-brand-text-muted hover:text-brand-text"
                          }`}
                        >
                          <Icon className="size-3.5" /> {label}
                          {bottomTab === id && (
                            <motion.span
                              layoutId="bottom-tab-underline"
                              transition={TAB_SPRING}
                              className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-primary"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="relative flex-1 overflow-hidden">
                      <AnimatePresence mode="wait">
                        {bottomTab === "tests" && (
                          <motion.div
                            key="tests"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={TAB_SPRING}
                            className="px-4 py-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-brand-text">Test Cases</p>
                              {hasRun && (
                                <span
                                  className={`flex items-center gap-1 text-[11px] font-medium ${
                                    implemented ? "text-brand-success" : "text-brand-destructive"
                                  }`}
                                >
                                  {implemented ? (
                                    <CheckCircle2 className="size-3.5" />
                                  ) : (
                                    <XCircle className="size-3.5" />
                                  )}
                                  {implemented ? TESTS.length : 0} / {TESTS.length} passed
                                </span>
                              )}
                            </div>
                            <div className="divide-y divide-brand-border">
                              {TESTS.map((test, i) => (
                                <div key={i} className="flex gap-3 py-2.5 text-[12.5px]">
                                  <span className="shrink-0 mt-0.5">
                                    {hasRun ? (
                                      implemented ? (
                                        <CheckCircle2 className="size-3.5 text-brand-success" />
                                      ) : (
                                        <XCircle className="size-3.5 text-brand-destructive" />
                                      )
                                    ) : (
                                      <span className="text-brand-text-subtle">&middot;</span>
                                    )}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-brand-text">Test {i + 1}</p>
                                    <p className="font-mono text-brand-text-muted truncate">
                                      Input: {test.input}
                                    </p>
                                    <p className="font-mono text-brand-text-muted truncate">
                                      Expected: {test.expected}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {bottomTab === "hints" && (
                          <motion.div
                            key="hints"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={TAB_SPRING}
                            className="px-4 py-3 space-y-3"
                          >
                            <p className="text-sm font-semibold text-brand-text">Hints</p>
                            <div className="rounded-lg border border-brand-border p-3">
                              <p className="text-[10px] font-medium uppercase tracking-wider text-brand-text-subtle mb-1">
                                Hint 1 &middot; gentle
                              </p>
                              <p className="text-[12.5px] leading-5 text-brand-text-muted">
                                Think about counting occurrences by hand. What structure tracks a
                                running count per key?
                              </p>
                            </div>
                            <div className="rounded-lg border border-brand-border p-3 flex items-center justify-between">
                              <p className="text-[12.5px] text-brand-text-muted">Hint 2 is locked</p>
                              <span className="text-[11px] font-medium text-brand-primary">
                                Reveal
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {bottomTab === "review" && (
                          <motion.div
                            key="review"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={TAB_SPRING}
                            className="px-4 py-3 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-brand-text flex items-center gap-1.5">
                                <WandSparkles className="size-3.5 text-brand-primary" /> AI Review
                              </p>
                              <span className="rounded-md bg-brand-primary/10 text-brand-primary text-[11px] font-semibold px-2 py-0.5">
                                82 / 100
                              </span>
                            </div>
                            <p className="text-[12.5px] leading-5 text-brand-text-muted">
                              Clean structure and clear naming, but the empty-list edge case is not
                              explicitly handled.
                            </p>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-[12px] text-brand-text">
                                <CheckCircle2 className="size-3.5 text-brand-success shrink-0" />
                                Correct on all provided examples
                              </div>
                              <div className="flex items-center gap-2 text-[12px] text-brand-text">
                                <XCircle className="size-3.5 text-brand-destructive shrink-0" />
                                Missing type hints on the return value
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {bottomTab === "solution" && solved && (
                          <motion.div
                            key="solution-unlocked"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={TAB_SPRING}
                            className="px-4 py-3"
                          >
                            <p className="text-sm font-semibold text-brand-text mb-2">
                              Reference solution
                            </p>
                            <div className="rounded-lg bg-brand-surface p-3 font-mono text-[12px] leading-5 text-brand-text">
                              <div>
                                <span className={KW}>def</span> word_frequency(words: list) -&gt;{" "}
                                dict:
                              </div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;counts = {"{}"}</div>
                              <div>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className={KW}>for</span> word{" "}
                                <span className={KW}>in</span> words:
                              </div>
                              <div>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;counts[word] =
                                counts.get(word, 0) + 1
                              </div>
                              <div>
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className={KW}>return</span> counts
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {bottomTab === "solution" && !solved && (
                          <motion.div
                            key="solution-locked"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={TAB_SPRING}
                            className="h-full flex flex-col items-center justify-center gap-2 px-4 py-6 text-center"
                          >
                            <Lock className="size-5 text-brand-text-subtle" />
                            <p className="text-[12.5px] text-brand-text-muted max-w-56">
                              Solve the problem or use both hints to unlock the reference solution.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {bottomTab === "tests" && (
                        <div
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent pointer-events-none"
                        />
                      )}
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </motion.div>
  );
}
