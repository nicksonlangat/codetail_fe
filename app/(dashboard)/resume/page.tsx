"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Mail, Briefcase, Download, Share2,
  Edit3, GitFork, Link2, CheckCircle2, Upload,
  FileText, WandSparkles, AlertCircle, ArrowRight,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { getResume, uploadResume, getResumeAnalysis, runResumeAnalysis, type ResumeData, type ResumeAnalysis } from "@/lib/api/resume";
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

function ParsedDocument({ resume, onUpload }: { resume: ResumeData; onUpload: (file: File) => void }) {
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

function ScoreRing({ score }: { score: number }) {
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const stroke = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Strong" : score >= 60 ? "Fair" : "Needs work";
  const labelCls = score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-red-500";

  return (
    <div className="relative size-36 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={R}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-3xl font-bold text-brand-text leading-none">{score}</p>
        <p className="text-[10px] text-brand-text-subtle mt-0.5">/100</p>
        <p className={`text-[10px] font-semibold mt-1 ${labelCls}`}>{label}</p>
      </div>
    </div>
  );
}

function AnalysisLoading() {
  return (
    <div className="space-y-5">
      <div className="border border-brand-border rounded-xl p-6 flex items-center gap-8">
        <div className="size-36 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <ShimmerBar className="h-2.5 w-16" delay={0} />
          <ShimmerBar className="h-6 w-20" delay={0.05} />
          <ShimmerBar className="h-3.5 w-full" delay={0.1} />
          <ShimmerBar className="h-3.5 w-3/4" delay={0.15} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {([0.2, 0.4, 0.6] as number[]).map((d) => (
          <div key={d} className="border border-brand-border rounded-xl p-5">
            <ShimmerBar className="h-2.5 w-20 mb-4" delay={d} />
            {[0, 1, 2, 3].map((j) => (
              <div key={j} className="flex gap-2 items-center mb-3">
                <ShimmerBar className="size-3.5 shrink-0" delay={d + j * 0.05} />
                <ShimmerBar className={`h-3 ${j % 2 === 0 ? "w-full" : "w-4/5"}`} delay={d + j * 0.05 + 0.02} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="border border-brand-border rounded-xl p-5">
        <ShimmerBar className="h-2.5 w-48 mb-4" delay={0.8} />
        <div className="flex flex-wrap gap-2">
          {([20, 24, 16, 28, 20, 16, 24] as number[]).map((w, i) => (
            <ShimmerBar key={i} className="h-6 rounded-md" style={{ width: w * 4 }} delay={0.85 + i * 0.04} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisResults({ data, onReanalyse, reanalysing }: { data: ResumeAnalysis; onReanalyse: () => void; reanalysing: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SP} className="space-y-5">
      {/* Score card */}
      <div className="border border-brand-border rounded-xl p-6 flex items-center gap-8">
        <ScoreRing score={data.score} />
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-brand-text-subtle uppercase tracking-wide mb-1">ATS Compatibility Score</p>
          <p className="text-sm text-brand-text-muted leading-relaxed max-w-md">{data.summary}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SP}
          onClick={onReanalyse}
          disabled={reanalysing}
          className="flex items-center gap-1.5 text-xs font-medium border border-brand-border rounded-lg px-3 py-1.5 cursor-pointer hover:bg-brand-surface transition-all duration-500 text-brand-text disabled:opacity-50 shrink-0"
        >
          <WandSparkles className={`size-3 ${reanalysing ? "animate-pulse" : ""}`} />
          {reanalysing ? "Analysing..." : "Re-analyse"}
        </motion.button>
      </div>

      {/* Strengths / Weaknesses / Suggestions */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-brand-border rounded-xl p-5">
          <p className="text-[11px] font-semibold text-green-600 uppercase tracking-wide mb-3">Strengths</p>
          <ul className="space-y-2.5">
            {data.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-brand-text leading-relaxed">{s}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-brand-border rounded-xl p-5">
          <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide mb-3">Weaknesses</p>
          <ul className="space-y-2.5">
            {data.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertCircle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-brand-text leading-relaxed">{w}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-brand-border rounded-xl p-5">
          <p className="text-[11px] font-semibold text-brand-primary uppercase tracking-wide mb-3">Suggestions</p>
          <ul className="space-y-2.5">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <ArrowRight className="size-3.5 text-brand-primary shrink-0 mt-0.5" />
                <p className="text-[12px] text-brand-text leading-relaxed">{s}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended keywords */}
      <div className="border border-brand-border rounded-xl p-5">
        <p className="text-[11px] font-semibold text-brand-text uppercase tracking-wide mb-3">Recommended Keywords to Add</p>
        <div className="flex flex-wrap gap-2">
          {data.keywords.map((k, i) => (
            <span key={i} className="text-[11px] font-medium bg-brand-primary/8 text-brand-primary px-2.5 py-1 rounded-md border border-brand-primary/20">
              {k}
            </span>
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

export default function ResumePage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("CV");
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
                  <ParsedDocument resume={resume} onUpload={(file) => upload(file)} />
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
    </div>
  );
}
