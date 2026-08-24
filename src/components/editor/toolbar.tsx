"use client";

import { EditorView } from "codemirror";
import { 
  Bold, Italic, Strikethrough, Link, Image, Code, 
  SquareTerminal, List, ListOrdered, CheckSquare, 
  Quote, Minus, Heading1
} from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function EditorToolbar({ editorView }: { editorView: EditorView | null }) {
  const insertText = (before: string, after: string = "") => {
    if (!editorView) return;
    const { state, dispatch } = editorView;
    const selection = state.selection.main;
    const text = state.sliceDoc(selection.from, selection.to);
    
    dispatch({
      changes: { from: selection.from, to: selection.to, insert: `${before}${text}${after}` },
      selection: { anchor: selection.from + before.length, head: selection.from + before.length + text.length }
    });
    editorView.focus();
  };

  const insertLinePrefix = (prefix: string) => {
    if (!editorView) return;
    const { state, dispatch } = editorView;
    const line = state.doc.lineAt(state.selection.main.head);
    
    dispatch({
      changes: { from: line.from, to: line.from, insert: prefix }
    });
    editorView.focus();
  };

  const buttons = [
    { icon: <Bold size={16} />, onClick: () => insertText("**", "**"), tooltip: "Bold" },
    { icon: <Italic size={16} />, onClick: () => insertText("*", "*"), tooltip: "Italic" },
    { icon: <Strikethrough size={16} />, onClick: () => insertText("~~", "~~"), tooltip: "Strikethrough" },
    { icon: <Heading1 size={16} />, onClick: () => insertLinePrefix("# "), tooltip: "Heading 1" },
    { icon: <Link size={16} />, onClick: () => insertText("[[", "]]"), tooltip: "Wikilink" },
    { icon: <Image size={16} />, onClick: () => insertText("![[", "]]"), tooltip: "Embed Image" },
    { icon: <Code size={16} />, onClick: () => insertText("`", "`"), tooltip: "Inline Code" },
    { icon: <SquareTerminal size={16} />, onClick: () => insertText("```\n", "\n```"), tooltip: "Code Block" },
    { icon: <List size={16} />, onClick: () => insertLinePrefix("- "), tooltip: "Bulleted List" },
    { icon: <ListOrdered size={16} />, onClick: () => insertLinePrefix("1. "), tooltip: "Numbered List" },
    { icon: <CheckSquare size={16} />, onClick: () => insertLinePrefix("- [ ] "), tooltip: "Checkbox" },
    { icon: <Quote size={16} />, onClick: () => insertLinePrefix("> "), tooltip: "Quote" },
    { icon: <Minus size={16} />, onClick: () => insertText("\n---\n"), tooltip: "Horizontal Rule" },
  ];

  return (
    <div className="flex items-center justify-between p-2 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="flex items-center space-x-1">
        {buttons.map((btn, i) => (
          <button 
            key={i} 
            onClick={btn.onClick}
            title={btn.tooltip}
            className="p-1.5 rounded hover:bg-[var(--accent)] text-[var(--foreground)]"
          >
            {btn.icon}
          </button>
        ))}
      </div>
      <div>
        <select className="bg-transparent border border-[var(--border)] text-[var(--foreground)] rounded p-1 text-sm">
          <option value="source">Source</option>
          <option value="live-preview">Live Preview</option>
          <option value="reading">Reading</option>
        </select>
      </div>
    </div>
  );
}
