"use client";

import { useWorkspaceStore } from "@/stores/workspace-store";
import { useMetadataStore } from "@/stores/metadata-store";
import { Plus, X } from "lucide-react";

export function PropertiesPanel() {
  const { activeTabId } = useWorkspaceStore();
  const { cache } = useMetadataStore();
  
  if (!activeTabId) return <div className="p-4 text-sm text-muted-foreground">No file selected</div>;
  
  const metadata = cache.get(activeTabId);
  const frontmatter = metadata?.frontmatter || {};
  const keys = Object.keys(frontmatter);

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] text-[var(--sidebar-foreground)]">
      <div className="p-2 font-semibold text-sm border-b border-[var(--sidebar-border)]">Properties</div>
      <div className="flex-1 overflow-auto p-2">
        {keys.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">No properties</div>
        ) : (
          <div className="flex flex-col gap-2">
            {keys.map(key => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <input 
                  type="text" 
                  value={key} 
                  readOnly 
                  className="w-1/3 bg-transparent border border-[var(--border)] rounded px-1.5 py-1 text-muted-foreground"
                />
                <input 
                  type="text" 
                  defaultValue={String(frontmatter[key])} 
                  className="flex-1 bg-transparent border border-[var(--border)] rounded px-1.5 py-1"
                />
                <button className="text-muted-foreground hover:text-[var(--destructive)]">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button className="mt-4 w-full flex items-center justify-center gap-1 text-sm bg-[var(--accent)] hover:bg-[var(--muted)] p-1.5 rounded">
          <Plus size={16} />
          Add Property
        </button>
      </div>
    </div>
  );
}
