"use client";

import { VaultEntry } from "@/lib/vault/types";
import { Folder, FolderOpen, FileText, File } from "lucide-react";

export interface FileTreeItemProps {
  entry: VaultEntry;
  depth: number;
  isExpanded?: boolean;
  isActive?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

export function FileTreeItem({ entry, depth, isExpanded, isActive, onToggle, onClick }: FileTreeItemProps) {
  const isFolder = entry.type === 'folder';
  
  const getIcon = () => {
    if (isFolder) return isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />;
    if ((entry as any).extension === 'md') return <FileText size={16} />;
    return <File size={16} />;
  };

  return (
    <div 
      className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[var(--accent)] rounded text-sm ${isActive ? 'bg-[var(--accent)]' : ''}`}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
      onClick={onClick}
    >
      <div className="mr-1.5 text-muted-foreground" onClick={(e) => { e.stopPropagation(); onToggle?.(); }}>
        {getIcon()}
      </div>
      <span className="truncate flex-1">{entry.name}</span>
    </div>
  );
}
