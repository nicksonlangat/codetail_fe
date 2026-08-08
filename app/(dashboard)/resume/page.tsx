"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Mail, Briefcase, Download, Share2,
  Edit3, GitFork, Link2, CheckCircle2, Upload,
  FileText, WandSparkles, AlertCircle, ArrowRight,
  ChevronDown, Plus, Trash2, X, Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import {
  getResume, uploadResume, updateResume, getAIAssist,
  getResumeAnalysis, runResumeAnalysis,
  type ResumeData, type ResumeExperience, type ResumeEducation, type ResumeSkillGroup, type ResumeAnalysis,
} from "@/lib/api/resume";
import { toast } from "sonner";

const SP = { type: "spring" as const, stiffness: 400, damping: 25 };

const TABS = ["CV", "Analysis", "Documents", "Skills", "Settings"];

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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
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
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
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
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium bg-brand-text text-white rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-text/90 transition-all duration-500"
          >
            <Edit3 className="size-3" /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
            onClick={() => replaceRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-medium border border-brand-border rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-surface transition-all duration-500 text-brand-text"
          >
            <Upload className="size-3" /> Replace
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
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
          <div>
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
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
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
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
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
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
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

const INPUT = "w-full text-[12.5px] text-brand-text bg-brand-surface border border-brand-border rounded-lg px-3 py-2 outline-none focus:border-brand-primary/60 focus:bg-white transition-all duration-500 placeholder:text-brand-text-subtle";
const TA = `${INPUT} resize-none leading-relaxed`;

function useAIAssist() {
  const [loading, setLoading] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState<string | null>(null);

  async function run(fieldType: string, current: string, context = "") {
    if (!current.trim()) return;
    setLoading(true);
    setSuggestion(null);
    try {
      const r = await getAIAssist(fieldType, current, context);
      setSuggestion(r.suggestion);
    } catch {
      toast.error("AI assist failed.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, suggestion, run, dismiss: () => setSuggestion(null) };
}

function AISuggestionPanel({ suggestion, onAccept, onDismiss }: { suggestion: string; onAccept: () => void; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      transition={SP}
      className="mt-2 p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-primary">AI Suggestion</p>
        <button type="button" onClick={onDismiss} className="text-brand-text-subtle hover:text-brand-text cursor-pointer transition-all duration-500">
          <X className="size-3" />
        </button>
      </div>
      <p className="text-[12px] text-brand-text leading-relaxed mb-3">{suggestion}</p>
      <div className="flex gap-2">
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
          onClick={onAccept}
          className="flex items-center gap-1 text-[11px] font-semibold bg-brand-primary text-white px-2.5 py-1 rounded-md cursor-pointer hover:bg-brand-primary-hover transition-all duration-500"
        >
          <Check className="size-3" /> Accept
        </motion.button>
        <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
          onClick={onDismiss}
          className="text-[11px] font-medium text-brand-text-muted border border-brand-border px-2.5 py-1 rounded-md cursor-pointer hover:bg-brand-surface transition-all duration-500"
        >
          Discard
        </motion.button>
      </div>
    </motion.div>
  );
}

function AIBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP}
      onClick={onClick} disabled={loading}
      className="flex items-center gap-1 text-[10px] font-medium text-brand-primary border border-brand-primary/20 bg-brand-primary/5 rounded-md px-2 py-1 cursor-pointer hover:bg-brand-primary/10 transition-all duration-500 disabled:opacity-50 shrink-0"
    >
      <WandSparkles className={`size-3 ${loading ? "animate-pulse" : ""}`} />
      {loading ? "..." : "AI"}
    </motion.button>
  );
}

function EditSection({ title, badge, defaultOpen = false, children }: {
  title: string; badge?: number; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-brand-surface transition-all duration-500 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-brand-text">{title}</span>
          {badge !== undefined && (
            <span className="text-[10px] font-medium text-brand-text-subtle bg-brand-surface border border-brand-border rounded px-1.5 py-0.5">{badge}</span>
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
            <div className="border-t border-brand-border p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BulletEditor({ value, context, onChange, onRemove }: {
  value: string; context: string; onChange: (v: string) => void; onRemove: () => void;
}) {
  const ai = useAIAssist();
  return (
    <div className="space-y-1">
      <div className="flex gap-2 items-start">
        <textarea rows={2} value={value} onChange={e => onChange(e.target.value)}
          placeholder="Describe an achievement..." className={TA} />
        <div className="flex flex-col gap-1 shrink-0">
          <AIBtn onClick={() => ai.run("bullet", value, context)} loading={ai.loading} />
          <button type="button" onClick={onRemove}
            className="size-6 flex items-center justify-center rounded-md hover:bg-red-50 text-brand-text-subtle hover:text-red-500 cursor-pointer transition-all duration-500"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {ai.suggestion && (
          <AISuggestionPanel
            suggestion={ai.suggestion}
            onAccept={() => { onChange(ai.suggestion!); ai.dismiss(); }}
            onDismiss={ai.dismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Edit resume modal ─────────────────────────────────────────────────────────

function EditResumeModal({ resume, onClose, onSave, saving }: {
  resume: ResumeData;
  onClose: () => void;
  onSave: (d: { profile: string; experience: ResumeExperience[]; education: ResumeEducation[]; skills: ResumeSkillGroup[] }) => void;
  saving: boolean;
}) {
  const [profile, setProfile] = React.useState(resume.profile);
  const [experience, setExperience] = React.useState<ResumeExperience[]>(
    resume.experience.map(e => ({ ...e, bullets: [...e.bullets] }))
  );
  const [education, setEducation] = React.useState<ResumeEducation[]>(resume.education.map(e => ({ ...e })));
  const [skills, setSkills] = React.useState<ResumeSkillGroup[]>(resume.skills.map(s => ({ ...s, items: [...s.items] })));
  const [openExp, setOpenExp] = React.useState<Set<number>>(new Set([0]));
  const [newSkill, setNewSkill] = React.useState<Record<number, string>>({});

  const profileAI = useAIAssist();

  // Experience helpers
  const setExp = (i: number, patch: Partial<ResumeExperience>) =>
    setExperience(prev => prev.map((e, j) => j === i ? { ...e, ...patch } : e));
  const setBullet = (ei: number, bi: number, v: string) =>
    setExperience(prev => prev.map((e, i) => i === ei ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? v : b) } : e));
  const removeBullet = (ei: number, bi: number) =>
    setExperience(prev => prev.map((e, i) => i === ei ? { ...e, bullets: e.bullets.filter((_, j) => j !== bi) } : e));
  const addBullet = (ei: number) =>
    setExperience(prev => prev.map((e, i) => i === ei ? { ...e, bullets: [...e.bullets, ""] } : e));

  // Education helpers
  const setEdu = (i: number, patch: Partial<ResumeEducation>) =>
    setEducation(prev => prev.map((e, j) => j === i ? { ...e, ...patch } : e));

  // Skills helpers
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/35 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={SP}
        className="relative w-full max-w-2xl bg-white rounded-2xl flex flex-col border border-brand-border shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2.5">
            <Edit3 className="size-4 text-brand-text-subtle" />
            <p className="font-semibold text-brand-text">Edit Resume</p>
          </div>
          <button type="button" onClick={onClose}
            className="size-7 flex items-center justify-center rounded-lg hover:bg-brand-surface text-brand-text-subtle hover:text-brand-text cursor-pointer transition-all duration-500"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-[70vh]">

          {/* Profile */}
          <EditSection title="Profile" defaultOpen>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <textarea
                  rows={4}
                  value={profile}
                  onChange={e => setProfile(e.target.value)}
                  placeholder="Professional summary..."
                  className={TA}
                />
                <AIBtn onClick={() => profileAI.run("profile", profile)} loading={profileAI.loading} />
              </div>
              <AnimatePresence>
                {profileAI.suggestion && (
                  <AISuggestionPanel
                    suggestion={profileAI.suggestion}
                    onAccept={() => { setProfile(profileAI.suggestion!); profileAI.dismiss(); }}
                    onDismiss={profileAI.dismiss}
                  />
                )}
              </AnimatePresence>
            </div>
          </EditSection>

          {/* Experience */}
          <EditSection title="Experience" badge={experience.length} defaultOpen>
            <div className="space-y-2">
              {experience.map((exp, ei) => {
                const isOpen = openExp.has(ei);
                return (
                  <div key={ei} className="border border-brand-border rounded-lg overflow-hidden">
                    <button type="button"
                      onClick={() => setOpenExp(prev => { const n = new Set(prev); n.has(ei) ? n.delete(ei) : n.add(ei); return n; })}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-brand-surface transition-all duration-500 cursor-pointer text-left"
                    >
                      <div>
                        <p className="text-[12.5px] font-semibold text-brand-text">{exp.title || "Untitled role"}</p>
                        <p className="text-[11px] text-brand-text-subtle">{exp.company}{exp.period ? ` · ${exp.period}` : ""}</p>
                      </div>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="size-3.5 text-brand-text-subtle" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                          transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="border-t border-brand-border p-3.5 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <input value={exp.title} onChange={e => setExp(ei, { title: e.target.value })} placeholder="Job title" className={INPUT} />
                              <input value={exp.company} onChange={e => setExp(ei, { company: e.target.value })} placeholder="Company" className={INPUT} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input value={exp.period} onChange={e => setExp(ei, { period: e.target.value })} placeholder="e.g. Jan 2023 – Present" className={INPUT} />
                              <div className={`${INPUT} text-brand-text-subtle cursor-default`}>{exp.duration || "Duration auto-computed"}</div>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold text-brand-text-subtle uppercase tracking-widest mb-2">Bullets</p>
                              <div className="space-y-2">
                                {exp.bullets.map((bullet, bi) => (
                                  <BulletEditor
                                    key={bi}
                                    value={bullet}
                                    context={`${exp.title} at ${exp.company}`}
                                    onChange={v => setBullet(ei, bi, v)}
                                    onRemove={() => removeBullet(ei, bi)}
                                  />
                                ))}
                              </div>
                              <button type="button" onClick={() => addBullet(ei)}
                                className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-brand-primary cursor-pointer hover:underline transition-all duration-500"
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

          {/* Skills */}
          <EditSection title="Skills" badge={skills.length}>
            <div className="space-y-3">
              {skills.map((group, gi) => (
                <div key={gi} className="border border-brand-border rounded-lg p-3.5 space-y-2.5">
                  <input
                    value={group.category}
                    onChange={e => setSkillCat(gi, e.target.value)}
                    placeholder="Category name"
                    className={`${INPUT} font-semibold`}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item, ii) => (
                      <span key={ii} className="flex items-center gap-1 text-[11px] bg-brand-surface border border-brand-border rounded-md px-2 py-0.5">
                        {item}
                        <button type="button" onClick={() => removeSkillItem(gi, ii)}
                          className="text-brand-text-subtle hover:text-red-500 cursor-pointer transition-all duration-500"
                        >
                          <X className="size-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newSkill[gi] ?? ""}
                      onChange={e => setNewSkill(p => ({ ...p, [gi]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkillItem(gi))}
                      placeholder="Add skill..."
                      className={INPUT}
                    />
                    <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={SP}
                      onClick={() => addSkillItem(gi)}
                      className="flex items-center gap-1 text-[11px] font-medium text-brand-primary border border-brand-primary/20 bg-brand-primary/5 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-brand-primary/10 transition-all duration-500 shrink-0"
                    >
                      <Plus className="size-3" /> Add
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </EditSection>

          {/* Education */}
          <EditSection title="Education" badge={education.length}>
            <div className="space-y-2">
              {education.map((edu, ei) => (
                <div key={ei} className="border border-brand-border rounded-lg p-3.5 space-y-2">
                  <input value={edu.degree} onChange={e => setEdu(ei, { degree: e.target.value })} placeholder="Degree / qualification" className={INPUT} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={edu.school} onChange={e => setEdu(ei, { school: e.target.value })} placeholder="Institution" className={INPUT} />
                    <input value={edu.period} onChange={e => setEdu(ei, { period: e.target.value })} placeholder="e.g. 2012 – 2016" className={INPUT} />
                  </div>
                </div>
              ))}
            </div>
          </EditSection>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-brand-border shrink-0">
          <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
            onClick={onClose}
            className="text-sm font-medium text-brand-text-muted border border-brand-border rounded-lg px-4 py-2 cursor-pointer hover:bg-brand-surface transition-all duration-500"
          >
            Cancel
          </motion.button>
          <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
            onClick={() => onSave({ profile, experience, education, skills })}
            disabled={saving}
            className="text-sm font-semibold bg-brand-primary text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-brand-primary-hover transition-all duration-500 disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <WandSparkles className="size-3.5 animate-pulse" />}
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResumePage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("CV");
  const [editOpen, setEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const isPremium = user?.tier === "premium";
  const name = user?.name ?? "You";
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume"],
    queryFn: getResume,
    enabled: isPremium,
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

  const { mutate: saveEdit, isPending: saving } = useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      queryClient.setQueryData(["resume"], data);
      queryClient.removeQueries({ queryKey: ["resume-analysis"] });
      setEditOpen(false);
      toast.success("Resume updated.");
    },
    onError: () => toast.error("Failed to save changes."),
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
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
              className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium border border-brand-border rounded-lg py-2 cursor-pointer hover:bg-brand-surface transition-all duration-500 text-brand-text"
            >
              <Share2 className="size-3" /> Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
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
                  <ParsedDocument resume={resume} onUpload={(file) => upload(file)} onEdit={() => setEditOpen(true)} />
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
            {tab !== "CV" && tab !== "Analysis" && (
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
        {editOpen && resume && (
          <EditResumeModal
            resume={resume}
            onClose={() => setEditOpen(false)}
            onSave={(d) => saveEdit(d)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
