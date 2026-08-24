"use client";

import { useWorkspaceStore } from "@/stores/workspace-store";
import { useMetadataStore } from "@/stores/metadata-store";
import { BacklinkEntry } from "@/lib/vault/types";

export function BacklinksPanel() {
  const { activeTabId } = useWorkspaceStore();
  const { getBacklinks } = useMetadataStore();
  
  if (!activeTabId) return <div className="p-4 text-sm text-muted-foreground">No file selected</div>;
  
  const backlinks = getBacklinks(activeTabId) || [];
  
  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-[var(--sidebar-foreground)]">
      <div className="p-2 font-semibold text-sm border-b border-[var(--sidebar-border)]">Backlinks</div>
      <div className="flex-1 overflow-auto p-2">
        {backlinks.length === 0 ? (
          <div className="text-sm text-muted-foreground">No backlinks found</div>
        ) : (
          <div>
            <div className="text-xs font-semibold mb-2">Linked Mentions ({backlinks.length})</div>
            {backlinks.map((link, i) => (
              <div key={i} className="mb-3 p-2 bg-[var(--background)] border border-[var(--sidebar-border)] rounded cursor-pointer hover:border-[var(--primary)] text-sm">
                <div className="font-medium text-[var(--primary)]">{link.sourcePath.split('/').pop()}</div>
                <div className="text-muted-foreground text-xs mt-1 truncate">
                  ...{link.raw}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
