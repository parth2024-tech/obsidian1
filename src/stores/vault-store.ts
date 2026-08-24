import { create } from 'zustand';
import type { VaultEntry, FilePath, VaultConfig, TFile, TFolder } from '@/lib/vault/types';
import { VaultFileSystem } from '@/lib/vault/filesystem';

interface VaultState {
  files: Map<FilePath, VaultEntry>;
  activeFilePath: FilePath | null;
  vaultConfig: VaultConfig | null;
  isLoading: boolean;
  error: string | null;
  fileSystem: VaultFileSystem | null;
  fileTree: () => VaultEntry[]; 
  
  openVault: () => Promise<void>;
  openFile: (path: FilePath) => void;
  createFile: (path: FilePath, content?: string) => Promise<void>;
  createFolder: (path: FilePath) => Promise<void>;
  deleteFile: (path: FilePath) => Promise<void>;
  renameFile: (oldPath: FilePath, newPath: FilePath) => Promise<void>;
  readFileContent: (path: FilePath) => Promise<string>;
  writeFileContent: (path: FilePath, content: string) => Promise<void>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  files: new Map(),
  activeFilePath: null,
  vaultConfig: null,
  isLoading: false,
  error: null,
  fileSystem: null,

  fileTree: () => {
    const { files } = get();
    return Array.from(files.values());
  },

  openVault: async () => {
    set({ isLoading: true, error: null });
    try {
      const fs = new VaultFileSystem();
      await fs.openVault();
      const entries = await fs.listAllFiles();
      const filesMap = new Map<FilePath, VaultEntry>();
      entries.forEach(entry => filesMap.set(entry.path, entry));
      
      set({ fileSystem: fs, files: filesMap, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  openFile: (path) => {
    set({ activeFilePath: path });
  },

  createFile: async (path, content = '') => {
    const { fileSystem, files } = get();
    if (!fileSystem) return;
    await fileSystem.writeFile(path, content);
    const newFiles = new Map(files);
    newFiles.set(path, {
      path,
      name: path.split('/').pop() || '',
      parent: path.split('/').slice(0, -1).join('/') || null,
      type: 'file',
      extension: path.split('.').pop() || '',
      size: new Blob([content]).size,
      mtime: Date.now(),
      ctime: Date.now()
    } as TFile);
    set({ files: newFiles });
  },

  createFolder: async (path) => {
    const { fileSystem, files } = get();
    if (!fileSystem) return;
    await fileSystem.createFolder(path);
    const newFiles = new Map(files);
    newFiles.set(path, {
      path,
      name: path.split('/').pop() || '',
      parent: path.split('/').slice(0, -1).join('/') || null,
      type: 'folder',
      children: [],
      mtime: Date.now(),
      ctime: Date.now()
    } as TFolder);
    set({ files: newFiles });
  },

  deleteFile: async (path) => {
    const { fileSystem, files, activeFilePath } = get();
    if (!fileSystem) return;
    await fileSystem.deleteFile(path);
    const newFiles = new Map(files);
    newFiles.delete(path);
    set({ 
      files: newFiles,
      activeFilePath: activeFilePath === path ? null : activeFilePath 
    });
  },

  renameFile: async (oldPath, newPath) => {
    const { fileSystem, files, activeFilePath } = get();
    if (!fileSystem) return;
    await fileSystem.renameFile(oldPath, newPath);
    const newFiles = new Map(files);
    const entry = newFiles.get(oldPath);
    if (entry) {
      newFiles.delete(oldPath);
      entry.path = newPath;
      entry.name = newPath.split('/').pop() || '';
      newFiles.set(newPath, entry);
    }
    set({ 
      files: newFiles,
      activeFilePath: activeFilePath === oldPath ? newPath : activeFilePath 
    });
  },

  readFileContent: async (path) => {
    const { fileSystem } = get();
    if (!fileSystem) throw new Error('No vault opened');
    return await fileSystem.readFile(path);
  },

  writeFileContent: async (path, content) => {
    const { fileSystem } = get();
    if (!fileSystem) throw new Error('No vault opened');
    await fileSystem.writeFile(path, content);
  }
}));
