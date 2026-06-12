"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus, X, Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  createInterview,
  searchProblems,
  type ProblemBrief,
} from "@/lib/api/interviews";

const TIME_OPTIONS = [30, 45, 60, 90, 120];
const STACK_OPTIONS = ["", "python", "django", "fastapi", "sql", "go"];
const TYPE_OPTIONS = ["", "write_code", "fix_code", "refactor", "mcq"];
const DIFFICULTY_OPTIONS = ["", "easy", "medium", "hard"];

const TYPE_LABELS: Record<string, string> = {
  write_code: "Write Code",
  fix_code: "Fix the Code",
  refactor: "Refactor",
  mcq: "MCQ",
};

const DIFF_COLORS: Record<string, string> = {
  easy: "text-difficulty-easy",
  medium: "text-difficulty-medium",
  hard: "text-difficulty-hard",
};

export default function NewInterviewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [timeLimit, setTimeLimit] = useState(90);
  const [selectedProblems, setSelectedProblems] = useState<ProblemBrief[]>([]);

  const [q, setQ] = useState("");
  const [stack, setStack] = useState("");
  const [problemType, setProblemType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ["problem-search", q, stack, problemType, difficulty],
    queryFn: () => searchProblems({ q, stack, problem_type: problemType, difficulty }),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: createInterview,
    onSuccess: (iv) => router.push(`/interviews/${iv.id}`),
  });

  const toggleProblem = useCallback((p: ProblemBrief) => {
    setSelectedProblems((prev) => {
      const exists = prev.find((s) => s.id === p.id);
      if (exists) return prev.filter((s) => s.id !== p.id);
      if (prev.length >= 10) return prev;
      return [...prev, p];
    });
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || selectedProblems.length === 0) return;
    createMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      role: role.trim(),
      problem_ids: selectedProblems.map((p) => p.id),
      time_limit_minutes: timeLimit,
    });
  };

  const unselectedResults = searchResults.filter(
    (p) => !selectedProblems.find((s) => s.id === p.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/interviews" className="text-muted-foreground hover:text-foreground transition-all duration-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">New Interview</h1>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: settings */}
        <div className="col-span-2 space-y-5">
          <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Details</p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Python Engineer Screen"
                className="w-full text-[13px] bg-background border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Python Backend Engineer"
                className="w-full text-[13px] bg-background border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional context shown to candidates before they start."
                rows={3}
                className="w-full text-[13px] bg-background border border-border/60 rounded-lg px-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none transition-all duration-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Time limit</label>
              <div className="flex gap-2 flex-wrap">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeLimit(t)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border cursor-pointer transition-all duration-500 ${
                      timeLimit === t
                        ? "bg-primary/8 border-primary/30 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected problems */}
          <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Selected problems
              </p>
              <span className="text-[11px] text-muted-foreground">{selectedProblems.length}/10</span>
            </div>

            {selectedProblems.length === 0 ? (
              <p className="text-[12px] text-muted-foreground/50 py-3 text-center">
                Pick problems from the bank →
              </p>
            ) : (
              <div className="space-y-1.5">
                {selectedProblems.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50"
                  >
                    <span className="text-[10px] text-muted-foreground/50 font-mono w-4">{i + 1}</span>
                    <span className="flex-1 text-[12px] font-medium truncate">{p.title}</span>
                    <span className={`text-[10px] font-medium ${DIFF_COLORS[p.difficulty] ?? ""}`}>
                      {p.difficulty}
                    </span>
                    <button
                      onClick={() => toggleProblem(p)}
                      className="text-muted-foreground/50 hover:text-destructive cursor-pointer transition-all duration-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!title.trim() || selectedProblems.length === 0 || createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-500"
          >
            {createMutation.isPending ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating…</>
            ) : (
              "Create Interview"
            )}
          </motion.button>
        </div>

        {/* Right: problem bank */}
        <div className="col-span-3 bg-card border border-border/60 rounded-2xl p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Problem bank
          </p>

          {/* Search + filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title or concept…"
                className="w-full text-[12px] bg-background border border-border/60 rounded-lg pl-8 pr-3 py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-500"
              />
            </div>
            <div className="flex gap-2">
              <FilterSelect value={stack} onChange={setStack} options={STACK_OPTIONS} placeholder="Stack" />
              <FilterSelect value={problemType} onChange={setProblemType} options={TYPE_OPTIONS} placeholder="Type" labels={TYPE_LABELS} />
              <FilterSelect value={difficulty} onChange={setDifficulty} options={DIFFICULTY_OPTIONS} placeholder="Difficulty" />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            {isFetching && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isFetching && unselectedResults.length === 0 && (
              <p className="text-[12px] text-muted-foreground/50 text-center py-8">No problems found</p>
            )}
            {unselectedResults.map((p) => (
              <ProblemRow
                key={p.id}
                problem={p}
                selected={false}
                onToggle={() => toggleProblem(p)}
                disabled={selectedProblems.length >= 10}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemRow({
  problem,
  selected,
  onToggle,
  disabled,
}: {
  problem: ProblemBrief;
  selected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled && !selected}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left cursor-pointer transition-all duration-500 group ${
        selected
          ? "bg-primary/8 border border-primary/20"
          : "hover:bg-muted/60 border border-transparent"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-500 ${
          selected ? "bg-primary border-primary" : "border-border/60 group-hover:border-border"
        }`}
      >
        {selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-foreground truncate">{problem.title}</p>
        <p className="text-[10px] text-muted-foreground truncate">
          {problem.path_title ?? problem.stack} · {problem.concept}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          {TYPE_LABELS[problem.type] ?? problem.type}
        </span>
        <span className={`text-[10px] font-semibold ${DIFF_COLORS[problem.difficulty] ?? ""}`}>
          {problem.difficulty}
        </span>
      </div>
    </button>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  labels,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  labels?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 text-[11px] bg-background border border-border/60 rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer transition-all duration-500"
    >
      <option value="">{placeholder}</option>
      {options.filter(Boolean).map((o) => (
        <option key={o} value={o}>
          {labels?.[o] ?? o}
        </option>
      ))}
    </select>
  );
}
