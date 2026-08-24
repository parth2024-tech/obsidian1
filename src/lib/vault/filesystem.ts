import { vaultDB } from './db';
import type { TFile, TFolder, FilePath } from './types';

/**
 * VaultFileSystem class that abstracts file operations across Native FS and IndexedDB.
 */
export class VaultFileSystem {
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  public isUsingFallback: boolean = false;
  private watchTimer: NodeJS.Timeout | null = null;

  /**
   * Checks if the File System Access API is available.
   * @returns True if available, false otherwise.
   */
  public static supportsFileSystemAccess(): boolean {
    return 'showDirectoryPicker' in window;
  }

  /**
   * Opens a vault directory. Falls back to IndexedDB if API is unavailable or user cancels.
   */
  public async openVault(): Promise<void> {
    if (VaultFileSystem.supportsFileSystemAccess()) {
      try {
        this.directoryHandle = await (window as any).showDirectoryPicker({
          mode: 'readwrite',
        });
        this.isUsingFallback = false;
      } catch (error) {
        console.warn('Native FS not available or user cancelled, falling back to IndexedDB.', error);
        this.isUsingFallback = true;
      }
    } else {
      this.isUsingFallback = true;
    }
  }

  /**
   * Resolves a file or directory handle given a path.
   */
  private async getHandleByPath(path: string, create: boolean = false): Promise<FileSystemFileHandle | FileSystemDirectoryHandle | null> {
    if (!this.directoryHandle) return null;
    const parts = path.split('/').filter(Boolean);
    let currentHandle: FileSystemDirectoryHandle = this.directoryHandle;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        try {
          return await currentHandle.getFileHandle(part, { create });
        } catch (e) {
          try {
             return await currentHandle.getDirectoryHandle(part, { create });
          } catch(e2) {
             return null;
          }
        }
      } else {
        try {
          currentHandle = await currentHandle.getDirectoryHandle(part, { create });
        } catch (e) {
          return null;
        }
      }
    }
    return currentHandle;
  }

  /**
   * Reads a file content as string.
   */
  public async readFile(path: FilePath): Promise<string> {
    if (this.isUsingFallback) {
      const file = await vaultDB.files.get(path);
      if (!file) throw new Error(`File not found: ${path}`);
      return file.content;
    }

    const handle = await this.getHandleByPath(path);
    if (!handle || handle.kind !== 'file') throw new Error(`File not found: ${path}`);
    const file = await (handle as FileSystemFileHandle).getFile();
    return await file.text();
  }

  /**
   * Writes content to a file.
   */
  public async writeFile(path: FilePath, content: string): Promise<void> {
    if (this.isUsingFallback) {
      const now = Date.now();
      const existing = await vaultDB.files.get(path);
      await vaultDB.files.put({
        path,
        content,
        mtime: now,
        ctime: existing?.ctime || now,
        size: new Blob([content]).size,
      });
      return;
    }

    const handle = await this.getHandleByPath(path, true);
    if (!handle || handle.kind !== 'file') throw new Error(`Could not create/open file: ${path}`);
    const writable = await (handle as FileSystemFileHandle).createWritable();
    await writable.write(content);
    await writable.close();
  }

  /**
   * Deletes a file.
   */
  public async deleteFile(path: FilePath): Promise<void> {
    if (this.isUsingFallback) {
      await vaultDB.files.delete(path);
      return;
    }

    if (!this.directoryHandle) throw new Error('No vault opened');
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    if (!fileName) return;
    const parentPath = parts.join('/');
    const parentHandle = parentPath ? await this.getHandleByPath(parentPath) : this.directoryHandle;
    
    if (parentHandle && parentHandle.kind === 'directory') {
      await (parentHandle as FileSystemDirectoryHandle).removeEntry(fileName);
    }
  }

  /**
   * Renames or moves a file.
   */
  public async renameFile(oldPath: FilePath, newPath: FilePath): Promise<void> {
    const content = await this.readFile(oldPath);
    await this.writeFile(newPath, content);
    await this.deleteFile(oldPath);
  }

  /**
   * Creates a directory.
   */
  public async createFolder(path: FilePath): Promise<void> {
    if (this.isUsingFallback) {
      return;
    }
    
    if (!this.directoryHandle) throw new Error('No vault opened');
    const parts = path.split('/').filter(Boolean);
    let currentHandle = this.directoryHandle;
    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part, { create: true });
    }
  }

  /**
   * Lists all files and folders recursively.
   */
  public async listAllFiles(): Promise<(TFile | TFolder)[]> {
    if (this.isUsingFallback) {
      const files = await vaultDB.files.toArray();
      return files.map(f => {
        const parts = f.path.split('/');
        return {
          path: f.path,
          name: parts[parts.length - 1],
          parent: parts.length > 1 ? parts.slice(0, -1).join('/') : null,
          type: 'file',
          extension: f.path.split('.').pop() || '',
          size: f.size,
          mtime: f.mtime,
          ctime: f.ctime,
        } as TFile;
      });
    }

    if (!this.directoryHandle) return [];
    
    const entries: (TFile | TFolder)[] = [];
    
    const traverse = async (handle: FileSystemDirectoryHandle, currentPath: string) => {
      // @ts-ignore
      for await (const entry of handle.values()) {
        const path = currentPath ? `${currentPath}/${entry.name}` : entry.name;
        const parent = currentPath || null;
        
        if (entry.kind === 'file') {
          const fileHandle = entry as FileSystemFileHandle;
          const file = await fileHandle.getFile();
          entries.push({
            path,
            name: entry.name,
            parent,
            type: 'file',
            extension: entry.name.split('.').pop() || '',
            size: file.size,
            mtime: file.lastModified,
            ctime: file.lastModified,
          });
        } else if (entry.kind === 'directory') {
          entries.push({
            path,
            name: entry.name,
            parent,
            type: 'folder',
            children: [],
            mtime: Date.now(),
            ctime: Date.now(),
          });
          await traverse(entry as FileSystemDirectoryHandle, path);
        }
      }
    };

    await traverse(this.directoryHandle, '');
    return entries;
  }

  /**
   * Polls for changes.
   */
  public watchChanges(callback: () => void): void {
    if (this.watchTimer) clearInterval(this.watchTimer);
    if (!this.isUsingFallback) {
      this.watchTimer = setInterval(async () => {
      }, 5000);
    }
  }
}
