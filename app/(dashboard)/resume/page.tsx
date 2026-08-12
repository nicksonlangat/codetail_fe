"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Mail, Briefcase, Download, Share2,
  Edit3, GitFork, Link2, CheckCircle2, Upload,
  FileText, WandSparkles, AlertCircle, ArrowRight,
  ChevronDown, ChevronRight, Plus, Trash2, X, Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import {
  getResume, uploadResume, updateResume, getAIAssist,
  getResumeAnalysis, runResumeAnalysis,
  type ResumeData, type ResumeExperience, type ResumeEducation, type ResumeSkillGroup, type ResumeAnalysis, type ResumeProject,
} from "@/lib/api/resume";
import {
  getGitHubRepos, importGitHubRepos, disconnectGitHub,
  type GitHubRepo, type ImportedProject,
} from "@/lib/api/github";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const GITHUB_APP_INSTALL_URL = "https://github.com/apps/codetail-app/installations/new";

function ensureHttps(value: string): string {
  const v = value.trim();
  if (!v) return "";
  const withProtocol = v.startsWith("http://") || v.startsWith("https://") ? v : `https://${v}`;
  try {
    const { hostname } = new URL(withProtocol);
    if (!hostname.includes(".")) return "";
    return withProtocol;
  } catch {
    return "";
  }
}

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const TABS = ["CV", "Editor", "Analysis", "Templates", "Skills", "Settings"];

const PERSONAL_INFO = [
  { label: "Location", value: "Nairobi, Kenya", icon: MapPin },
  { label: "Email", value: "nick@impactafrica.network", icon: Mail },
  { label: "GitHub", value: "github.com/nicksonlangat", icon: GitFork },
  { label: "LinkedIn", value: "linkedin.com/in/nickson", icon: Link2 },
  { label: "Experience", value: "3 Years", icon: Briefcase },
];

const PREFERENCES = [
  { label: "Preferred Roles", value: "Backend Engineer · Python Dev" },
  { label: "Work Type", value: "Remote · On-site" },
  { label: "Status", value: "Open to opportunities" },
];

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="size-3.5 text-brand-text-subtle mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-brand-text-subtle uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-[12px] text-brand-text font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

const PREMIUM_FEATURES = [
  ["PDF parsing", "Export to PDF"],
  ["Structured sections", "Everything in Pro"],
];

function PremiumGate() {
  return (
    <div className="flex-1 flex items-center justify-center py-16">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="border border-brand-border rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-brand-primary/8 to-brand-primary/3 px-8 pt-8 pb-7 border-b border-brand-border">
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md tracking-wide">
                <WandSparkles className="size-3" />
                PREMIUM
              </span>
            </div>
            <h2 className="text-[26px] font-bold text-brand-text leading-tight tracking-tight mb-3">
              Your resume,<br />restructured.
            </h2>
            <p className="text-[13px] text-brand-text-muted leading-relaxed max-w-sm">
              Upload a PDF. AI reads every section and produces clean, structured output: experience, skills, education. Ready to ship.
            </p>
          </div>

          {/* Pricing + CTA */}
          <div className="px-8 py-5 flex items-center justify-between border-b border-brand-border">
            <div>
              <span className="text-2xl font-bold text-brand-text">$20</span>
              <span className="text-sm text-brand-text-muted ml-1">/ month</span>
            </div>
            <motion.button
              transition={SP}
              className="px-5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold cursor-pointer hover:bg-brand-primary-hover transition-all duration-500 flex items-center gap-2"
            >
              Upgrade
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </motion.button>
          </div>

          {/* Features */}
          <div className="px-8 py-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {PREMIUM_FEATURES.flat().map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-3.5 text-brand-primary shrink-0" />
                  <span className="text-[13px] text-brand-text">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sub-note */}
        <p className="text-center text-[11px] text-brand-text-subtle mt-4">
          Cancel anytime. No commitment.
        </p>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

function ShimmerBar({ className = "", delay = 0, style }: { className?: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <div className={`rounded bg-gray-200 overflow-hidden relative ${className}`} style={style}>
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.65) 50%, transparent 80%)" }}
        animate={{ x: ["-100%", "150%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay }}
      />
    </div>
  );
}

function ResumeDocSkeleton() {
  return (
    <div className="rounded-xl bg-white p-10">
      {/* Name */}
      <Skeleton className="h-7 w-56 mb-2" />
      <Skeleton className="h-3.5 w-80 mb-8" />

      {/* Profile */}
      <div className="mb-7">
        <Skeleton className="h-2.5 w-16 mb-3" />
        <div className="border-b border-gray-100 mb-3" />
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-full mb-1.5" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Skills */}
      <div className="mb-7">
        <Skeleton className="h-2.5 w-12 mb-3" />
        <div className="border-b border-gray-100 mb-3" />
        <div className="space-y-2.5">
          {[["w-20", "w-48"], ["w-24", "w-64"], ["w-16", "w-56"]].map(([l, r], i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className={`h-3 ${l} shrink-0`} />
              <Skeleton className={`h-3 ${r}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-7">
        <Skeleton className="h-2.5 w-20 mb-3" />
        <div className="border-b border-gray-100 mb-4" />
        <div className="space-y-6">
          {[4, 3].map((lines, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <div>
                  <Skeleton className="h-3.5 w-40 mb-1.5" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-3 w-28 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-1.5 mt-2">
                {Array.from({ length: lines }).map((_, j) => (
                  <Skeleton key={j} className={`h-3 ${j === lines - 1 ? "w-2/3" : "w-full"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <Skeleton className="h-2.5 w-16 mb-3" />
        <div className="border-b border-gray-100 mb-3" />
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-3.5 w-44 mb-1.5" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function UploadPrompt({ onUpload }: { onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SP}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-brand-surface flex items-center justify-center">
            <FileText className="size-4 text-brand-text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-text-muted">No resume uploaded</p>
            <p className="text-[11px] text-brand-text-subtle">Upload a PDF to get started</p>
          </div>
        </div>
        <motion.button
                   onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-medium bg-brand-text text-white rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-text/90 transition-all duration-500"
        >
          <Upload className="size-3" /> Upload PDF
        </motion.button>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleChange} />
      </div>

      {/* Skeleton preview */}
      <div className="relative border border-brand-border rounded-xl overflow-hidden">
        <ResumeDocSkeleton />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
          <WandSparkles className="size-6 text-brand-primary mb-2" />
          <p className="text-sm font-semibold text-brand-text">Your resume will appear here</p>
          <p className="text-[11px] text-brand-text-muted mt-1">AI parses every section automatically</p>
        </div>
      </div>
    </motion.div>
  );
}

function ParsedDocument({ resume, onUpload, onEdit }: { resume: ResumeData; onUpload: (file: File) => void; onEdit: () => void }) {
  const replaceRef = useRef<HTMLInputElement>(null);
  const name = resume.file_name.replace(/\.pdf$/i, "").replace(/-/g, " ");
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SP}>
      {/* Doc header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-brand-surface flex items-center justify-center">
            <FileText className="size-4 text-brand-text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-text">{resume.file_name}</p>
            <p className="text-[11px] text-brand-text-subtle">
              Parsed {new Date(resume.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
                       onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium bg-brand-text text-white rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-text/90 transition-all duration-500"
          >
            <Edit3 className="size-3" /> Edit
          </motion.button>
          <motion.button
                       onClick={() => replaceRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-medium border border-brand-border rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-surface transition-all duration-500 text-brand-text"
          >
            <Upload className="size-3" /> Replace
          </motion.button>
          <motion.button
                       className="flex items-center gap-1.5 text-xs font-medium border border-brand-border rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-surface transition-all duration-500 text-brand-text"
          >
            <Download className="size-3" /> Download
          </motion.button>
          <input
            ref={replaceRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
          />
        </div>
      </div>

      {/* CV document */}
      <div className="border border-brand-border rounded-xl bg-white p-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 capitalize">{name}</h1>

        {(resume.location || resume.email || resume.phone || resume.website || resume.linkedin || resume.github) && (
          <p className="text-[11px] text-gray-500 mb-5 flex flex-wrap gap-x-2 gap-y-0.5">
            {[resume.location, resume.email, resume.phone, resume.website, resume.linkedin, resume.github]
              .filter(Boolean)
              .map((v, i) => <span key={i}>{v}</span>)
              .reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`sep-${i}`} className="text-gray-300">·</span>, el], [])}
          </p>
        )}

        {resume.profile && (
          <div className="mb-7">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 pb-1 border-b border-gray-100">Profile</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{resume.profile}</p>
          </div>
        )}

        {resume.skills.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-100">Skills</h2>
            <div className="space-y-2">
              {resume.skills.map((s, i) => (
                <div key={i} className="flex gap-2 items-baseline">
                  <span className="text-[11px] font-semibold text-gray-500 w-24 shrink-0">{s.category}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((item) => (
                      <span key={item} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.experience.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 pb-1 border-b border-gray-100">Experience</h2>
            <div className="space-y-6">
              {resume.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                      <p className="text-[12px] text-gray-500">{exp.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-gray-400">{exp.period}</p>
                      {exp.duration && <p className="text-[11px] text-gray-400">{exp.duration}</p>}
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-[12px] text-gray-600 leading-relaxed">
                        <span className="mt-1.5 size-1 rounded-full bg-gray-300 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.education.length > 0 && (
          <div className="mb-7">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-100">Education</h2>
            <div className="space-y-3">
              {resume.education.map((e, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{e.degree}</p>
                    <p className="text-[12px] text-gray-500">{e.school}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 shrink-0">{e.period}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-100">Projects</h2>
            <div className="space-y-3">
              {resume.projects.map((p, i) => (
                <div key={i}>
                  <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{p.name}</p>
                    {p.tech && <p className="text-[11px] text-gray-400">{p.tech}</p>}
                    <div className="flex items-center gap-2 ml-auto">
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">GitHub</a>
                      )}
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">Live</a>
                      )}
                    </div>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ParsingState() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SP}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            className="size-8 rounded-lg bg-brand-primary/10 flex items-center justify-center"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <WandSparkles className="size-4 text-brand-primary" />
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-brand-text">Parsing your resume</p>
            <p className="text-[11px] text-brand-text-subtle">AI is reading and structuring your CV</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1.5 rounded-full bg-brand-primary"
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
        </div>
      </div>

      {/* Animated card */}
      <div className="border border-brand-border rounded-xl overflow-hidden">
        <div className="bg-white p-10">
          <ShimmerBar className="h-7 w-56 mb-2" delay={0} />
          <ShimmerBar className="h-3.5 w-80 mb-8" delay={0.1} />

          <div className="mb-7">
            <ShimmerBar className="h-2.5 w-16 mb-3" delay={0.15} />
            <div className="border-b border-gray-100 mb-3" />
            <ShimmerBar className="h-3 w-full mb-1.5" delay={0.2} />
            <ShimmerBar className="h-3 w-full mb-1.5" delay={0.3} />
            <ShimmerBar className="h-3 w-3/4" delay={0.4} />
          </div>

          <div className="mb-7">
            <ShimmerBar className="h-2.5 w-12 mb-3" delay={0.45} />
            <div className="border-b border-gray-100 mb-3" />
            <div className="space-y-2.5">
              {([["w-20", "w-48", 0.5], ["w-24", "w-64", 0.6], ["w-16", "w-56", 0.7]] as [string, string, number][]).map(([l, r, d], i) => (
                <div key={i} className="flex gap-4 items-center">
                  <ShimmerBar className={`h-3 ${l} shrink-0`} delay={d} />
                  <ShimmerBar className={`h-3 ${r}`} delay={d + 0.05} />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-7">
            <ShimmerBar className="h-2.5 w-20 mb-3" delay={0.75} />
            <div className="border-b border-gray-100 mb-4" />
            <div className="space-y-6">
              {([4, 3] as number[]).map((lines, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <ShimmerBar className="h-3.5 w-40 mb-1.5" delay={0.8 + i * 0.15} />
                      <ShimmerBar className="h-3 w-28" delay={0.85 + i * 0.15} />
                    </div>
                    <div className="text-right">
                      <ShimmerBar className="h-3 w-28 mb-1" delay={0.9 + i * 0.15} />
                      <ShimmerBar className="h-3 w-16" delay={0.95 + i * 0.15} />
                    </div>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    {Array.from({ length: lines }).map((_, j) => (
                      <ShimmerBar key={j} className={`h-3 ${j === lines - 1 ? "w-2/3" : "w-full"}`} delay={1.0 + i * 0.15 + j * 0.05} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <ShimmerBar className="h-2.5 w-16 mb-3" delay={1.35} />
            <div className="border-b border-gray-100 mb-3" />
            <div className="flex justify-between">
              <div>
                <ShimmerBar className="h-3.5 w-44 mb-1.5" delay={1.4} />
                <ShimmerBar className="h-3 w-32" delay={1.45} />
              </div>
              <ShimmerBar className="h-3 w-20" delay={1.5} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function useCountUp(to: number, duration = 1.2, delay = 0.15) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts + delay * 1000;
      const elapsed = Math.max(0, ts - start);
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay]);
  return value;
}

function scoreTheme(score: number) {
  if (score >= 80) return { stroke: "#22c55e", bar: "bg-green-500", badge: "bg-green-50 text-green-700 border-green-200", label: "Strong" };
  if (score >= 65) return { stroke: "#f59e0b", bar: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Fair" };
  return { stroke: "#ef4444", bar: "bg-red-500", badge: "bg-red-50 text-red-600 border-red-200", label: "Needs work" };
}

function dimColor(v: number) {
  if (v >= 80) return "bg-green-500";
  if (v >= 65) return "bg-amber-400";
  return "bg-red-400";
}

function ScoreRing({ score }: { score: number }) {
  const R = 68;
  const CIRC = 2 * Math.PI * R;
  const theme = scoreTheme(score);
  const displayed = useCountUp(score);

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: 168, height: 168 }}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 168 168">
        <circle cx="84" cy="84" r={R} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <motion.circle
          cx="84" cy="84" r={R}
          fill="none"
          stroke={theme.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-4xl font-bold text-brand-text leading-none tabular-nums">{displayed}</p>
        <p className="text-[11px] text-brand-text-subtle mt-1 font-medium">/ 100</p>
        <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.badge}`}>
          {theme.label}
        </span>
      </div>
    </div>
  );
}

function DimensionBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const displayed = useCountUp(value, 0.8, delay);
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-brand-text-muted w-20 shrink-0 capitalize">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${dimColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
      <span className="text-[11px] font-semibold text-brand-text w-6 text-right tabular-nums">{displayed}</span>
    </div>
  );
}

const DIMENSION_LABELS: Record<string, string> = {
  keywords: "Keywords",
  experience: "Experience",
  format: "Format",
  impact: "Impact",
};

function AnalysisLoading() {
  return (
    <div className="space-y-4">
      <div className="border border-brand-border rounded-2xl p-8 flex items-center gap-10">
        <div className="size-[168px] rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 space-y-3">
          <ShimmerBar className="h-2.5 w-32 mb-5" delay={0} />
          {[0.1, 0.2, 0.3, 0.4].map((d) => (
            <div key={d} className="flex items-center gap-3">
              <ShimmerBar className="h-2.5 w-20 shrink-0" delay={d} />
              <ShimmerBar className="h-1.5 flex-1" delay={d + 0.05} />
              <ShimmerBar className="h-2.5 w-6" delay={d + 0.08} />
            </div>
          ))}
          <ShimmerBar className="h-3.5 w-full mt-4" delay={0.5} />
          <ShimmerBar className="h-3.5 w-4/5" delay={0.55} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[0.6, 0.75].map((d) => (
          <div key={d} className="border border-brand-border rounded-xl p-6">
            <ShimmerBar className="h-2.5 w-20 mb-5" delay={d} />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="flex gap-3 py-3.5 border-b border-brand-border last:border-0">
                <ShimmerBar className="h-3 w-5 shrink-0" delay={d + j * 0.06} />
                <ShimmerBar className={`h-3 ${j % 2 === 0 ? "w-full" : "w-4/5"}`} delay={d + j * 0.06 + 0.03} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="border border-brand-border rounded-xl p-6">
        <ShimmerBar className="h-2.5 w-28 mb-5" delay={0.9} />
        {[0, 1, 2].map((j) => (
          <div key={j} className="flex gap-4 py-3.5 border-b border-brand-border last:border-0">
            <ShimmerBar className="size-5 rounded-full shrink-0" delay={0.95 + j * 0.06} />
            <ShimmerBar className={`h-3 ${j % 2 === 0 ? "w-full" : "w-5/6"}`} delay={0.95 + j * 0.06 + 0.03} />
          </div>
        ))}
      </div>
      <div className="border border-brand-border rounded-xl p-6">
        <ShimmerBar className="h-2.5 w-36 mb-4" delay={1.1} />
        <div className="flex flex-wrap gap-2">
          {([72, 88, 64, 96, 80, 72, 88] as number[]).map((w, i) => (
            <ShimmerBar key={i} className="h-7 rounded-lg" style={{ width: w }} delay={1.15 + i * 0.04} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisResults({ data, onReanalyse, reanalysing }: { data: ResumeAnalysis; onReanalyse: () => void; reanalysing: boolean }) {
  const [copiedKw, setCopiedKw] = React.useState<string | null>(null);

  function copyKeyword(k: string) {
    navigator.clipboard.writeText(k).catch(() => {});
    setCopiedKw(k);
    setTimeout(() => setCopiedKw(null), 1600);
  }

  const dimEntries = Object.entries(data.dimensions ?? {}) as [keyof typeof DIMENSION_LABELS, number][];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Hero card */}
      <div className="border border-brand-border rounded-2xl overflow-hidden">
        <div className="flex items-stretch">
          {/* Score column */}
          <div className="flex flex-col items-center justify-center px-10 py-8 bg-brand-surface border-r border-brand-border shrink-0">
            <ScoreRing score={data.score} />
          </div>

          {/* Dimensions + summary column */}
          <div className="flex-1 px-8 py-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-semibold text-brand-text-subtle uppercase tracking-widest">ATS Compatibility</p>
                <motion.button
                                   onClick={onReanalyse}
                  disabled={reanalysing}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-brand-text-muted border border-brand-border rounded-lg px-2.5 py-1 cursor-pointer hover:bg-white hover:text-brand-text transition-all duration-500 disabled:opacity-40"
                >
                  <WandSparkles className={`size-3 ${reanalysing ? "animate-pulse" : ""}`} />
                  {reanalysing ? "Running..." : "Re-analyse"}
                </motion.button>
              </div>
              <div className="space-y-3 mb-6">
                {dimEntries.map(([key, val], i) => (
                  <DimensionBar
                    key={key}
                    label={DIMENSION_LABELS[key] ?? key}
                    value={val}
                    delay={0.3 + i * 0.1}
                  />
                ))}
              </div>
            </div>
            <p className="text-[12.5px] text-brand-text-muted leading-relaxed border-t border-brand-border pt-4">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-2 gap-4">
        {([
          { title: "Strengths", items: data.strengths, labelCls: "text-green-600", numCls: "text-green-400" },
          { title: "Weaknesses", items: data.weaknesses, labelCls: "text-amber-600", numCls: "text-amber-400" },
        ] as const).map(({ title, items, labelCls, numCls }) => (
          <div key={title} className="border border-brand-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className={`text-[11px] font-semibold uppercase tracking-widest ${labelCls}`}>{title}</p>
              <span className="text-[10px] text-brand-text-subtle">{items.length} items</span>
            </div>
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...SP, delay: 0.45 + i * 0.07 }}
                className="flex items-start gap-3 py-3 border-b border-brand-border last:border-0"
              >
                <span className={`text-[10px] font-bold font-mono w-4 shrink-0 mt-0.5 ${numCls}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[12.5px] text-brand-text leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Action items */}
      <div className="border border-brand-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-primary">Action Items</p>
          <span className="text-[10px] text-brand-text-subtle">{data.suggestions.length} steps</span>
        </div>
        {data.suggestions.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SP, delay: 0.5 + i * 0.08 }}
            className="flex items-start gap-4 py-3.5 border-b border-brand-border last:border-0"
          >
            <div className="size-5 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[9px] font-bold text-brand-primary">{i + 1}</span>
            </div>
            <p className="text-[12.5px] text-brand-text leading-relaxed">{item}</p>
          </motion.div>
        ))}
      </div>

      {/* Keywords */}
      <div className="border border-brand-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-text">Missing Keywords</p>
          <p className="text-[10px] text-brand-text-subtle">Click any to copy</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.keywords.map((k, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SP, delay: 0.55 + i * 0.05 }}
              onClick={() => copyKeyword(k)}
              className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all duration-500 ${
                copiedKw === k
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-brand-primary/5 text-brand-primary border-brand-primary/15 hover:bg-brand-primary/10 hover:border-brand-primary/30"
              }`}
            >
              {copiedKw === k
                ? <CheckCircle2 className="size-3" />
                : <ArrowRight className="size-3 rotate-[-45deg]" />
              }
              {k}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AnalysisTab({ resume }: { resume: ResumeData | undefined }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["resume-analysis"],
    queryFn: getResumeAnalysis,
    enabled: !!resume,
    staleTime: Infinity,
    retry: false,
  });

  const { mutate: analyse, isPending: analysing } = useMutation({
    mutationFn: runResumeAnalysis,
    onSuccess: (result) => {
      queryClient.setQueryData(["resume-analysis"], result);
      toast.success("Analysis complete.");
    },
    onError: () => toast.error("Analysis failed. Please try again."),
  });

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="size-12 rounded-xl bg-brand-surface flex items-center justify-center mb-3">
          <WandSparkles className="size-5 text-brand-text-subtle" />
        </div>
        <p className="font-semibold text-brand-text mb-1">No resume to analyse</p>
        <p className="text-sm text-brand-text-muted">Upload your CV on the CV tab first.</p>
      </div>
    );
  }

  if (isLoading) return <AnalysisLoading />;

  if (analysing) return <AnalysisLoading />;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="size-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-3">
          <WandSparkles className="size-5 text-brand-primary" />
        </div>
        <p className="font-semibold text-brand-text mb-1">Ready to analyse</p>
        <p className="text-sm text-brand-text-muted mb-5">AI will score your resume and surface gaps against ATS requirements.</p>
        <motion.button
                   onClick={() => analyse()}
          className="flex items-center gap-2 bg-brand-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg cursor-pointer hover:bg-brand-primary-hover transition-all duration-500"
        >
          <WandSparkles className="size-4" /> Run Analysis
        </motion.button>
      </div>
    );
  }

  return <AnalysisResults data={data} onReanalyse={() => analyse()} reanalysing={analysing} />;
}

// ─── Edit modal primitives ────────────────────────────────────────────────────

const INPUT = "w-full text-[13px] text-brand-text bg-brand-surface border border-transparent rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-500 placeholder:text-brand-text-subtle";
const TA = `${INPUT} resize-none leading-[1.65]`;

function useSharedAI() {
  const [loading, setLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<string | null>(null);
  const [label, setLabel] = React.useState("");
  const acceptRef = React.useRef<((s: string) => void) | null>(null);

  async function trigger(fieldType: string, current: string, context: string, onAccept: (s: string) => void, fieldLabel: string) {
    if (!current.trim()) return;
    setLoading(true);
    setSuggestion(null);
    setLabel(fieldLabel);
    acceptRef.current = onAccept;
    try {
      const r = await getAIAssist(fieldType, current, context);
      setSuggestion(r.suggestion);
    } catch {
      toast.error("AI assist failed.");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading, suggestion, label, trigger,
    accept: () => { if (suggestion && acceptRef.current) acceptRef.current(suggestion); setSuggestion(null); },
    dismiss: () => setSuggestion(null),
  };
}

function AIBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <motion.button type="button"      onClick={onClick} disabled={loading}
      className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-primary bg-brand-primary/[0.08] rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-brand-primary/15 transition-all duration-300 disabled:opacity-40 shrink-0"
    >
      <WandSparkles className={`size-3.5 ${loading ? "animate-pulse" : ""}`} />
      {loading ? "Writing…" : "Improve"}
    </motion.button>
  );
}

function EditSection({ title, badge, defaultOpen = false, children }: {
  title: string; badge?: number; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border border-brand-border rounded-xl overflow-hidden bg-white">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-brand-surface/50 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[13.5px] font-semibold text-brand-text">{title}</span>
          {badge !== undefined && (
            <span className="inline-flex items-center justify-center h-[18px] min-w-[18px] text-[10px] font-semibold text-brand-primary bg-brand-primary/10 rounded-full px-1.5">
              {badge}
            </span>
          )}
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-4 text-brand-text-subtle" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: "hidden" }}
          >
            <div className="border-t border-brand-border p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BulletEditor({ value, context, onChange, onRemove, onAI, aiLoading }: {
  value: string; context: string; onChange: (v: string) => void; onRemove: () => void;
  onAI: () => void; aiLoading: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-end gap-1.5">
        <AIBtn onClick={onAI} loading={aiLoading} />
        <button type="button" onClick={onRemove}
          className="size-[26px] flex items-center justify-center rounded-lg hover:bg-red-50 text-brand-text-subtle hover:text-red-400 cursor-pointer transition-all duration-300"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <textarea rows={2} value={value} onChange={e => onChange(e.target.value)}
        placeholder="Describe an achievement…" className={TA} />
    </div>
  );
}

// ─── Resume editor panel ───────────────────────────────────────────────────────

function ResumeEditorPanel({ resume, onSave, saving }: {
  resume: ResumeData;
  onSave: (d: { profile: string; email: string; phone: string; location: string; website: string; linkedin: string; github: string; experience: ResumeExperience[]; education: ResumeEducation[]; skills: ResumeSkillGroup[]; projects: ResumeProject[] }) => void;
  saving: boolean;
}) {
  const [profile, setProfile] = React.useState(resume.profile);
  const [email, setEmail] = React.useState(resume.email ?? "");
  const [phone, setPhone] = React.useState(resume.phone ?? "");
  const [location, setLocation] = React.useState(resume.location ?? "");
  const [website, setWebsite] = React.useState(resume.website ?? "");
  const [linkedin, setLinkedin] = React.useState(resume.linkedin ?? "");
  const [github, setGithub] = React.useState(resume.github ?? "");
  const [experience, setExperience] = React.useState<ResumeExperience[]>(
    resume.experience.map(e => ({ ...e, bullets: [...e.bullets] }))
  );
  const [education, setEducation] = React.useState<ResumeEducation[]>(resume.education.map(e => ({ ...e })));
  const [skills, setSkills] = React.useState<ResumeSkillGroup[]>(resume.skills.map(s => ({ ...s, items: [...s.items] })));
  const [projects, setProjects] = React.useState<ResumeProject[]>(resume.projects.map(p => ({ ...p })));
  const [openExp, setOpenExp] = React.useState<Set<number>>(new Set([0]));
  const [newSkill, setNewSkill] = React.useState<Record<number, string>>({});

  const ai = useSharedAI();
  const [aiPanelOpen, setAiPanelOpen] = React.useState(false);

  React.useEffect(() => {
    if (ai.suggestion) setAiPanelOpen(true);
  }, [ai.suggestion]);

  const setExp = (i: number, patch: Partial<ResumeExperience>) =>
    setExperience(prev => prev.map((e, j) => j === i ? { ...e, ...patch } : e));
  const setBullet = (ei: number, bi: number, v: string) =>
    setExperience(prev => prev.map((e, i) => i === ei ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? v : b) } : e));
  const removeBullet = (ei: number, bi: number) =>
    setExperience(prev => prev.map((e, i) => i === ei ? { ...e, bullets: e.bullets.filter((_, j) => j !== bi) } : e));
  const addBullet = (ei: number) =>
    setExperience(prev => prev.map((e, i) => i === ei ? { ...e, bullets: [...e.bullets, ""] } : e));
  const setEdu = (i: number, patch: Partial<ResumeEducation>) =>
    setEducation(prev => prev.map((e, j) => j === i ? { ...e, ...patch } : e));
  const setSkillCat = (i: number, category: string) =>
    setSkills(prev => prev.map((s, j) => j === i ? { ...s, category } : s));
  const removeSkillItem = (gi: number, ii: number) =>
    setSkills(prev => prev.map((s, j) => j === gi ? { ...s, items: s.items.filter((_, k) => k !== ii) } : s));
  const addSkillItem = (gi: number) => {
    const v = (newSkill[gi] ?? "").trim();
    if (!v) return;
    setSkills(prev => prev.map((s, j) => j === gi ? { ...s, items: [...s.items, v] } : s));
    setNewSkill(p => ({ ...p, [gi]: "" }));
  };

  return (
    <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <header className="flex items-center gap-2.5 h-[52px] px-5 border-b border-brand-border shrink-0">
          <span className="text-[11px] font-medium text-brand-text-subtle bg-brand-surface rounded-md px-2 py-0.5 shrink-0">
            Resume
          </span>
          <ChevronRight className="size-3.5 text-brand-text-subtle/40 shrink-0" />
          <span className="text-[13px] font-medium text-brand-text truncate">{resume.file_name}</span>
          <div className="flex-1" />
          <button type="button"
            onClick={() => setAiPanelOpen(v => !v)}
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium transition-all duration-300 cursor-pointer mr-1 ${aiPanelOpen ? "bg-brand-primary/10 text-brand-primary" : "text-brand-text-subtle hover:bg-brand-surface hover:text-brand-text"}`}
          >
            <WandSparkles className="size-3.5" />
            AI
            {ai.suggestion && !aiPanelOpen && (
              <span className="size-1.5 rounded-full bg-brand-primary ml-0.5" />
            )}
          </button>
          <div className="w-px h-4 bg-brand-border mx-1" />
          <motion.button
            type="button" onClick={() => onSave({ profile, email, phone, location, website, linkedin, github, experience, education, skills, projects })}
            disabled={saving}
            className="flex items-center gap-1.5 text-[12px] font-semibold bg-brand-primary text-white rounded-lg px-3.5 py-1.5 cursor-pointer hover:bg-brand-primary-hover transition-all duration-300 disabled:opacity-60"
          >
            {saving ? <WandSparkles className="size-3.5 animate-pulse" /> : <Check className="size-3.5" />}
            {saving ? "Saving…" : "Save"}
          </motion.button>
        </header>

        {/* Two-panel body */}
        <div className="flex flex-1 min-h-0">

          {/* Left — form sections */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-7 space-y-3">

              <EditSection title="Contact" defaultOpen>
                <div className="grid grid-cols-2 gap-2">
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={INPUT} />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className={INPUT} />
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" className={INPUT} />
                  <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="yoursite.com" className={INPUT} />
                  <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/you" className={INPUT} />
                  <input value={github} onChange={e => setGithub(e.target.value)} placeholder="github.com/you" className={INPUT} />
                </div>
              </EditSection>

              <EditSection title="Profile" defaultOpen>
                <div className="space-y-3">
                  <textarea rows={4} value={profile} onChange={e => setProfile(e.target.value)}
                    placeholder="Professional summary…" className={TA} />
                  <AIBtn
                    onClick={() => ai.trigger("profile", profile, "", v => setProfile(v), "Profile summary")}
                    loading={ai.loading}
                  />
                </div>
              </EditSection>

              <EditSection title="Experience" badge={experience.length} defaultOpen>
                <div className="space-y-2">
                  {experience.map((exp, ei) => {
                    const isOpen = openExp.has(ei);
                    return (
                      <div key={ei} className="border border-brand-border rounded-xl overflow-hidden">
                        <button type="button"
                          onClick={() => setOpenExp(prev => { const n = new Set(prev); n.has(ei) ? n.delete(ei) : n.add(ei); return n; })}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-surface/50 transition-all duration-300 cursor-pointer text-left"
                        >
                          <div className="size-8 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-[11px] font-bold text-brand-text-subtle shrink-0">
                            {(exp.company || exp.title || "?")[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-brand-text truncate">{exp.title || "Untitled role"}</p>
                            <p className="text-[11px] text-brand-text-subtle">{exp.company}{exp.period ? ` · ${exp.period}` : ""}</p>
                          </div>
                          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="size-3.5 text-brand-text-subtle shrink-0" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                              transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                              style={{ overflow: "hidden" }}
                            >
                              <div className="border-t border-brand-border p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <input value={exp.title} onChange={e => setExp(ei, { title: e.target.value })} placeholder="Job title" className={INPUT} />
                                  <input value={exp.company} onChange={e => setExp(ei, { company: e.target.value })} placeholder="Company" className={INPUT} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <input value={exp.period} onChange={e => setExp(ei, { period: e.target.value })} placeholder="e.g. Jan 2023 – Present" className={INPUT} />
                                  <div className={`${INPUT} text-brand-text-subtle cursor-default select-none`}>{exp.duration || "Duration auto-computed"}</div>
                                </div>
                                <div>
                                  <p className="text-[10.5px] font-semibold text-brand-text-subtle uppercase tracking-widest mb-2.5">Achievements</p>
                                  <div className="space-y-2">
                                    {exp.bullets.map((bullet, bi) => (
                                      <BulletEditor
                                        key={bi}
                                        value={bullet}
                                        context={`${exp.title} at ${exp.company}`}
                                        onChange={v => setBullet(ei, bi, v)}
                                        onRemove={() => removeBullet(ei, bi)}
                                        onAI={() => ai.trigger("bullet", bullet, `${exp.title} at ${exp.company}`, v => setBullet(ei, bi, v), `${exp.title} bullet`)}
                                        aiLoading={ai.loading}
                                      />
                                    ))}
                                  </div>
                                  <button type="button" onClick={() => addBullet(ei)}
                                    className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-brand-primary cursor-pointer hover:underline transition-all duration-300"
                                  >
                                    <Plus className="size-3" /> Add bullet
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </EditSection>

              <EditSection title="Skills" badge={skills.length}>
                <div className="space-y-3">
                  {skills.map((group, gi) => (
                    <div key={gi} className="border border-brand-border rounded-xl p-4 space-y-3">
                      <input value={group.category} onChange={e => setSkillCat(gi, e.target.value)}
                        placeholder="Category name" className={`${INPUT} font-semibold`} />
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item, ii) => (
                          <span key={ii} className="flex items-center gap-1.5 text-[11.5px] font-medium bg-brand-surface border border-brand-border rounded-full px-2.5 py-1 text-brand-text">
                            {item}
                            <button type="button" onClick={() => removeSkillItem(gi, ii)}
                              className="text-brand-text-subtle hover:text-red-400 cursor-pointer transition-all duration-300"
                            >
                              <X className="size-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={newSkill[gi] ?? ""} onChange={e => setNewSkill(p => ({ ...p, [gi]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkillItem(gi))}
                          placeholder="Add skill…" className={INPUT} />
                        <motion.button type="button"                          onClick={() => addSkillItem(gi)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-brand-primary bg-brand-primary/[0.08] rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-primary/15 transition-all duration-300 shrink-0"
                        >
                          <Plus className="size-3" /> Add
                        </motion.button>
                      </div>
                      <AIBtn
                        onClick={() => ai.trigger("skills", group.items.join(", "), group.category, v => {
                          const extras = v.split(",").map(s => s.trim()).filter(Boolean);
                          setSkills(prev => prev.map((s, j) => j === gi ? { ...s, items: [...s.items, ...extras] } : s));
                        }, `${group.category} skills`)}
                        loading={ai.loading}
                      />
                    </div>
                  ))}
                </div>
              </EditSection>

              <EditSection title="Education" badge={education.length}>
                <div className="space-y-2">
                  {education.map((edu, ei) => (
                    <div key={ei} className="border border-brand-border rounded-xl p-4 space-y-2">
                      <input value={edu.degree} onChange={e => setEdu(ei, { degree: e.target.value })} placeholder="Degree / qualification" className={INPUT} />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={edu.school} onChange={e => setEdu(ei, { school: e.target.value })} placeholder="Institution" className={INPUT} />
                        <input value={edu.period} onChange={e => setEdu(ei, { period: e.target.value })} placeholder="e.g. 2012 – 2016" className={INPUT} />
                      </div>
                    </div>
                  ))}
                </div>
              </EditSection>

              <EditSection title="Projects" badge={projects.length}>
                <div className="space-y-2">
                  {projects.map((proj, pi) => (
                    <div key={pi} className="border border-brand-border rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={proj.name}
                          onChange={e => setProjects(prev => prev.map((p, i) => i === pi ? { ...p, name: e.target.value } : p))}
                          placeholder="Project name"
                          className={`${INPUT} font-semibold flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => setProjects(prev => prev.filter((_, i) => i !== pi))}
                          className="size-[30px] flex items-center justify-center rounded-lg hover:bg-red-50 text-brand-text-subtle hover:text-red-400 cursor-pointer transition-all duration-300 shrink-0"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={e => setProjects(prev => prev.map((p, i) => i === pi ? { ...p, description: e.target.value } : p))}
                        placeholder="What it does and its impact…"
                        className={TA}
                      />
                      <input
                        value={proj.tech}
                        onChange={e => setProjects(prev => prev.map((p, i) => i === pi ? { ...p, tech: e.target.value } : p))}
                        placeholder="Tech stack (comma-separated)"
                        className={INPUT}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={proj.github_url ?? ""}
                          onChange={e => setProjects(prev => prev.map((p, i) => i === pi ? { ...p, github_url: e.target.value } : p))}
                          onBlur={e => setProjects(prev => prev.map((p, i) => i === pi ? { ...p, github_url: ensureHttps(e.target.value) } : p))}
                          placeholder="github.com/you/repo"
                          className={INPUT}
                        />
                        <input
                          value={proj.live_url ?? ""}
                          onChange={e => setProjects(prev => prev.map((p, i) => i === pi ? { ...p, live_url: e.target.value } : p))}
                          onBlur={e => setProjects(prev => prev.map((p, i) => i === pi ? { ...p, live_url: ensureHttps(e.target.value) } : p))}
                          placeholder="useclarity.cc"
                          className={INPUT}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProjects(prev => [...prev, { name: "", description: "", tech: "" }])}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-brand-primary cursor-pointer hover:underline transition-all duration-300"
                  >
                    <Plus className="size-3" /> Add project
                  </button>
                </div>
              </EditSection>

            </div>
          </div>

          {/* Right — AI assistant panel */}
          <AnimatePresence>
          {aiPanelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="shrink-0 border-l border-brand-border bg-brand-bg flex flex-col overflow-hidden"
            style={{ minWidth: 0 }}
          >
            <div className="flex items-center gap-3 h-12 px-4 border-b border-brand-border shrink-0">
              <div className="size-7 rounded-lg bg-brand-primary/10 border border-brand-primary/15 text-brand-primary flex items-center justify-center">
                <WandSparkles className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-brand-text leading-none">AI Assistant</p>
                <p className="text-[10px] text-brand-text-subtle mt-[3px]">Click Improve on any field</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {ai.loading && (
                <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:0ms]" />
                    <span className="size-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:100ms]" />
                    <span className="size-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:200ms]" />
                  </div>
                  <p className="text-[12px] text-brand-text-muted">
                    Writing{ai.label ? ` for ${ai.label}` : ""}…
                  </p>
                </div>
              )}

              {!ai.loading && ai.suggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SP}
                  className="rounded-xl border border-brand-primary/20 bg-brand-primary/[0.04] overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-brand-primary/12">
                    <div className="size-1.5 rounded-full bg-brand-primary" />
                    <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider flex-1 truncate">
                      {ai.label || "Suggestion"}
                    </span>
                    <button type="button" onClick={ai.dismiss}
                      className="text-brand-text-subtle hover:text-brand-text cursor-pointer transition-all duration-300"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[12.5px] text-brand-text leading-[1.65]">{ai.suggestion}</p>
                  </div>
                  <div className="px-3 pb-3 pt-2.5 flex gap-2 border-t border-brand-primary/10">
                    <motion.button type="button"                      onClick={ai.accept}
                      className="flex items-center gap-1.5 text-[11px] font-semibold bg-brand-primary text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-brand-primary-hover transition-all duration-300"
                    >
                      <Check className="size-3" /> Accept
                    </motion.button>
                    <motion.button type="button"                      onClick={ai.dismiss}
                      className="text-[11px] font-medium text-brand-text-muted px-3 py-1.5 rounded-lg cursor-pointer hover:bg-brand-surface border border-brand-border transition-all duration-300"
                    >
                      Discard
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {!ai.loading && !ai.suggestion && (
                <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                  <div className="size-10 rounded-xl bg-brand-surface flex items-center justify-center mb-3">
                    <WandSparkles className="size-5 text-brand-text-subtle" />
                  </div>
                  <p className="text-[13px] font-semibold text-brand-text">AI ready</p>
                  <p className="text-[12px] text-brand-text-muted mt-1.5 leading-relaxed">
                    Click <span className="font-semibold text-brand-primary">Improve</span> next to any field to get a rewritten suggestion here.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
          )}
          </AnimatePresence>

        </div>
    </div>
  );
}

// ─── GitHub repo picker modal ─────────────────────────────────────────────────

interface RepoGroup {
  id: string;
  name: string;
  fullNames: string[];
}

function detectGroupName(selectedRepos: GitHubRepo[]): string {
  const words = selectedRepos.map((r) => r.name.replace(/[-_]/g, " ").split(" ")[0].toLowerCase());
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  const top = [...freq.entries()].sort((a, b) => b[1] - a[1])[0];
  const base = top ? top[0] : selectedRepos[0]?.name ?? "Project";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function RepoPickerModal({
  repos,
  loading,
  onClose,
  onImport,
  importing,
  importedProjects,
  onSaveProjects,
  savingProjects,
}: {
  repos: GitHubRepo[];
  loading: boolean;
  onClose: () => void;
  onImport: (repos: import("@/lib/api/github").ImportRepoPayload[]) => void;
  importing: boolean;
  importedProjects: ImportedProject[] | null;
  onSaveProjects: (projects: ResumeProject[]) => void;
  savingProjects: boolean;
}) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [query, setQuery] = React.useState("");
  const [groups, setGroups] = React.useState<RepoGroup[]>([]);
  const [pendingName, setPendingName] = React.useState<string | null>(null);
  const [editableProjects, setEditableProjects] = React.useState<ResumeProject[]>([]);
  const groupCounter = React.useRef(0);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (importedProjects) {
      setEditableProjects(importedProjects.map((p) => ({
        name: p.name,
        description: p.description,
        tech: p.tech,
        github_url: p.github_url || "",
        live_url: "",
      })));
    }
  }, [importedProjects]);

  function setEditableField(i: number, field: keyof ResumeProject, value: string) {
    setEditableProjects((prev) => prev.map((p, j) => j === i ? { ...p, [field]: value } : p));
  }

  React.useEffect(() => {
    if (pendingName !== null) nameInputRef.current?.focus();
  }, [pendingName]);

  const groupedFullNames = new Set(groups.flatMap((g) => g.fullNames));

  const filteredRepos = repos.filter(
    (r) =>
      !groupedFullNames.has(r.full_name) &&
      (r.name.toLowerCase().includes(query.toLowerCase()) ||
        (r.description ?? "").toLowerCase().includes(query.toLowerCase()))
  );

  function toggle(full_name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(full_name) ? next.delete(full_name) : next.add(full_name);
      return next;
    });
  }

  function startMerge() {
    const selectedRepos = repos.filter((r) => selected.has(r.full_name));
    setPendingName(detectGroupName(selectedRepos));
  }

  function confirmGroup() {
    if (!pendingName?.trim()) return;
    groupCounter.current += 1;
    const id = `grp-${groupCounter.current}`;
    setGroups((prev) => [...prev, { id, name: pendingName.trim(), fullNames: [...selected] }]);
    setSelected(new Set());
    setPendingName(null);
  }

  function ungroup(groupId: string) {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  function renameGroup(groupId: string, name: string) {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, name } : g)));
  }

  const totalUnits = groups.length + selected.size;

  function buildPayload() {
    const payload: import("@/lib/api/github").ImportRepoPayload[] = [];
    const pick = (repo: GitHubRepo, group_id: string | null, group_name: string | null, url: string) => ({
      full_name: repo.full_name,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      topics: repo.topics,
      url,
      group_id,
      group_name,
    });
    for (const group of groups) {
      for (const fullName of group.fullNames) {
        const repo = repos.find((r) => r.full_name === fullName);
        if (repo) payload.push(pick(repo, group.id, group.name, repo.url));
      }
    }
    for (const fullName of selected) {
      const repo = repos.find((r) => r.full_name === fullName);
      if (repo) payload.push(pick(repo, null, null, repo.url));
    }
    return payload;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={SP}
        className="relative w-full max-w-lg bg-white rounded-2xl flex flex-col border border-brand-border shadow-2xl shadow-black/10 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-border shrink-0">
          <svg viewBox="0 0 98 96" className="size-6 shrink-0" fill="currentColor" aria-hidden="true" style={{ color: "#1a1a1a" }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-text">Import from GitHub</p>
            <p className="text-[11px] text-brand-text-muted">Select repos. Group related ones into a single project.</p>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-brand-surface text-brand-text-subtle cursor-pointer transition-all duration-300">
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <svg className="animate-spin h-6 w-6 text-brand-primary" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-brand-text-muted">Loading your repos...</p>
            </div>
          )}

          {!loading && !importedProjects && repos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <p className="font-semibold text-brand-text mb-1">No repositories found</p>
              <p className="text-sm text-brand-text-muted">Make sure you granted Codetail access to your repos during setup.</p>
            </div>
          )}

          {!loading && !importedProjects && repos.length > 0 && (
            <>
              {/* Search */}
              <div className="px-4 pt-3 pb-2 border-b border-brand-border">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-brand-text-subtle pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search repos..."
                    className="w-full text-[13px] text-brand-text bg-brand-surface border border-transparent rounded-lg pl-9 pr-3 py-2 outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-500 placeholder:text-brand-text-subtle"
                  />
                </div>
              </div>

              <div className="p-2">
                {/* Group cards */}
                {groups.map((group) => {
                  const groupRepos = repos.filter((r) => group.fullNames.includes(r.full_name));
                  return (
                    <div key={group.id} className="mb-1 border border-brand-primary/25 bg-brand-primary/[0.03] rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-4 rounded bg-brand-primary/15 flex items-center justify-center shrink-0">
                          <Plus className="size-2.5 text-brand-primary rotate-45" />
                        </div>
                        <input
                          value={group.name}
                          onChange={(e) => renameGroup(group.id, e.target.value)}
                          className="flex-1 text-[12px] font-semibold text-brand-primary bg-transparent outline-none border-b border-transparent focus:border-brand-primary/40 transition-all duration-200"
                        />
                        <span className="text-[10px] text-brand-primary/60 shrink-0">{groupRepos.length} repos · 1 project</span>
                        <button onClick={() => ungroup(group.id)} className="text-[10px] text-brand-text-subtle hover:text-red-400 cursor-pointer transition-all duration-200 shrink-0">
                          Ungroup
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {groupRepos.map((r) => (
                          <span key={r.full_name} className="text-[10px] font-medium bg-white border border-brand-primary/20 text-brand-text rounded-full px-2.5 py-1">
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Ungrouped repo list */}
                {filteredRepos.length === 0 && !query && groups.length > 0 && (
                  <p className="text-[12px] text-brand-text-subtle text-center py-6">All repos are grouped.</p>
                )}
                {filteredRepos.length === 0 && query && (
                  <p className="text-sm text-brand-text-muted text-center py-8">No repos match "{query}"</p>
                )}
                {filteredRepos.map((repo) => {
                  const isSelected = selected.has(repo.full_name);
                  return (
                    <button
                      key={repo.full_name}
                      onClick={() => toggle(repo.full_name)}
                      className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-all duration-200 ${
                        isSelected ? "bg-brand-primary/5 border border-brand-primary/20" : "hover:bg-brand-surface border border-transparent"
                      }`}
                    >
                      <div className={`mt-0.5 size-4 rounded border flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isSelected ? "bg-brand-primary border-brand-primary" : "border-gray-300"
                      }`}>
                        {isSelected && <Check className="size-2.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-brand-text truncate">{repo.name}</p>
                        {repo.description && (
                          <p className="text-[11px] text-brand-text-muted leading-relaxed line-clamp-2 mt-0.5">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5">
                          {repo.language && <span className="text-[10px] text-brand-text-subtle font-medium">{repo.language}</span>}
                          {repo.topics.slice(0, 3).map((t) => (
                            <span key={t} className="text-[10px] bg-brand-surface border border-brand-border rounded-full px-2 py-0.5 text-brand-text-subtle">{t}</span>
                          ))}
                          <span className="text-[10px] text-brand-text-subtle ml-auto">{repo.stars > 0 && `★ ${repo.stars}`}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {!loading && importedProjects && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 pb-1">
                <div className="size-5 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
                  <Check className="size-3 text-white stroke-[3]" />
                </div>
                <p className="text-sm font-semibold text-brand-text">
                  {editableProjects.length} project{editableProjects.length !== 1 ? "s" : ""} formatted — review and save
                </p>
              </div>
              {editableProjects.map((p, i) => (
                <div key={i} className="border border-brand-border rounded-xl p-4 space-y-2">
                  <input
                    value={p.name}
                    onChange={(e) => setEditableField(i, "name", e.target.value)}
                    placeholder="Project name"
                    className="w-full text-[13px] font-semibold text-brand-text bg-brand-surface border border-transparent rounded-lg px-3 py-1.5 outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-300 placeholder:text-brand-text-subtle"
                  />
                  <textarea
                    rows={4}
                    value={p.description}
                    onChange={(e) => setEditableField(i, "description", e.target.value)}
                    placeholder="Description"
                    className="w-full text-[12px] text-brand-text bg-brand-surface border border-transparent rounded-lg px-3 py-1.5 outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-300 resize-none leading-relaxed placeholder:text-brand-text-subtle"
                  />
                  <input
                    value={p.tech}
                    onChange={(e) => setEditableField(i, "tech", e.target.value)}
                    placeholder="Tech stack (comma-separated)"
                    className="w-full text-[12px] text-brand-text bg-brand-surface border border-transparent rounded-lg px-3 py-1.5 outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-300 placeholder:text-brand-text-subtle"
                  />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <p className="text-[9px] font-semibold text-brand-text-subtle uppercase tracking-wide mb-1">GitHub URL</p>
                      <div className="w-full text-[11px] bg-brand-surface rounded-lg px-2.5 py-1.5 truncate">
                        {p.github_url ? (
                          <a
                            href={p.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-primary hover:underline"
                          >
                            {p.github_url.replace("https://github.com/", "")}
                          </a>
                        ) : (
                          <span className="text-brand-text-subtle">No URL</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-brand-text-subtle uppercase tracking-wide mb-1">Live URL</p>
                      <input
                        value={p.live_url ?? ""}
                        onChange={(e) => setEditableField(i, "live_url", e.target.value)}
                        onBlur={(e) => setEditableField(i, "live_url", ensureHttps(e.target.value))}
                        placeholder="useclarity.cc"
                        className="w-full text-[11px] text-brand-text bg-brand-surface border border-transparent rounded-lg px-2.5 py-1.5 outline-none focus:bg-white focus:border-brand-primary/60 transition-all duration-300 placeholder:text-brand-text-subtle"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Merge name input bar */}
        <AnimatePresence>
          {pendingName !== null && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-t border-brand-border shrink-0"
            >
              <div className="flex items-center gap-2 px-4 py-3 bg-brand-surface">
                <span className="text-[11px] text-brand-text-muted shrink-0">Group name:</span>
                <input
                  ref={nameInputRef}
                  value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") confirmGroup(); if (e.key === "Escape") setPendingName(null); }}
                  className="flex-1 text-[13px] text-brand-text bg-white border border-brand-primary/40 rounded-lg px-3 py-1.5 outline-none focus:border-brand-primary/60 transition-all duration-200"
                />
                <button onClick={confirmGroup} className="text-[11px] font-semibold text-white bg-brand-primary rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-primary-hover transition-all duration-200 shrink-0">
                  Create group
                </button>
                <button onClick={() => setPendingName(null)} className="text-[11px] text-brand-text-subtle cursor-pointer hover:text-brand-text transition-all duration-200 shrink-0">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!loading && !importedProjects && repos.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-brand-border shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {selected.size >= 2 && pendingName === null && (
                <motion.button
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                  onClick={startMerge}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-primary border border-brand-primary/30 bg-brand-primary/5 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-primary/10 transition-all duration-200 shrink-0"
                >
                  <Plus className="size-3" /> Merge {selected.size} into one
                </motion.button>
              )}
              {totalUnits === 0 && (
                <p className="text-[12px] text-brand-text-muted">Select repos to import</p>
              )}
              {totalUnits > 0 && pendingName === null && (
                <p className="text-[12px] text-brand-text-muted">
                  {totalUnits} project{totalUnits !== 1 ? "s" : ""}
                  {groups.length > 0 && ` (${groups.length} grouped)`}
                </p>
              )}
            </div>
            <motion.button
              onClick={() => onImport(buildPayload())}
              disabled={totalUnits === 0 || importing || totalUnits > 8}
              className="flex items-center gap-2 bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-primary-hover transition-all duration-500 disabled:opacity-40 shrink-0"
            >
              {importing ? (
                <><WandSparkles className="size-3.5 animate-pulse" /> Formatting...</>
              ) : (
                <><WandSparkles className="size-3.5" /> Import with AI</>
              )}
            </motion.button>
          </div>
        )}

        {importedProjects && (
          <div className="flex items-center gap-3 px-5 py-4 border-t border-brand-border shrink-0">
            <button
              onClick={onClose}
              className="text-[12px] font-medium text-brand-text-muted border border-brand-border rounded-lg px-4 py-2 cursor-pointer hover:bg-brand-surface transition-all duration-300 shrink-0"
            >
              Discard
            </button>
            <motion.button
              onClick={() => onSaveProjects(editableProjects)}
              disabled={savingProjects || editableProjects.length === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white text-sm font-semibold rounded-lg py-2 cursor-pointer hover:bg-brand-primary-hover transition-all duration-500 disabled:opacity-40"
            >
              {savingProjects ? (
                <><WandSparkles className="size-3.5 animate-pulse" /> Saving...</>
              ) : (
                <><Upload className="size-3.5" /> Save {editableProjects.length} project{editableProjects.length !== 1 ? "s" : ""} to resume</>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── GitHub sidebar section ───────────────────────────────────────────────────

function GitHubSection({
  connected,
  repoCount,
  repositorySelection,
  installationId,
  onOpenPicker,
  onDisconnect,
}: {
  connected: boolean;
  repoCount: number;
  repositorySelection: "all" | "selected" | null;
  installationId: string | null;
  onOpenPicker: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="border border-brand-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="size-6 rounded-md bg-gray-900 flex items-center justify-center shrink-0">
          <GitFork className="size-3.5 text-white" />
        </div>
        <p className="text-[11px] font-semibold text-brand-text uppercase tracking-wide flex-1">GitHub</p>
        {connected && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-md">
            <span className="size-1.5 rounded-full bg-green-500" />
            Connected
          </span>
        )}
      </div>

      {connected ? (
        <div className="space-y-2">
          <p className="text-[11px] text-brand-text-muted">
            {repoCount > 0 ? `${repoCount} repo${repoCount !== 1 ? "s" : ""} accessible` : "Repos accessible"}
          </p>
          {repositorySelection === "selected" && installationId && (
            <a
              href={`https://github.com/settings/installations/${installationId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[10.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2 leading-snug hover:bg-amber-100 transition-all duration-300 cursor-pointer"
            >
              <AlertCircle className="size-3 shrink-0" />
              Limited to selected repos. Click to grant all.
            </a>
          )}
          <motion.button
            onClick={onOpenPicker}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold bg-brand-primary text-white rounded-lg py-2 cursor-pointer hover:bg-brand-primary-hover transition-all duration-500"
          >
            <Upload className="size-3" /> Import Projects
          </motion.button>
          <button
            onClick={onDisconnect}
            className="w-full text-[11px] text-brand-text-subtle hover:text-brand-text transition-all duration-300 cursor-pointer text-center"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] text-brand-text-muted leading-relaxed">Connect your GitHub to import projects with AI formatting.</p>
          <a
            href={GITHUB_APP_INSTALL_URL}
            className="flex items-center justify-center gap-1.5 text-[11px] font-semibold border border-brand-border text-brand-text rounded-lg py-2 cursor-pointer hover:bg-brand-surface transition-all duration-500"
          >
            <GitFork className="size-3" /> Connect GitHub
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Resume Templates ─────────────────────────────────────────────────────────

const TEMPLATE_DEFS = [
  { id: "classic",     name: "Classic",     desc: "Clean single column. Safe ATS choice." },
  { id: "compact",     name: "Compact",     desc: "Maximum content density. Fits more." },
  { id: "two_column",  name: "Two Column",  desc: "Sidebar for contact, skills, education." },
  { id: "executive",   name: "Executive",   desc: "Bold name, accent headers. Senior roles." },
  { id: "minimal",     name: "Minimal",     desc: "No lines. Pure typography." },
  { id: "bold_header", name: "Bold Header", desc: "Massive name, accent stripe. High impact." },
  { id: "timeline",    name: "Timeline",    desc: "Vertical line connecting your career." },
  { id: "monospace",   name: "Monospace",   desc: "Code-style font. For engineers." },
  { id: "swiss",       name: "Swiss",       desc: "Grid-based, asymmetric. Design-forward." },
  { id: "ats_ultra",   name: "ATS Ultra",   desc: "Zero design. Maximum robot compatibility." },
] as const;

type TemplateId = (typeof TEMPLATE_DEFS)[number]["id"];

const T_SAMPLE = {
  name: "Nick Adams",
  email: "nick@example.com",
  phone: "+254 713 754 946",
  location: "Amsterdam, Netherlands",
  website: "nicklangat.com",
  linkedin: "linkedin.com/in/nick",
  github: "github.com/nicklangat",
  summary:
    "Senior Software Engineer with 8+ years building scalable backend systems. Specialized in Python, Django, FastAPI and PostgreSQL with strong DevOps exposure. Track record of cutting API response times by 40-80% and leading teams across multiple products.",
  experience: [
    {
      company: "Privatize Group GmbH",
      role: "Senior Software Engineer",
      location: "Remote, Germany",
      start_date: "Oct 2024",
      end_date: "Present",
      bullets: [
        "Designed scalable RESTful APIs using Django and Python for client and investment management workflows",
        "Integrated Mixpanel analytics across backend and frontend, enabling data-driven product decisions",
        "Built internationalization APIs with full test coverage, supporting multi-language expansion",
        "Reduced onboarding and verification time by 30% through compliance workflow improvements",
      ],
    },
    {
      company: "ElevateHR",
      role: "Senior Software Engineer",
      location: "Remote, Netherlands",
      start_date: "Sep 2023",
      end_date: "Mar 2025",
      bullets: [
        "Deployed high-performance backend services using Django and PostgreSQL, reducing API response times by 40%",
        "Optimized complex Django ORM queries, cutting response latency by 30%",
        "Containerized services with Docker, improving deployment consistency and reducing costs by 15%",
        "Implemented CI/CD pipelines with CircleCI, reducing deployment time by 50%",
      ],
    },
  ],
  skills: {
    Backend:   ["Python", "Django", "FastAPI", "Flask", "Golang"],
    Frontend:  ["TypeScript", "React", "Next.js", "Vue"],
    DevOps:    ["AWS", "Docker", "CI/CD", "NGINX", "Git"],
    Databases: ["PostgreSQL", "MySQL", "Redis"],
  },
  education: [
    { degree: "BSc Computer Science", institution: "Moi University", dates: "2012-2016", details: "2nd Class Upper" },
  ],
  projects: [
    { name: "Codetail",  description: "AI-powered coding question platform with real-time feedback",    tech: "Django, PostgreSQL, Next.js, AWS", url: "codetail.co" },
    { name: "Invoisce",  description: "Invoicing tool with bulk invoicing and email automation",         tech: "Django, Next.js, Celery, AWS",    url: "invoisce.co" },
  ],
};

type TemplateData = typeof T_SAMPLE;

function toTemplateData(resume: ResumeData): TemplateData {
  return {
    name: resume.file_name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
    email: resume.email,
    phone: resume.phone,
    location: resume.location,
    website: resume.website,
    linkedin: resume.linkedin,
    github: resume.github,
    summary: resume.profile,
    experience: resume.experience.map(e => {
      const parts = (e.period ?? "").split(/\s*[–—\-]\s*/);
      return { company: e.company, role: e.title, location: "", start_date: parts[0]?.trim() ?? "", end_date: parts[1]?.trim() ?? "", bullets: e.bullets };
    }),
    skills: Object.fromEntries(resume.skills.map(s => [s.category, s.items])) as Record<string, string[]>,
    education: resume.education.map(e => ({ degree: e.degree, institution: e.school, dates: e.period, details: "" })),
    projects: resume.projects.map(p => ({ name: p.name, description: p.description, tech: p.tech, url: p.live_url || p.github_url || "" })),
  };
}

const T_PAGE = "bg-white shadow-sm border border-gray-200 rounded-sm";
const T_A4   = { width: "595px", minHeight: "842px" };

function TSecHeader({ label }: { label: string }) {
  return <h2 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-2 mt-3">{label}</h2>;
}
function TExpBullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-0.5 space-y-0.5">
      {bullets.filter(Boolean).map((b, i) => (
        <li key={i} className="text-[9px] text-gray-800 leading-[1.45] pl-3 relative">
          <span className="absolute left-0 top-0">•</span>{b}
        </li>
      ))}
    </ul>
  );
}
function TExpBlock({ exp }: { exp: typeof T_SAMPLE.experience[0] }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-baseline">
        <span className="text-[9.5px] font-bold text-gray-900">{exp.role}</span>
        <span className="text-[8px] text-gray-500">{exp.start_date} – {exp.end_date}</span>
      </div>
      <p className="text-[8.5px] text-gray-500">{exp.company}  |  {exp.location}</p>
      <TExpBullets bullets={exp.bullets} />
    </div>
  );
}
function TEduBlock({ edu }: { edu: typeof T_SAMPLE.education[0] }) {
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <span className="text-[9px] font-bold text-gray-900">{edu.degree}</span>
        <span className="text-[8px] text-gray-500">{edu.dates}</span>
      </div>
      <p className="text-[8.5px] text-gray-500">{edu.institution}</p>
    </div>
  );
}
function TProjBlock({ proj }: { proj: typeof T_SAMPLE.projects[0] }) {
  return (
    <div className="mb-1.5">
      <div className="flex items-baseline gap-2">
        <span className="text-[9px] font-bold text-gray-900">{proj.name}</span>
        <span className="text-[8px] text-gray-400">{proj.tech}</span>
      </div>
      <p className="text-[8.5px] text-gray-600">{proj.description}</p>
      {proj.url && <p className="text-[8px] text-blue-600">{proj.url}</p>}
    </div>
  );
}

function ClassicTemplate({ data }: { data: TemplateData }) {
  const d = data;
  const contact = [d.location, d.email, d.phone, d.website, d.linkedin, d.github].filter(Boolean);
  return (
    <div className={T_PAGE} style={{ ...T_A4, padding: "40px 48px", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <h1 className="text-center text-[18px] font-bold text-gray-950 mb-1 tracking-wide">{d.name}</h1>
      <p className="text-center text-[8.5px] text-gray-500 mb-3">{contact.join("  ·  ")}</p>
      <hr className="border-gray-200 mb-3" />
      <p className="text-center text-[9px] text-gray-500 leading-relaxed mb-3">{d.summary}</p>
      <hr className="border-gray-200 mb-2" />
      <TSecHeader label="Experience" />
      {d.experience.map((exp, i) => <TExpBlock key={i} exp={exp} />)}
      <TSecHeader label="Skills" />
      {Object.entries(d.skills).map(([cat, items]) => (
        <div key={cat} className="flex text-[8.5px] mb-0.5">
          <span className="font-bold text-gray-900 w-[60px] shrink-0">{cat}:</span>
          <span className="text-gray-600">{items.join(", ")}</span>
        </div>
      ))}
      <TSecHeader label="Education" />
      <TEduBlock edu={d.education[0]} />
      <TSecHeader label="Projects" />
      {d.projects.map((p, i) => <TProjBlock key={i} proj={p} />)}
    </div>
  );
}

function CompactTemplate({ data }: { data: TemplateData }) {
  const d = data;
  const contact = [d.location, d.email, d.phone, d.website, d.linkedin, d.github].filter(Boolean);
  return (
    <div className={T_PAGE} style={{ ...T_A4, padding: "28px 36px", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="flex justify-between items-baseline mb-1">
        <h1 className="text-[16px] font-bold text-gray-950">{d.name}</h1>
        <span className="text-[7.5px] text-gray-500">{contact.join(" | ")}</span>
      </div>
      <hr className="border-gray-300 mb-2" />
      <p className="text-[8px] text-gray-600 leading-[1.5] mb-2">{d.summary}</p>
      <h2 className="text-[8px] font-bold text-gray-950 uppercase tracking-[0.15em] border-b border-gray-200 pb-0.5 mb-1.5">Experience</h2>
      {d.experience.map((exp, i) => (
        <div key={i} className={i > 0 ? "mt-1.5" : ""}>
          <div className="flex justify-between">
            <span className="text-[8.5px] font-bold text-gray-900">{exp.role}, {exp.company}</span>
            <span className="text-[7px] text-gray-400">{exp.start_date} - {exp.end_date}</span>
          </div>
          <ul className="mt-0.5">
            {exp.bullets.map((b, bi) => (
              <li key={bi} className="text-[8px] text-gray-700 leading-[1.4] pl-2 relative">
                <span className="absolute left-0">·</span>{b}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h2 className="text-[8px] font-bold text-gray-950 uppercase tracking-[0.15em] border-b border-gray-200 pb-0.5 mb-1.5 mt-2">Skills</h2>
      <p className="text-[8px] text-gray-600 leading-[1.4]">{Object.values(d.skills).flat().join(", ")}</p>
      <h2 className="text-[8px] font-bold text-gray-950 uppercase tracking-[0.15em] border-b border-gray-200 pb-0.5 mb-1.5 mt-2">Education</h2>
      <div className="flex justify-between text-[8px]">
        <span className="text-gray-900 font-bold">{d.education[0].degree}</span>
        <span className="text-gray-400">{d.education[0].dates}</span>
      </div>
      <p className="text-[7.5px] text-gray-500">{d.education[0].institution}</p>
      <h2 className="text-[8px] font-bold text-gray-950 uppercase tracking-[0.15em] border-b border-gray-200 pb-0.5 mb-1.5 mt-2">Projects</h2>
      {d.projects.map((p, i) => (
        <div key={i} className="mb-1">
          <span className="text-[8px] font-bold text-gray-900">{p.name}</span>
          <span className="text-[7.5px] text-gray-400 ml-1.5">{p.tech}</span>
          <p className="text-[7.5px] text-gray-600">{p.description}</p>
        </div>
      ))}
    </div>
  );
}

function TwoColumnTemplate({ data }: { data: TemplateData }) {
  const d = data;
  return (
    <div className={T_PAGE} style={{ ...T_A4, fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="flex h-full">
        <div className="w-[180px] shrink-0 bg-gray-50 p-6 space-y-5">
          <div>
            <h1 className="text-[14px] font-bold text-gray-950 leading-tight">{d.name}</h1>
            <p className="text-[8px] text-gray-500 mt-1">Senior Software Engineer</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.15em]">Contact</p>
            {[d.email, d.phone, d.location, d.website].map((item) => (
              <p key={item} className="text-[8px] text-gray-700 leading-tight">{item}</p>
            ))}
          </div>
          <div className="space-y-1.5">
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.15em]">Links</p>
            {[d.website, d.linkedin, d.github].filter(Boolean).map((item) => (
              <p key={item} className="text-[8px] text-blue-600 leading-tight">{item}</p>
            ))}
          </div>
          <div className="space-y-1.5">
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.15em]">Skills</p>
            {Object.entries(d.skills).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-[7.5px] font-bold text-gray-800">{cat}</p>
                <p className="text-[7.5px] text-gray-600 leading-tight">{items.join(", ")}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.15em]">Education</p>
            <p className="text-[8px] font-bold text-gray-800">{d.education[0].degree}</p>
            <p className="text-[7.5px] text-gray-600">{d.education[0].institution}</p>
            <p className="text-[7px] text-gray-400">{d.education[0].dates}</p>
          </div>
        </div>
        <div className="flex-1 p-6">
          <p className="text-[8.5px] text-gray-600 leading-relaxed mb-4">{d.summary}</p>
          <h2 className="text-[9px] font-bold text-gray-950 uppercase tracking-[0.12em] mb-2 pb-1 border-b border-gray-200">Experience</h2>
          {d.experience.map((exp, i) => <TExpBlock key={i} exp={exp} />)}
          <h2 className="text-[9px] font-bold text-gray-950 uppercase tracking-[0.12em] mb-2 mt-3 pb-1 border-b border-gray-200">Projects</h2>
          {d.projects.map((p, i) => <TProjBlock key={i} proj={p} />)}
        </div>
      </div>
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: TemplateData }) {
  const d = data;
  const contact = [d.location, d.email, d.phone, d.website, d.linkedin, d.github].filter(Boolean);
  return (
    <div className={T_PAGE} style={{ ...T_A4, padding: "44px 52px", fontFamily: "Georgia, serif" }}>
      <h1 className="text-[22px] font-bold text-gray-950 mb-0.5">{d.name}</h1>
      <p className="text-[9px] text-gray-500 tracking-wide mb-1">{contact.join("  ·  ")}</p>
      <div className="w-12 h-[2px] bg-blue-500 mb-4" />
      <p className="text-[9.5px] text-gray-600 leading-[1.6] mb-5" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>{d.summary}</p>
      <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.15em] mb-2">Experience</h2>
      {d.experience.map((exp, i) => (
        <div key={i} className={i > 0 ? "mt-3" : ""}>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-gray-900" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>{exp.role}</span>
            <span className="text-[8px] text-gray-400" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>{exp.start_date} - {exp.end_date}</span>
          </div>
          <p className="text-[8.5px] text-gray-500 mb-1" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>{exp.company}  ·  {exp.location}</p>
          <ul className="space-y-0.5">
            {exp.bullets.map((b, bi) => (
              <li key={bi} className="text-[9px] text-gray-700 leading-[1.5] pl-3 relative" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
                <span className="absolute left-0 text-blue-400">•</span>{b}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.15em] mt-5 mb-2">Skills</h2>
      <div className="grid grid-cols-2 gap-x-6" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
        {Object.entries(d.skills).map(([cat, items]) => (
          <div key={cat} className="flex text-[8.5px] mb-0.5">
            <span className="font-bold text-gray-900 w-[55px] shrink-0">{cat}</span>
            <span className="text-gray-600">{items.join(", ")}</span>
          </div>
        ))}
      </div>
      <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.15em] mt-5 mb-2">Education</h2>
      <div style={{ fontFamily: "Helvetica, Arial, sans-serif" }}><TEduBlock edu={d.education[0]} /></div>
      <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.15em] mt-5 mb-2">Projects</h2>
      <div style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
        {d.projects.map((p, i) => <TProjBlock key={i} proj={p} />)}
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: TemplateData }) {
  const d = data;
  const contact = [d.location, d.email, d.phone, d.website, d.linkedin, d.github].filter(Boolean);
  return (
    <div className={T_PAGE} style={{ ...T_A4, padding: "52px 56px", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <h1 className="text-[20px] font-light text-gray-950 mb-1 tracking-wide">{d.name}</h1>
      <p className="text-[8.5px] text-gray-400 tracking-wide mb-6">{contact.join("   /   ")}</p>
      <p className="text-[9px] text-gray-500 leading-[1.7] mb-8">{d.summary}</p>
      <h2 className="text-[8px] text-gray-400 uppercase tracking-[0.2em] mb-3">Experience</h2>
      {d.experience.map((exp, i) => (
        <div key={i} className={i > 0 ? "mt-4" : ""}>
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="text-[10px] font-medium text-gray-950">{exp.role}</span>
            <span className="text-[8px] text-gray-400">{exp.start_date} - {exp.end_date}</span>
          </div>
          <p className="text-[8.5px] text-gray-400 mb-1.5">{exp.company}</p>
          <ul className="space-y-1">
            {exp.bullets.map((b, bi) => (
              <li key={bi} className="text-[8.5px] text-gray-600 leading-[1.6] pl-2.5 relative">
                <span className="absolute left-0 text-gray-300">·</span>{b}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <h2 className="text-[8px] text-gray-400 uppercase tracking-[0.2em] mt-8 mb-3">Skills</h2>
      <p className="text-[8.5px] text-gray-600 leading-[1.6]">{Object.values(d.skills).flat().join("  ·  ")}</p>
      <h2 className="text-[8px] text-gray-400 uppercase tracking-[0.2em] mt-8 mb-3">Education</h2>
      <p className="text-[9px] text-gray-900">{d.education[0].degree}</p>
      <p className="text-[8.5px] text-gray-400">{d.education[0].institution}, {d.education[0].dates}</p>
      <h2 className="text-[8px] text-gray-400 uppercase tracking-[0.2em] mt-8 mb-3">Projects</h2>
      {d.projects.map((p, i) => (
        <div key={i} className={i > 0 ? "mt-2" : ""}>
          <span className="text-[9px] font-medium text-gray-900">{p.name}</span>
          <span className="text-[8px] text-gray-400 ml-2">{p.tech}</span>
          <p className="text-[8.5px] text-gray-500 mt-0.5">{p.description}</p>
        </div>
      ))}
    </div>
  );
}

function BoldHeaderTemplate({ data }: { data: TemplateData }) {
  const d = data;
  const contact = [d.location, d.email, d.phone, d.website, d.linkedin, d.github].filter(Boolean);
  return (
    <div className={T_PAGE} style={{ ...T_A4, fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="bg-gray-950 px-12 py-8">
        <h1 className="text-[28px] font-black text-white tracking-tight leading-none mb-1">{d.name}</h1>
        <p className="text-[9px] text-gray-400 tracking-wide">SENIOR SOFTWARE ENGINEER</p>
      </div>
      <div className="h-[3px] bg-blue-500" />
      <div className="px-12 py-6">
        <p className="text-[8.5px] text-gray-500 mb-4">{contact.join("  ·  ")}</p>
        <p className="text-[9px] text-gray-600 leading-relaxed mb-5">{d.summary}</p>
        <div className="inline-block bg-gray-950 text-white text-[8px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm mb-2">Experience</div>
        {d.experience.map((exp, i) => <TExpBlock key={i} exp={exp} />)}
        <div className="inline-block bg-gray-950 text-white text-[8px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm mb-2 mt-3">Skills</div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Object.values(d.skills).flat().map((s) => (
            <span key={s} className="text-[8px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{s}</span>
          ))}
        </div>
        <div className="inline-block bg-gray-950 text-white text-[8px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm mb-2">Education</div>
        <TEduBlock edu={d.education[0]} />
        <div className="inline-block bg-gray-950 text-white text-[8px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm mb-2 mt-3">Projects</div>
        {d.projects.map((p, i) => <TProjBlock key={i} proj={p} />)}
      </div>
    </div>
  );
}

function TimelineTemplate({ data }: { data: TemplateData }) {
  const d = data;
  const contact = [d.location, d.email, d.phone, d.website, d.linkedin, d.github].filter(Boolean);
  return (
    <div className={T_PAGE} style={{ ...T_A4, padding: "40px 48px", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <h1 className="text-[18px] font-bold text-gray-950 mb-0.5">{d.name}</h1>
      <p className="text-[8.5px] text-gray-500 mb-3">{contact.join("  ·  ")}</p>
      <hr className="border-gray-200 mb-3" />
      <p className="text-[9px] text-gray-500 leading-relaxed mb-4">{d.summary}</p>
      <TSecHeader label="Experience" />
      <div className="relative pl-5">
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gray-200" />
        {d.experience.map((exp, i) => (
          <div key={i} className={`relative ${i > 0 ? "mt-4" : ""}`}>
            <div className="absolute left-[-17px] top-1 size-[9px] rounded-full bg-blue-500 border-2 border-white" />
            <div className="flex justify-between items-baseline">
              <span className="text-[9.5px] font-bold text-gray-900">{exp.role}</span>
              <span className="text-[8px] text-gray-400">{exp.start_date} - {exp.end_date}</span>
            </div>
            <p className="text-[8.5px] text-gray-500 mb-1">{exp.company}  ·  {exp.location}</p>
            <ul className="space-y-0.5">
              {exp.bullets.map((b, bi) => (
                <li key={bi} className="text-[8.5px] text-gray-700 leading-[1.45] pl-2.5 relative">
                  <span className="absolute left-0 text-gray-300">•</span>{b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <TSecHeader label="Skills" />
      {Object.entries(d.skills).map(([cat, items]) => (
        <div key={cat} className="flex text-[8.5px] mb-0.5">
          <span className="font-bold text-gray-900 w-[60px] shrink-0">{cat}:</span>
          <span className="text-gray-600">{items.join(", ")}</span>
        </div>
      ))}
      <TSecHeader label="Education" />
      <TEduBlock edu={d.education[0]} />
      <TSecHeader label="Projects" />
      {d.projects.map((p, i) => <TProjBlock key={i} proj={p} />)}
    </div>
  );
}

function MonospaceTemplate({ data }: { data: TemplateData }) {
  const d = data;
  const contact = [d.location, d.email, d.phone, d.website, d.linkedin, d.github].filter(Boolean);
  return (
    <div className={T_PAGE} style={{ ...T_A4, padding: "40px 44px", fontFamily: "'Courier New', Courier, monospace" }}>
      <h1 className="text-[16px] font-bold text-gray-950 mb-0.5">{`> ${d.name}`}</h1>
      <p className="text-[8px] text-gray-500 mb-1">{`  ${contact.join(" | ")}`}</p>
      <p className="text-[8px] text-blue-600 mb-3">{`  ${[d.website, d.github, d.linkedin].filter(Boolean).join(" | ")}`}</p>
      <div className="text-[8px] text-gray-300 mb-3">{"─".repeat(72)}</div>
      <p className="text-[8.5px] text-gray-600 leading-[1.6] mb-3">{d.summary}</p>
      <div className="text-[8px] text-gray-300 mb-2">{"─".repeat(72)}</div>
      <p className="text-[9px] font-bold text-gray-950 mb-1.5">{"## EXPERIENCE"}</p>
      {d.experience.map((exp, i) => (
        <div key={i} className={i > 0 ? "mt-3" : ""}>
          <div className="flex justify-between text-[8.5px]">
            <span className="font-bold text-gray-900">{exp.role} @ {exp.company}</span>
            <span className="text-gray-400">{exp.start_date} - {exp.end_date}</span>
          </div>
          <ul className="mt-0.5">
            {exp.bullets.map((b, bi) => (
              <li key={bi} className="text-[8px] text-gray-700 leading-[1.5]">{`  - ${b}`}</li>
            ))}
          </ul>
        </div>
      ))}
      <div className="text-[8px] text-gray-300 my-2">{"─".repeat(72)}</div>
      <p className="text-[9px] font-bold text-gray-950 mb-1.5">{"## SKILLS"}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {Object.values(d.skills).flat().map((s) => (
          <span key={s} className="text-[8px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-sm">{s}</span>
        ))}
      </div>
      <p className="text-[9px] font-bold text-gray-950 mb-1.5">{"## EDUCATION"}</p>
      <p className="text-[8.5px] text-gray-700">{`${d.education[0].degree} | ${d.education[0].institution} | ${d.education[0].dates}`}</p>
      <div className="text-[8px] text-gray-300 my-2">{"─".repeat(72)}</div>
      <p className="text-[9px] font-bold text-gray-950 mb-1.5">{"## PROJECTS"}</p>
      {d.projects.map((p, i) => (
        <div key={i} className="mb-1.5">
          <span className="text-[8.5px] font-bold text-gray-900">{p.name}</span>
          <span className="text-[8px] text-gray-400 ml-2">[{p.tech}]</span>
          <p className="text-[8px] text-gray-600">{`  ${p.description}`}</p>
          {p.url && <p className="text-[8px] text-blue-600">{`  ${p.url}`}</p>}
        </div>
      ))}
    </div>
  );
}

function SwissTemplate({ data }: { data: TemplateData }) {
  const d = data;
  return (
    <div className={T_PAGE} style={{ ...T_A4, fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div className="flex h-full">
        <div className="w-[60px] shrink-0 bg-gray-950 flex items-end justify-center pb-8">
          <div className="transform -rotate-90 whitespace-nowrap">
            <span className="text-[7px] text-gray-500 uppercase tracking-[0.3em]">{d.email} · {d.phone}</span>
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-[32px] font-black text-gray-950 leading-none tracking-tight">{d.name.split(" ")[0]}</h1>
            <h1 className="text-[32px] font-light text-gray-400 leading-none tracking-tight">{d.name.split(" ").slice(1).join(" ")}</h1>
            <div className="flex gap-3 mt-2 text-[8px] text-gray-500">
              <span>{d.location}</span>
              {d.website && <span>{d.website}</span>}
              {d.linkedin && <span>{d.linkedin}</span>}
              {d.github && <span>{d.github}</span>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">About</p>
              <p className="text-[8.5px] text-gray-600 leading-[1.6] mb-5">{d.summary}</p>
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Skills</p>
              {Object.entries(d.skills).map(([cat, items]) => (
                <div key={cat} className="mb-2">
                  <p className="text-[7.5px] font-bold text-gray-900 mb-0.5">{cat}</p>
                  {items.map((s) => <p key={s} className="text-[8px] text-gray-600 leading-tight">{s}</p>)}
                </div>
              ))}
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 mt-4">Education</p>
              <p className="text-[8px] font-bold text-gray-900">{d.education[0].degree}</p>
              <p className="text-[7.5px] text-gray-500">{d.education[0].institution}</p>
              <p className="text-[7px] text-gray-400">{d.education[0].dates}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Experience</p>
              {d.experience.map((exp, i) => (
                <div key={i} className={i > 0 ? "mt-3" : ""}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold text-gray-950">{exp.role}</span>
                    <span className="text-[8px] text-gray-400">{exp.start_date} - {exp.end_date}</span>
                  </div>
                  <p className="text-[8.5px] text-gray-500 mb-1">{exp.company}</p>
                  <ul className="space-y-0.5">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="text-[8.5px] text-gray-700 leading-[1.5] pl-2 relative">
                        <span className="absolute left-0 text-blue-500 font-bold">·</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 mt-5">Projects</p>
              {d.projects.map((p, i) => (
                <div key={i} className={i > 0 ? "mt-2" : ""}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[9px] font-bold text-gray-900">{p.name}</span>
                    <span className="text-[7.5px] text-gray-400">{p.tech}</span>
                  </div>
                  <p className="text-[8px] text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ATSUltraTemplate({ data }: { data: TemplateData }) {
  const d = data;
  return (
    <div className={T_PAGE} style={{ ...T_A4, padding: "48px 48px", fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 className="text-[18px] font-bold text-black text-center mb-0.5">{d.name}</h1>
      <p className="text-[10px] text-black text-center mb-3">
        {d.location} | {d.email} | {d.phone}
        {d.website && ` | ${d.website}`}
        {d.linkedin && ` | ${d.linkedin}`}
        {d.github && ` | ${d.github}`}
      </p>
      <hr className="border-black mb-2" />
      <p className="text-[10px] font-bold text-black uppercase mb-1">Summary</p>
      <p className="text-[10px] text-black leading-[1.5] mb-3">{d.summary}</p>
      <p className="text-[10px] font-bold text-black uppercase mb-1">Experience</p>
      {d.experience.map((exp, i) => (
        <div key={i} className={i > 0 ? "mt-2" : ""}>
          <div className="flex justify-between">
            <span className="text-[10px] font-bold text-black">{exp.role}, {exp.company}</span>
            <span className="text-[10px] text-black">{exp.start_date} - {exp.end_date}</span>
          </div>
          <p className="text-[9px] text-black italic">{exp.location}</p>
          <ul className="mt-0.5">
            {exp.bullets.map((b, bi) => (
              <li key={bi} className="text-[10px] text-black leading-[1.4] ml-4 list-disc">{b}</li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-[10px] font-bold text-black uppercase mt-3 mb-1">Skills</p>
      {Object.entries(d.skills).map(([cat, items]) => (
        <p key={cat} className="text-[10px] text-black leading-[1.4]">
          <span className="font-bold">{cat}:</span> {items.join(", ")}
        </p>
      ))}
      <p className="text-[10px] font-bold text-black uppercase mt-3 mb-1">Education</p>
      <div className="flex justify-between">
        <span className="text-[10px] font-bold text-black">{d.education[0].degree}</span>
        <span className="text-[10px] text-black">{d.education[0].dates}</span>
      </div>
      <p className="text-[10px] text-black">{d.education[0].institution}{d.education[0].details && ` - ${d.education[0].details}`}</p>
      <p className="text-[10px] font-bold text-black uppercase mt-3 mb-1">Projects</p>
      {d.projects.map((p, i) => (
        <div key={i} className={i > 0 ? "mt-1" : ""}>
          <span className="text-[10px] font-bold text-black">{p.name}</span>
          <span className="text-[10px] text-black"> - {p.tech}</span>
          <p className="text-[10px] text-black">{p.description}{p.url && ` (${p.url})`}</p>
        </div>
      ))}
    </div>
  );
}

function TemplatesTab({
  resume,
  activeTemplateId,
  onUseTemplate,
  saving,
}: {
  resume?: ResumeData;
  activeTemplateId?: string;
  onUseTemplate: (id: TemplateId) => void;
  saving: boolean;
}) {
  const [selected, setSelected] = React.useState<TemplateId>((activeTemplateId as TemplateId) ?? "classic");
  const current = TEMPLATE_DEFS.find((t) => t.id === selected)!;
  const data: TemplateData = resume ? toTemplateData(resume) : T_SAMPLE;

  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = React.useCallback(async () => {
    if (!resume) return;
    setDownloading(true);
    try {
      const { useAuthStore } = await import("@/stores/auth-store");
      const token = useAuthStore.getState().accessToken;
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082";
      const res = await fetch(`${base}/resume/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume.file_name ?? "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fall back — user can retry
    } finally {
      setDownloading(false);
    }
  }, [resume]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-brand-text mb-0.5">Resume Templates</p>
          <p className="text-[12px] text-brand-text-muted">{current.name} — {current.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onUseTemplate(selected)}
            disabled={saving || selected === activeTemplateId}
            className="flex items-center gap-1.5 text-xs font-medium border border-brand-border text-brand-text px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-surface transition-all duration-500 shrink-0 disabled:opacity-50"
          >
            {saving ? <Spinner size="sm" /> : <Check className="size-3.5" />}
            {selected === activeTemplateId ? "Active" : "Use Template"}
          </motion.button>
          <motion.button
            onClick={handleDownload}
            disabled={downloading || !resume}
            className="flex items-center gap-1.5 text-xs font-semibold bg-brand-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-primary-hover transition-all duration-500 shrink-0 disabled:opacity-50"
          >
            {downloading ? <Spinner size="sm" /> : <Download className="size-3.5" />} {downloading ? "Generating…" : "Download PDF"}
          </motion.button>
        </div>
      </div>

      {/* Selector strip */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {TEMPLATE_DEFS.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`relative px-3.5 py-2 rounded-lg text-left cursor-pointer shrink-0 border ${
              selected === t.id
                ? "border-transparent text-white"
                : "border-brand-border text-brand-text-muted hover:bg-brand-surface"
            }`}
          >
            {selected === t.id && (
              <motion.div
                layoutId="template-selected-bg"
                className="absolute inset-0 rounded-lg bg-brand-text"
                transition={{ type: "spring", stiffness: 600, damping: 38 }}
              />
            )}
            <span className="relative z-10 text-[12px] font-medium block">{t.name}</span>
            <span className={`relative z-10 text-[10px] block ${selected === t.id ? "text-white/60" : "text-brand-text-subtle"}`}>{t.desc}</span>
            {t.id === activeTemplateId && selected !== t.id && (
              <span className="relative z-10 text-[9px] text-brand-primary font-semibold">Active</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* A4 preview */}
      <div className="flex justify-center bg-brand-surface rounded-xl p-8 border border-brand-border overflow-x-auto">
        <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {selected === "classic"     && <ClassicTemplate data={data} />}
          {selected === "compact"     && <CompactTemplate data={data} />}
          {selected === "two_column"  && <TwoColumnTemplate data={data} />}
          {selected === "executive"   && <ExecutiveTemplate data={data} />}
          {selected === "minimal"     && <MinimalTemplate data={data} />}
          {selected === "bold_header" && <BoldHeaderTemplate data={data} />}
          {selected === "timeline"    && <TimelineTemplate data={data} />}
          {selected === "monospace"   && <MonospaceTemplate data={data} />}
          {selected === "swiss"       && <SwissTemplate data={data} />}
          {selected === "ats_ultra"   && <ATSUltraTemplate data={data} />}
        </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ResumePage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("CV");
  const [repoModalOpen, setRepoModalOpen] = useState(false);
  const [importedProjects, setImportedProjects] = useState<ImportedProject[] | null>(null);
  const queryClient = useQueryClient();

  const isPremium = user?.tier === "premium";
  const isGitHubConnected = !!user?.github_installation_id;
  const name = user?.name ?? "You";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
    enabled: isPremium,
    retry: false,
  });

  const { data: reposData, isLoading: reposLoading } = useQuery({
    queryKey: ["github-repos"],
    queryFn: getGitHubRepos,
    enabled: isGitHubConnected,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const { mutate: upload, isPending: uploading } = useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      queryClient.setQueryData(["resume"], data);
      queryClient.removeQueries({ queryKey: ["resume-analysis"] });
      toast.success("Resume parsed and ready.");
    },
    onError: () => toast.error("Failed to parse resume. Please try again."),
  });

  const { mutate: saveTemplate, isPending: savingTemplate } = useMutation({
    mutationFn: (template_id: string) => {
      const current = queryClient.getQueryData<ResumeData>(["resume"]);
      if (!current) throw new Error("No resume");
      return updateResume({
        template_id,
        profile: current.profile,
        email: current.email,
        phone: current.phone,
        location: current.location,
        website: current.website,
        linkedin: current.linkedin,
        github: current.github,
        experience: current.experience,
        education: current.education,
        skills: current.skills,
        projects: current.projects,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["resume"], data);
      toast.success("Template saved.");
    },
    onError: () => toast.error("Failed to save template."),
  });

  const { mutate: saveEdit, isPending: saving } = useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      queryClient.setQueryData(["resume"], data);
      queryClient.removeQueries({ queryKey: ["resume-analysis"] });
      setTab("CV");
      toast.success("Resume updated.");
    },
    onError: () => toast.error("Failed to save changes."),
  });

  const { mutate: appendProjects, isPending: appendingProjects } = useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      queryClient.setQueryData(["resume"], data);
      queryClient.removeQueries({ queryKey: ["resume-analysis"] });
      toast.success("Projects saved to resume.");
    },
    onError: () => toast.error("Failed to save projects."),
  });

  const { mutate: doImport, isPending: importing } = useMutation({
    mutationFn: (repos: import("@/lib/api/github").ImportRepoPayload[]) => importGitHubRepos(repos),
    onSuccess: (projects) => {
      setImportedProjects(projects);
    },
    onError: () => toast.error("Import failed. Please try again."),
  });

  const { mutate: doDisconnect } = useMutation({
    mutationFn: disconnectGitHub,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["github-repos"] });
      toast.success("GitHub disconnected.");
    },
    onError: () => toast.error("Failed to disconnect."),
  });

  return (
    <div className="w-full max-w-6xl px-6 py-8">
      <div className="flex gap-6 items-start">

        {/* Left panel */}
        <div className="w-64 shrink-0 space-y-4">
          <div className="border border-brand-border rounded-xl p-4 text-center relative">
            <button className="absolute top-3 right-3 text-brand-text-subtle hover:text-brand-text transition-all duration-500 cursor-pointer">
              <Edit3 className="size-3.5" />
            </button>
            <div className="size-16 rounded-full bg-brand-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-3">
              {initials}
            </div>
            <p className="font-bold text-sm text-brand-text">{name}</p>
            <p className="text-[11px] text-brand-text-muted mt-0.5">Backend Engineer · Python</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full">
              <span className="size-1.5 rounded-full bg-brand-success" />
              Open to work
            </span>
          </div>

          <div className="flex gap-2">
            <motion.button
                           className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium border border-brand-border rounded-lg py-2 cursor-pointer hover:bg-brand-surface transition-all duration-500 text-brand-text"
            >
              <Share2 className="size-3" /> Share
            </motion.button>
            <motion.button
                           className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium bg-brand-text text-white rounded-lg py-2 cursor-pointer hover:bg-brand-text/90 transition-all duration-500"
            >
              <Download className="size-3" /> Download
            </motion.button>
          </div>

          <div className="border border-brand-border rounded-xl p-4">
            <p className="text-[11px] font-semibold text-brand-text uppercase tracking-wide mb-2">Personal Information</p>
            <div className="divide-y divide-brand-border">
              {PERSONAL_INFO.map((item) => (
                <InfoRow key={item.label} {...item} />
              ))}
            </div>
          </div>

          <div className="border border-brand-border rounded-xl p-4">
            <p className="text-[11px] font-semibold text-brand-text uppercase tracking-wide mb-3">Preferences</p>
            <div className="space-y-3">
              {PREFERENCES.map((p) => (
                <div key={p.label}>
                  <p className="text-[10px] text-brand-text-subtle uppercase tracking-wide mb-0.5">{p.label}</p>
                  <p className="text-[12px] text-brand-text font-medium">{p.value}</p>
                </div>
              ))}
            </div>
          </div>

          {isPremium && resume && (
            <div className="border border-brand-border rounded-xl p-4">
              <p className="text-[11px] font-semibold text-brand-text uppercase tracking-wide mb-2">Resume</p>
              <p className="text-[11px] text-brand-text-muted truncate">{resume.file_name}</p>
            </div>
          )}

          <GitHubSection
            connected={isGitHubConnected}
            repoCount={reposData?.repos.length ?? 0}
            repositorySelection={reposData?.repository_selection ?? null}
            installationId={reposData?.installation_id ?? null}
            onOpenPicker={() => { setImportedProjects(null); setRepoModalOpen(true); }}
            onDisconnect={() => doDisconnect()}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-1 border-b border-brand-border mb-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-all duration-500 border-b-2 -mb-px ${
                  tab === t
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-brand-text-muted hover:text-brand-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "CV" && (
              <motion.div
                key="cv"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1"
              >
                {!isPremium && <PremiumGate />}
                {isPremium && (uploading || isLoading) && <ParsingState />}
                {isPremium && !uploading && !isLoading && !resume && (
                  <UploadPrompt onUpload={(file) => upload(file)} />
                )}
                {isPremium && !uploading && resume && (
                  <ParsedDocument resume={resume} onUpload={(file) => upload(file)} onEdit={() => setTab("Editor")} />
                )}
              </motion.div>
            )}
            {tab === "Editor" && (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col min-h-0 border border-brand-border rounded-xl overflow-hidden"
                style={{ height: "calc(100vh - 180px)" }}
              >
                {!isPremium && <PremiumGate />}
                {isPremium && !resume && <UploadPrompt onUpload={(file) => upload(file)} />}
                {isPremium && resume && (
                  <ResumeEditorPanel resume={resume} onSave={(d) => saveEdit(d)} saving={saving} />
                )}
              </motion.div>
            )}
            {tab === "Analysis" && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1"
              >
                {!isPremium && <PremiumGate />}
                {isPremium && <AnalysisTab resume={resume} />}
              </motion.div>
            )}
            {tab === "Templates" && (
              <motion.div
                key="templates"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1"
              >
                <TemplatesTab
                  resume={resume}
                  activeTemplateId={resume?.template_id ?? "classic"}
                  onUseTemplate={(id) => saveTemplate(id)}
                  saving={savingTemplate}
                />
              </motion.div>
            )}
            {tab !== "CV" && tab !== "Editor" && tab !== "Analysis" && tab !== "Templates" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={SP}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="size-12 rounded-xl bg-brand-surface flex items-center justify-center mb-3">
                  <CheckCircle2 className="size-5 text-brand-text-subtle" />
                </div>
                <p className="font-semibold text-brand-text mb-1">{tab}</p>
                <p className="text-sm text-brand-text-muted">This section is coming soon.</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <AnimatePresence>
        {repoModalOpen && (
          <RepoPickerModal
            repos={reposData?.repos ?? []}
            loading={reposLoading}
            onClose={() => setRepoModalOpen(false)}
            onImport={(payload) => doImport(payload)}
            importing={importing}
            importedProjects={importedProjects}
            onSaveProjects={(projects) => {
              const current = queryClient.getQueryData<ResumeData>(["resume"]);
              if (current) {
                appendProjects({
                  profile: current.profile,
                  experience: current.experience,
                  education: current.education,
                  skills: current.skills,
                  projects: [...current.projects, ...projects],
                });
              }
              setRepoModalOpen(false);
            }}
            savingProjects={appendingProjects}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
