"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { ComponentPropsWithoutRef } from "react";

interface MarkdownContentProps {
  children: string;
  className?: string;
}

export function MarkdownContent({ children, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose-chat ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          p({ children }) {
            return <p className="text-[12px] leading-relaxed text-foreground mb-2 last:mb-0">{children}</p>;
          },
          code({ className: cls, children, ...props }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
            const isBlock = cls?.includes("language-");
            if (isBlock) {
              return (
                <code className={`${cls} text-[11px] font-mono`} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded text-primary" {...props}>
                {children}
              </code>
            );
          },
          pre({ children }) {
            return (
              <pre className="text-[11px] rounded-xl bg-muted border border-border/50 p-3 overflow-x-auto my-2 font-mono">
                {children}
              </pre>
            );
          },
          strong({ children }) {
            return <strong className="font-semibold text-foreground">{children}</strong>;
          },
          h3({ children }) {
            return <h3 className="text-[12px] font-semibold text-foreground mt-3 mb-1">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-3 mb-1">{children}</h4>;
          },
          ul({ children }) {
            return <ul className="text-[12px] space-y-0.5 pl-4 list-disc text-foreground mb-2">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="text-[12px] space-y-0.5 pl-4 list-decimal text-foreground mb-2">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          blockquote({ children }) {
            return <blockquote className="border-l-2 border-primary/40 pl-3 text-muted-foreground italic my-2">{children}</blockquote>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
