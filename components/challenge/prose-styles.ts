// Shared brand-styled prose recipe for TipTapRenderer instances in the
// challenge page (problem description, AI solution write-up) — one style
// definition instead of restyling each call site separately.
export const PROSE_CLASS =
  "text-[13px] leading-relaxed text-brand-text " +
  "[&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-brand-text [&_h1]:mt-4 [&_h1]:mb-1.5 [&_h1]:first:mt-0 " +
  "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-brand-text [&_h2]:mt-4 [&_h2]:mb-1.5 [&_h2]:first:mt-0 " +
  "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-text [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:first:mt-0 " +
  "[&_p]:text-brand-text-muted [&_p]:mb-2 [&_p]:leading-relaxed " +
  "[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ul]:text-brand-text-muted [&_ul]:mb-2 " +
  "[&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_ol]:text-brand-text-muted [&_ol]:mb-2 " +
  "[&_strong]:text-brand-text [&_strong]:font-semibold " +
  "[&_pre]:bg-brand-surface [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre]:my-2 " +
  "[&_code]:font-mono [&_code]:text-[12px] " +
  "[&_p_code]:bg-brand-surface [&_p_code]:px-1 [&_p_code]:py-0.5 [&_p_code]:rounded [&_p_code]:text-brand-text " +
  "[&_li_code]:bg-brand-surface [&_li_code]:px-1 [&_li_code]:py-0.5 [&_li_code]:rounded [&_li_code]:text-brand-text";
