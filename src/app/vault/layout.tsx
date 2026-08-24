"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { FileTree } from "@/components/file-explorer/file-tree";
import { BacklinksPanel } from "@/components/panels/backlinks-panel";
import { OutlinePanel } from "@/components/panels/outline-panel";
import { PropertiesPanel } from "@/components/panels/properties-panel";

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  const { leftSidebarOpen, rightSidebarOpen } = useWorkspaceStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--background)] overflow-hidden">
      {/* Ribbon / Topbar placeholder */}
      <div className="h-10 border-b border-[var(--border)] flex items-center px-4 shrink-0 bg-[var(--card)]">
        <span className="font-semibold text-sm">Obsidian1</span>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {leftSidebarOpen && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <FileTree />
              </Panel>
              <PanelResizeHandle className="w-1 bg-[var(--border)] hover:bg-[var(--primary)] transition-colors cursor-col-resize" />
            </>
          )}
          
          <Panel className="bg-[var(--background)] relative">
            {children}
          </Panel>
          
          {rightSidebarOpen && (
            <>
              <PanelResizeHandle className="w-1 bg-[var(--border)] hover:bg-[var(--primary)] transition-colors cursor-col-resize" />
              <Panel defaultSize={20} minSize={15} maxSize={30} className="flex flex-col bg-[var(--sidebar-bg)] border-l border-[var(--border)]">
                <div className="flex-1 overflow-hidden"><PropertiesPanel /></div>
                <div className="flex-1 border-t border-[var(--border)] overflow-hidden"><OutlinePanel /></div>
                <div className="flex-1 border-t border-[var(--border)] overflow-hidden"><BacklinksPanel /></div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* StatusBar placeholder */}
      <div className="h-6 border-t border-[var(--border)] bg-[var(--card)] flex items-center px-2 text-xs text-muted-foreground shrink-0">
        <span>Ready</span>
      </div>
    </div>
  );
}
