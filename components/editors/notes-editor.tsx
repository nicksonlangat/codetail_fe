"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Bold, Italic, Code, Heading2, List, ListOrdered, Quote, CodeSquare } from "lucide-react";
import "./notes-editor.css";

const lowlight = createLowlight(common);

interface NotesEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export function NotesEditor({ content = "", onChange }: NotesEditorProps) {
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
        placeholder: "Write your notes here... Use markdown shortcuts like #, >, -, ```",
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "notes-editor outline-none min-h-40 px-5 py-4 text-[13px] leading-relaxed",
      },
    },
  });

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
      <div className="flex items-center gap-0.5 px-4 h-9 border-b border-brand-border bg-brand-surface/50 shrink-0">
        {tools.map((tool, i) =>
          tool.icon === null ? (
            <div key={i} className="w-px h-4 bg-brand-border mx-1" />
          ) : (
            <button
              key={tool.title}
              type="button"
              onClick={tool.action}
              title={tool.title}
              className={`p-1.5 rounded-md cursor-pointer transition-all duration-500 ${
                tool.active
                  ? "bg-brand-primary/15 text-brand-primary"
                  : "text-brand-text-muted hover:text-brand-text hover:bg-brand-surface"
              }`}
            >
              <tool.icon className="size-3.5" />
            </button>
          )
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between px-4 h-7 border-t border-brand-border shrink-0">
        <span className="text-[10px] text-brand-text-subtle tabular-nums font-mono">
          {editor.getText().length} chars
        </span>
      </div>
    </div>
  );
}
