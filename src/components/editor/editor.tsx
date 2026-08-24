"use client";

import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState } from "@codemirror/state";
import { wikilinkExtension } from "./extensions/wikilink";
import { livePreviewExtension } from "./extensions/live-preview";
import { frontmatterExtension } from "./extensions/frontmatter";
import { EditorMode } from "@/lib/vault/types";

export interface EditorProps {
  filePath: string;
  content: string;
  onChange: (content: string) => void;
  mode?: EditorMode;
}

export function MarkdownEditor({ filePath, content, onChange, mode = 'source' }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        oneDark,
        markdown(),
        wikilinkExtension({
          onLinkClick: (target) => console.log("Navigating to", target),
          getFileNames: () => []
        }),
        frontmatterExtension(),
        ...(mode === 'live-preview' ? [livePreviewExtension()] : []),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              onChange(update.state.doc.toString());
            }, 500);
          }
        }),
        EditorView.domEventHandlers({
          "wikilink-click": (e: any) => {
            console.log("Wikilink clicked:", e.detail.target);
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // Mount only once, manage updates below

  useEffect(() => {
    const view = viewRef.current;
    if (view && view.state.doc.toString() !== content) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: content }
      });
    }
  }, [content, filePath]); // update if content or file changes

  return <div ref={editorRef} className="h-full w-full overflow-auto" />;
}
