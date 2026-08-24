"use client";

import { useRouter } from "next/navigation";
import { useVaultStore } from "@/stores/vault-store";

export default function Home() {
  const router = useRouter();
  const { openVault } = useVaultStore();

  const handleOpenVault = async () => {
    // In a real implementation this would trigger File System Access API
    // await openVault();
    router.push("/vault");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-[var(--background)]">
      <div className="w-full max-w-md bg-[var(--card)] text-[var(--card-foreground)] p-8 rounded-xl shadow-lg border border-[var(--border)] text-center">
        <h1 className="text-4xl font-bold mb-2">Obsidian1</h1>
        <p className="text-muted-foreground mb-8">Your knowledge, your way</p>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleOpenVault}
            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-2 px-4 rounded hover:opacity-90 font-medium"
          >
            Open Vault
          </button>
          <button 
            className="w-full bg-[var(--secondary)] text-[var(--secondary-foreground)] py-2 px-4 rounded hover:opacity-90 font-medium"
          >
            Create New Vault
          </button>
        </div>

        <div className="mt-12 text-left">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Recent Vaults</h3>
          <div className="flex flex-col gap-2">
            {/* Placeholder for recent vaults */}
            <div className="p-3 bg-[var(--accent)] rounded cursor-pointer hover:border-[var(--primary)] border border-transparent transition-colors">
              <div className="font-medium">Personal Knowledge</div>
              <div className="text-xs text-muted-foreground">/Users/thor/Documents/Vault</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
