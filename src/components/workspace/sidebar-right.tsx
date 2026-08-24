"use client"

import * as React from "react"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { Link2, List, FileText, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { BacklinksPanel } from "@/components/panels/backlinks-panel"
import { OutlinePanel } from "@/components/panels/outline-panel"
import { PropertiesPanel } from "@/components/panels/properties-panel"

export function SidebarRight() {
  const { rightSidebarOpen, toggleRightSidebar, activeRightTab, setActiveRightTab } = useWorkspaceStore()

  if (!rightSidebarOpen) return null

  return (
    <div className="h-full w-full flex flex-col bg-background border-l">
      <div className="h-10 flex items-center border-b px-2">
        <button 
          onClick={toggleRightSidebar}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground mr-1"
        >
          <ChevronRight size={16} />
        </button>
        <div className="flex flex-1 space-x-1 justify-end">
          <TabButton 
            active={activeRightTab === 'backlinks'} 
            onClick={() => setActiveRightTab('backlinks')}
            icon={<Link2 size={16} />} 
          />
          <TabButton 
            active={activeRightTab === 'outline'} 
            onClick={() => setActiveRightTab('outline')}
            icon={<List size={16} />} 
          />
          <TabButton 
            active={activeRightTab === 'properties'} 
            onClick={() => setActiveRightTab('properties')}
            icon={<FileText size={16} />} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeRightTab === 'backlinks' && <BacklinksPanel />}
        {activeRightTab === 'outline' && <OutlinePanel />}
        {activeRightTab === 'properties' && <PropertiesPanel />}
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
