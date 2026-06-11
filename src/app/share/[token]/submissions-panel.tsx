"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MessageSquare, ChevronLeft, Send, Loader2 } from "lucide-react";

import { addComment, getComments, reactToComment, type ShareSubmissionResponse, type CommentResponse } from "@/lib/api/share";
import { useAuthStore } from "@/stores/auth-store";
import { MonacoCodeEditor } from "@/components/editors/monaco-code-editor";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface Props {
  token: string;
  submissions: ShareSubmissionResponse[];
  selectedSubmission: ShareSubmissionResponse | null;
  onSelect: (s: ShareSubmissionResponse | null) => void;
}

export function ShareSubmissionsPanel({ token, submissions, selectedSubmission, onSelect }: Props) {
  if (selectedSubmission) {
    return (
      <SubmissionDetail
        token={token}
        submission={selectedSubmission}
        onBack={() => onSelect(null)}
      />
    );
  }
  return <SubmissionList submissions={submissions} onSelect={onSelect} />;
}

function SubmissionList({
  submissions,
  onSelect,
}: {
  submissions: ShareSubmissionResponse[];
  onSelect: (s: ShareSubmissionResponse) => void;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-10 border-b border-border bg-muted/50 dark:bg-card/50 shrink-0">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Submissions</span>
        <span className="text-[10px] font-mono text-muted-foreground/50 bg-muted rounded px-1.5 py-0.5">
          {submissions.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {submissions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <MessageSquare className="w-8 h-8 text-muted-foreground/20" />
            <p className="text-[12px] text-muted-foreground/50">No submissions yet</p>
            <p className="text-[11px] text-muted-foreground/30">Be the first to solve it</p>
          </div>
        )}
        {submissions.map((sub) => {
          const total = sub.test_results.length;
          const passing = sub.test_results.filter((r) => r.passed).length;
          const failing = total - passing;
          const allPass = total > 0 && failing === 0;
          const label = total === 0
            ? `${sub.score}%`
            : allPass
            ? `${total}/${total} test cases passing`
            : `${failing}/${total} test cases failing`;
          const scoreColor = total === 0 ? "text-muted-foreground" : allPass ? "text-green-500" : failing === total ? "text-red-500" : "text-amber-500";
          return (
            <motion.button
              key={sub.id}
              whileHover={{ y: -1 }}
              transition={spring}
              onClick={() => onSelect(sub)}
              className="w-full text-left px-4 py-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 cursor-pointer transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-mono font-semibold tabular-nums ${scoreColor}`}>
                  {label}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">
                  {new Date(sub.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground/50 truncate">
                {sub.code.split("\n").find((l: string) => l.trim()) ?? ""}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>

    
  );
}

function SubmissionDetail({
  token,
  submission,
  onBack,
}: {
  token: string;
  submission: ShareSubmissionResponse;
  onBack: () => void;
}) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"tests" | "comments">("tests");

  const { data: comments = [] } = useQuery({
    queryKey: ["share-comments", token, submission.id],
    queryFn: () => getComments(token, submission.id),
    refetchInterval: 8000,
  });

  const total = submission.test_results.length;
  const passing = submission.test_results.filter((r) => r.passed).length;
  const failing = total - passing;
  const allPass = total > 0 && failing === 0;
  const resultLabel = total === 0 ? `${submission.score}%` : allPass ? `${total}/${total} test cases passing` : `${failing}/${total} test cases failing`;
  const resultColor = total === 0 ? "text-muted-foreground" : allPass ? "text-green-500" : failing === total ? "text-red-500" : "text-amber-500";

  const codeLineCount = submission.code.split("\n").length;
  const editorHeight = Math.min(Math.max(codeLineCount * 20 + 28, 120), 400);
  const generalComments = comments.filter((c) => c.line_number === null);

  const TABS = [
    { id: "tests" as const,    label: "Tests",    badge: total > 0 ? `${passing}/${total}` : null },
    { id: "comments" as const, label: "Comments", badge: generalComments.length > 0 ? String(generalComments.length) : null },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 h-10 border-b border-border bg-muted/50 dark:bg-card/50 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-500"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back
        </button>
        <div className="w-px h-4 bg-border/40" />
        <span className={`text-[11px] font-mono font-semibold tabular-nums ${resultColor}`}>{resultLabel}</span>
        <span className="text-[10px] font-mono text-muted-foreground/40 ml-auto tabular-nums">
          {new Date(submission.created_at).toLocaleString()}
        </span>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Code viewer */}
        <div style={{ height: editorHeight }} className="border-b border-border/40 shrink-0">
          <MonacoCodeEditor
            value={submission.code}
            onChange={() => {}}
            language="python"
            readOnly
            height="100%"
          />
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-0 px-4 border-b border-border/40 bg-muted/30 shrink-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-b-2 transition-all duration-300 cursor-pointer ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {t.badge && (
                <span className={`text-[9px] font-mono px-1 py-0.5 rounded tabular-nums ${
                  tab === t.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {tab === "tests" && (
            <div className="px-4 py-4 space-y-2">
              {total === 0 ? (
                <p className="text-[11px] text-muted-foreground/40 py-4 text-center">No test results</p>
              ) : (
                submission.test_results.map((tr, i) => (
                  <div key={i} className="px-3 py-2.5 text-[11px] font-mono space-y-1 border-b border-border/30 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Test {i + 1}</span>
                      <span className={`text-[10px] font-semibold tabular-nums ${tr.passed ? "text-green-500" : "text-red-500"}`}>
                        {tr.passed ? "✓ pass" : "✗ fail"}
                      </span>
                    </div>
                    <p><span className="text-muted-foreground/50">Input: </span><span className="text-foreground/80">{tr.input}</span></p>
                    <p><span className="text-muted-foreground/50">Expected: </span><span className="text-foreground/80">{tr.expected}</span></p>
                    <p>
                      <span className="text-muted-foreground/50">Got: </span>
                      <span className={tr.passed ? "text-green-500" : "text-red-500"}>{tr.actual}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "comments" && (
            <div className="px-4 py-4 space-y-3">
              {generalComments.length === 0 && (
                <p className="text-[11px] text-muted-foreground/40 py-4 text-center">No comments yet</p>
              )}
              {generalComments.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  token={token}
                  onReacted={() => qc.invalidateQueries({ queryKey: ["share-comments", token, submission.id] })}
                />
              ))}
              <GeneralCommentForm
                token={token}
                submissionId={submission.id}
                onAdded={() => qc.invalidateQueries({ queryKey: ["share-comments", token, submission.id] })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Vote = "heart" | "up" | "down";
const REACTIONS_KEY = "codetail_comment_reactions";

function getMyReactions(commentId: string): Vote[] {
  try {
    const data = JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? "{}") as Record<string, Vote[]>;
    return data[commentId] ?? [];
  } catch { return []; }
}

function applyReaction(commentId: string, vote: Vote): Vote[] {
  try {
    const data = JSON.parse(localStorage.getItem(REACTIONS_KEY) ?? "{}") as Record<string, Vote[]>;
    let mine = data[commentId] ?? [];
    if (mine.includes(vote)) {
      mine = mine.filter((v) => v !== vote);
    } else {
      if (vote === "down")  mine = mine.filter((v) => v !== "heart" && v !== "up");
      if (vote === "up")    mine = mine.filter((v) => v !== "down");
      if (vote === "heart") mine = mine.filter((v) => v !== "down");
      mine = [...mine, vote];
    }
    data[commentId] = mine;
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(data));
    return mine;
  } catch { return []; }
}

function CommentCard({ comment, token, onReacted }: { comment: CommentResponse; token: string; onReacted: () => void }) {
  const { isAuthenticated } = useAuthStore();
  const [myReactions, setMyReactions] = useState<Vote[]>(() => getMyReactions(comment.id));

  const reactMutation = useMutation({
    mutationFn: (vote: Vote) => reactToComment(token, comment.id, vote),
    onSuccess: (_, vote) => {
      setMyReactions(applyReaction(comment.id, vote));
      onReacted();
    },
  });

  const REACTIONS: { vote: Vote; emoji: string; count: number }[] = [
    { vote: "heart", emoji: "❤️", count: comment.hearts },
    { vote: "up",    emoji: "👍", count: comment.upvotes },
    { vote: "down",  emoji: "👎", count: comment.downvotes },
  ];

  return (
    <div className="py-2.5 border-b border-border/30 last:border-0 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-primary">{comment.author_name}</span>
        <span className="text-[9px] font-mono text-muted-foreground/40 tabular-nums">
          {new Date(comment.created_at).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-[12px] text-foreground/80">{comment.body}</p>
      <div className="flex items-center gap-1">
        {REACTIONS.map(({ vote, emoji, count }) => {
          const active = myReactions.includes(vote);
          const canClick = isAuthenticated && !reactMutation.isPending;
          return (
            <motion.button
              key={vote}
              whileTap={canClick ? { scale: 0.88 } : {}}
              onClick={() => canClick && reactMutation.mutate(vote)}
              title={!isAuthenticated ? "Sign in to react" : undefined}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] tabular-nums transition-all duration-500 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/50 hover:bg-muted hover:text-foreground"
              } ${canClick ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            >
              <span>{emoji}</span>
              {count > 0 && <span className="font-mono">{count}</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function GeneralCommentForm({ token, submissionId, onAdded }: { token: string; submissionId: string; onAdded: () => void }) {
  const [body, setBody] = useState("");
  const user = useAuthStore((s) => s.user);

  const mutation = useMutation({
    mutationFn: () =>
      addComment(token, {
        body,
        line_number: null,
        submission_id: submissionId,
        author_name: user?.name ?? user?.email ?? "Anonymous",
      }),
    onSuccess: () => { setBody(""); onAdded(); },
  });

  return (
    <div className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Leave a general comment..."
        rows={2}
        className="w-full text-[12px] bg-muted/50 border border-border/60 rounded-lg px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/40 transition-all duration-500"
      />
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => mutation.mutate()}
        disabled={!body.trim() || mutation.isPending}
        className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-all duration-500"
      >
        {mutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
        Post Comment
      </motion.button>
    </div>
  );
}
