"use client"

import * as React from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command"
import { FileIcon, Settings, Moon, Plus } from "lucide-react"
import { useVaultStore } from "@/stores/vault-store"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useThemeStore } from "@/stores/theme-store"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const { files } = useVaultStore()
  const { openTab } = useWorkspaceStore()
  const { toggleTheme } = useThemeStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Commands">
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Note</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => toggleTheme())}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Files">
          {Array.from(files.values()).map(file => (
            <CommandItem 
              key={file.path} 
              onSelect={() => runCommand(() => openTab(file.path))}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              <span>{file.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
