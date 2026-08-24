"use client"

import * as React from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FileIcon } from "lucide-react"
import { useVaultStore } from "@/stores/vault-store"
import { useWorkspaceStore } from "@/stores/workspace-store"

export function QuickSwitcher() {
  const [open, setOpen] = React.useState(false)
  const { files } = useVaultStore()
  const { openTab } = useWorkspaceStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = React.useCallback((path: string) => {
    setOpen(false)
    openTab(path)
  }, [openTab])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to open a file..." />
      <CommandList>
        <CommandEmpty>No files found.</CommandEmpty>
        <CommandGroup heading="Recent Files">
          {/* Mock recent files - in real app, track recent files in store */}
          {Array.from(files.values()).slice(0, 5).map(file => (
            <CommandItem 
              key={file.path} 
              onSelect={() => handleSelect(file.path)}
              value={file.name} // Used for fuzzy matching
            >
              <FileIcon className="mr-2 h-4 w-4" />
              <span>{file.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{file.path}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="All Files">
          {Array.from(files.values()).map(file => (
            <CommandItem 
              key={file.path} 
              onSelect={() => handleSelect(file.path)}
              value={file.name}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              <span>{file.name}</span>
              <span className="ml-auto text-xs text-muted-foreground opacity-0">{file.path}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
