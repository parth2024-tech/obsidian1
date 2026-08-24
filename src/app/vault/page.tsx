"use client";

import { useWorkspaceStore } from "@/stores/workspace-store";
import { useVaultStore } from "@/stores/vault-store";
import { MarkdownEditor } from "@/components/editor/editor";
import { EditorToolbar } from "@/components/editor/toolbar";
import { FileText } from "lucide-react";

/**
 * Extracts the display name from a file path (basename without extension).
 */
function getTabTitle(filePath: string): string {
  const basename = filePath.split("/").pop() ?? filePath;
  return basename.replace(/\.md$/, "");
}

/** Main vault workspace page — renders tabs and the active editor or empty state. */
export default function VaultPage() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useWorkspaceStore();
  const { writeFileContent } = useVaultStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar (inline — duplicates tab-bar.tsx for page-level control) */}
      {tabs.length > 0 && (
        <div className="flex border-b border-[var(--border)] bg-[var(--card)] overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm flex items-center gap-2 cursor-pointer border-r border-[var(--border)] min-w-[120px] max-w-[200px] ${
                activeTabId === tab.id
                  ? "bg-[var(--background)] font-medium"
                  : "hover:bg-[var(--accent)] text-muted-foreground"
              }`}
            >
              <FileText size={14} className="shrink-0 opacity-60" />
              <span className="truncate flex-1">
                {getTabTitle(tab.filePath)}
              </span>
              {tab.isUnsaved && (
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="hover:bg-[var(--muted)] p-0.5 rounded-full opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab ? (
          <>
            <EditorToolbar editorView={null} />
            <div className="flex-1 overflow-hidden">
              <MarkdownEditor
                filePath={activeTab.filePath}
                content=""
                onChange={(content) => {
                  writeFileContent(activeTab.filePath, content);
                }}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-4">
            <div className="text-4xl font-bold opacity-10">O1</div>
            <p className="text-sm">
              Open a file from the sidebar or press{" "}
              <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] text-xs bg-[var(--muted)]">
                ⌘O
              </kbd>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
