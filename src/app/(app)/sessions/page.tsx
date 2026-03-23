"use client";

import { MessageSquare, Clock, CheckCircle2, XCircle, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SessionStatus = "completed" | "abandoned" | "in-progress";

interface Session {
  id: string;
  problem: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: SessionStatus;
  messages: number;
  duration: string;
  date: string;
  problemCount: number;
  summary: string;
}

const sessions: Session[] = [
  {
    id: "1",
    problem: "Two Sum",
    topic: "Hash Map",
    difficulty: "Easy",
    status: "completed",
    messages: 12,
    duration: "8m",
    date: "Today",
    problemCount: 3,
    summary: "Solved with optimal O(n) approach after 2 hints.",
  },
  {
    id: "2",
    problem: "Merge Intervals",
    topic: "Arrays",
    difficulty: "Medium",
    status: "completed",
    messages: 18,
    duration: "14m",
    date: "Today",
    problemCount: 2,
    summary: "Needed help with sorting step; solved independently after.",
  },
  {
    id: "3",
    problem: "LRU Cache",
    topic: "Design",
    difficulty: "Hard",
    status: "abandoned",
    messages: 8,
    duration: "22m",
    date: "Yesterday",
    problemCount: 1,
    summary: "Struggled with doubly-linked list implementation.",
  },
  {
    id: "4",
    problem: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    status: "in-progress",
    messages: 6,
    duration: "4m",
    date: "Yesterday",
    problemCount: 1,
    summary: "Started exploring stack approach, paused mid-session.",
  },
];

const statusConfig: Record<SessionStatus, { icon: React.ReactNode; label: string; color: string }> = {
  completed: {
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    label: "Completed",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  abandoned: {
    icon: <XCircle className="w-4 h-4 text-destructive" />,
    label: "Abandoned",
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  "in-progress": {
    icon: <Pause className="w-4 h-4 text-amber-500" />,
    label: "In Progress",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
};

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function SessionsPage() {
  const solvedCount = sessions.filter((s) => s.status === "completed").length;
  const totalMessages = sessions.reduce((acc, s) => acc + s.messages, 0);

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">AI Sessions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review past practice sessions and AI-guided problem solving.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-3">
          {[
            { v: String(sessions.length), l: "sessions" },
            { v: String(solvedCount), l: "solved" },
            { v: String(totalMessages), l: "messages" },
            { v: "12m", l: "avg time" },
          ].map((s) => (
            <div key={s.l} className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-foreground tabular-nums font-mono">{s.v}</span>
              <span className="text-[10px] text-muted-foreground/60">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {sessions.map((session) => {
          const status = statusConfig[session.status];
          return (
            <Card key={session.id} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">{status.icon}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{session.problem}</span>
                        <Badge variant="outline" className={`text-[10px] ${difficultyColor[session.difficulty]}`}>
                          {session.difficulty}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${status.color}`}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{session.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 text-xs text-muted-foreground">
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">
                      {session.topic}
                    </span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <MessageSquare className="w-3 h-3" />
                      {session.messages}
                    </span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {session.duration}
                    </span>
                    <span className="text-muted-foreground/50">{session.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
