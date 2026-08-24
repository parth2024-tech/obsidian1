"use client"

import * as React from "react"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { FolderTree, Search, Tags, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileTree } from "@/components/file-explorer/file-tree"

export function SidebarLeft() {
  const { leftSidebarOpen, toggleLeftSidebar, activeLeftTab, setActiveLeftTab } = useWorkspaceStore()

  if (!leftSidebarOpen) return null

  return (
    <div className="h-full w-full flex flex-col bg-background border-r">
      <div className="h-10 flex items-center border-b px-2">
        <div className="flex flex-1 space-x-1">
          <TabButton 
            active={activeLeftTab === 'files'} 
            onClick={() => setActiveLeftTab('files')}
            icon={<FolderTree size={16} />} 
          />
          <TabButton 
            active={activeLeftTab === 'search'} 
            onClick={() => setActiveLeftTab('search')}
            icon={<Search size={16} />} 
          />
          <TabButton 
            active={activeLeftTab === 'tags'} 
            onClick={() => setActiveLeftTab('tags')}
            icon={<Tags size={16} />} 
          />
        </div>
        <button 
          onClick={toggleLeftSidebar}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeLeftTab === 'files' && (
          <div className="h-full">
            <FileTree />
          </div>
        )}
        {activeLeftTab === 'search' && (
          <div className="p-2 text-sm text-muted-foreground">Search Placeholder</div>
        )}
        {activeLeftTab === 'tags' && (
          <div className="p-2 text-sm text-muted-foreground">Tags Placeholder</div>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-md flex items-center justify-center transition-colors",
        active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
    </button>
  )
}
