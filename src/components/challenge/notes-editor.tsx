"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Code, Heading2, List, ListOrdered, Quote, CodeSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveNotes } from "@/lib/api/progress";
import "./notes-editor.css";

const lowlight = createLowlight(common);

interface NotesEditorProps {
  problemId: string;
  initialNotes?: string | null;
}

export function NotesEditor({ problemId, initialNotes }: NotesEditorProps) {
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const initialized = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "python",
      }),
      Placeholder.configure({
        placeholder: "Write your notes here… Use markdown shortcuts like #, >, -, ```",
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "notes-editor outline-none min-h-[200px] px-5 py-4 text-[13px] leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      if (!initialized.current) return;
      const html = editor.getHTML();

      // Save to localStorage as immediate backup
      try { localStorage.setItem(`codetail-notes-${problemId}`, html); } catch {}

      // Debounced save to API
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveNotes(problemId, html).then(() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }).catch(() => {});
      }, 1000);
    },
  });

  // Load: API notes > localStorage > empty
  useEffect(() => {
    if (!editor || initialized.current) return;

    const content = initialNotes
      || localStorage.getItem(`codetail-notes-${problemId}`)
      || "";

    editor.commands.setContent(content);
    initialized.current = true;
  }, [editor, problemId, initialNotes]);

  // Reset when navigating to a different problem
  useEffect(() => {
    initialized.current = false;
  }, [problemId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  if (!editor) return null;

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code"), title: "Code" },
    { icon: null, action: () => {}, active: false, title: "sep" },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), title: "Heading" },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), title: "Bullets" },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), title: "Numbered" },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), title: "Quote" },
    { icon: CodeSquare, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock"), title: "Code block" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-0.5 px-4 h-9 border-b border-border bg-muted/50 dark:bg-card/50 dark:border-border/40 flex-shrink-0">
        {tools.map((tool, i) =>
          tool.icon === null ? (
            <div key={i} className="w-px h-4 bg-border/40 mx-1" />
          ) : (
            <button key={tool.title} type="button" onClick={tool.action} title={tool.title}
              className={cn(
                "p-1.5 rounded-md cursor-pointer transition-all duration-500",
                tool.active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}>
              <tool.icon className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between px-4 h-7 border-t border-border dark:border-border/40 flex-shrink-0">
        <span className="text-[10px] text-muted-foreground tabular-nums font-mono">
          {editor.getText().length} chars
        </span>
        <span className={cn("text-[10px] text-primary transition-opacity duration-300", saved ? "opacity-100" : "opacity-0")}>
          Saved
        </span>
      </div>
    </div>
  );
}
