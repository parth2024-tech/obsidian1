"use client"

import * as React from "react"
import { FileText, Search, Network, Calendar, Settings, Moon, Sun, HelpCircle } from "lucide-react"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useThemeStore } from "@/stores/theme-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Ribbon() {
  const { toggleLeftSidebar, setActiveLeftTab } = useWorkspaceStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleSearch = () => {
    setActiveLeftTab('search')
    toggleLeftSidebar()
  }

  return (
    <div className="w-12 h-full bg-background border-r flex flex-col items-center py-2 space-y-4">
      <TooltipProvider delayDuration={200}>
        <div className="flex-1 w-full flex flex-col items-center space-y-2">
          <RibbonAction icon={<FileText size={20} />} label="New Note" onClick={() => {}} />
          <RibbonAction icon={<Search size={20} />} label="Search" onClick={handleSearch} />
          <RibbonAction icon={<Network size={20} />} label="Graph View" onClick={() => {}} />
          <RibbonAction icon={<Calendar size={20} />} label="Daily Note" onClick={() => {}} />
        </div>
        
        <div className="w-full flex flex-col items-center space-y-2 pb-2">
          <RibbonAction icon={<Settings size={20} />} label="Settings" onClick={() => {}} />
          <RibbonAction 
            icon={theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />} 
            label="Toggle Theme" 
            onClick={toggleTheme} 
          />
          <RibbonAction icon={<HelpCircle size={20} />} label="Help" onClick={() => {}} />
        </div>
      </TooltipProvider>
    </div>
  )
}

function RibbonAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={onClick}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
