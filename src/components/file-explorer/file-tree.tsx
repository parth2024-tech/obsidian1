"use client";

import { useVaultStore } from "@/stores/vault-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { FileTreeItem } from "./file-tree-item";
import { FolderPlus, FilePlus, ChevronsDownUp } from "lucide-react";
import { useState } from "react";
import { VaultEntry } from "@/lib/vault/types";

export function FileTree() {
  const { fileTree, createFile } = useVaultStore();
  const { openTab } = useWorkspaceStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]));

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const handleFileClick = (path: string) => {
    openTab(path);
  };

  const renderTree = (entries: VaultEntry[], depth = 0) => {
    return entries.map(entry => (
      <div key={entry.path}>
        <FileTreeItem 
          entry={entry} 
          depth={depth} 
          isExpanded={expandedFolders.has(entry.path)}
          onToggle={() => entry.type === 'folder' && toggleFolder(entry.path)}
          onClick={() => entry.type === 'file' ? handleFileClick(entry.path) : toggleFolder(entry.path)}
        />
        {entry.type === 'folder' && expandedFolders.has(entry.path) && entry.children && (
          <div>
            {/* assuming we resolve children paths to VaultEntry objects in the store, 
                for this example we pretend entry.children are VaultEntry[] or handle accordingly */}
            {renderTree((entry as any).resolvedChildren || [], depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-[var(--sidebar-foreground)]">
      <div className="flex items-center justify-between p-2 border-b border-[var(--sidebar-border)]">
        <span className="font-semibold text-sm">Explorer</span>
        <div className="flex gap-1">
          <button onClick={() => createFile('/', 'Untitled.md')} className="p-1 hover:bg-[var(--accent)] rounded" title="New Note">
            <FilePlus size={16} />
          </button>
          <button className="p-1 hover:bg-[var(--accent)] rounded" title="New Folder">
            <FolderPlus size={16} />
          </button>
          <button onClick={() => setExpandedFolders(new Set())} className="p-1 hover:bg-[var(--accent)] rounded" title="Collapse All">
            <ChevronsDownUp size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-1">
        {renderTree(fileTree())}
      </div>
    </div>
  );
}
