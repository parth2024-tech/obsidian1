"use client";

import { useWorkspaceStore } from "@/stores/workspace-store";
import { useMetadataStore } from "@/stores/metadata-store";

export function OutlinePanel() {
  const { activeTabId } = useWorkspaceStore();
  const { cache } = useMetadataStore();
  
  if (!activeTabId) return <div className="p-4 text-sm text-muted-foreground">No file selected</div>;
  
  const metadata = cache.get(activeTabId);
  const headings = metadata?.headings || [];

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-[var(--sidebar-foreground)]">
      <div className="p-2 font-semibold text-sm border-b border-[var(--sidebar-border)]">Outline</div>
      <div className="flex-1 overflow-auto p-2">
        {headings.length === 0 ? (
          <div className="text-sm text-muted-foreground">No headings found</div>
        ) : (
          <div className="flex flex-col gap-1">
            {headings.map((h, i) => (
              <div 
                key={i} 
                className="text-sm cursor-pointer hover:text-[var(--primary)] truncate"
                style={{ paddingLeft: `${(h.level - 1) * 16}px` }}
              >
                {h.heading}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
