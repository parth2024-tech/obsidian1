"use client"

import * as React from "react"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { FileIcon, X, Pin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WorkspaceTab } from "@/lib/vault/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useWorkspaceStore()

  if (tabs.length === 0) {
    return <div className="h-10 border-b bg-background flex items-center px-4 text-sm text-muted-foreground">No open files</div>
  }

  return (
    <div className="h-10 border-b bg-background flex items-center">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-0">
          {tabs.map((tab) => (
            <TabItem 
              key={tab.id} 
              tab={tab} 
              isActive={tab.id === activeTabId}
              onClick={() => setActiveTab(tab.id)}
              onClose={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </div>
  )
}

function TabItem({ tab, isActive, onClick, onClose }: { 
  tab: WorkspaceTab, 
  isActive: boolean, 
  onClick: () => void, 
  onClose: (e: React.MouseEvent) => void 
}) {
  const { closeAllTabs, closeOtherTabs, pinTab } = useWorkspaceStore()
  
  // Extract display name from filePath
  const parts = tab.filePath.split('/')
  const name = parts[parts.length - 1] || tab.filePath

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          onClick={onClick}
          className={cn(
            "group flex items-center h-10 px-4 min-w-[120px] max-w-[200px] border-r cursor-pointer transition-colors text-sm",
            isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"
          )}
        >
          {tab.isPinned ? (
            <Pin className="h-4 w-4 mr-2 shrink-0 opacity-50" />
          ) : (
            <FileIcon className="h-4 w-4 mr-2 shrink-0 opacity-50" />
          )}
          <span className="truncate flex-1">{name}</span>
          {tab.isUnsaved && (
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 ml-1" />
          )}
          <button 
            onClick={onClose}
            className="ml-2 p-1 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-background/50 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onClose}>Close</DropdownMenuItem>
        <DropdownMenuItem onClick={() => closeOtherTabs(tab.id)}>Close Others</DropdownMenuItem>
        <DropdownMenuItem onClick={() => closeAllTabs()}>Close All</DropdownMenuItem>
        <DropdownMenuItem onClick={() => pinTab(tab.id)}>
          {tab.isPinned ? "Unpin" : "Pin"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
