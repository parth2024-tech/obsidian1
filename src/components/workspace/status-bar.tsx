"use client"

import * as React from "react"
import { useVaultStore } from "@/stores/vault-store"
import { useWorkspaceStore } from "@/stores/workspace-store"

export function StatusBar() {
  const { files } = useVaultStore()
  const { activeTabId } = useWorkspaceStore()
  
  const fileCount = files.size
  
  return (
    <div className="h-6 w-full border-t bg-background flex items-center justify-between px-3 text-[11px] text-muted-foreground select-none">
      <div className="flex items-center space-x-4">
        <span>Obsidian1 Vault</span>
        <span>{fileCount} files</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <span>Ln 1, Col 1</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <span>0 words</span>
        <span>0 characters</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}
