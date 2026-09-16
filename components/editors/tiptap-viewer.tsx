"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { marked } from "marked";
import "./notes-editor.css";

const lowlight = createLowlight(common);

interface TiptapViewerProps {
  markdown: string;
  className?: string;
}

export function TiptapViewer({ markdown, className = "" }: TiptapViewerProps) {
  const html = marked.parse(markdown, { async: false }) as string;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: html,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `notes-editor tiptap-viewer outline-none ${className}`,
      },
    },
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
