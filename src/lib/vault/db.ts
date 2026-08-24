import Dexie, { type Table } from 'dexie';
import type { CachedMetadata } from './types';

/**
 * Interface representing a file stored in Dexie IndexedDB fallback.
 */
export interface DBFile {
  path: string;
  content: string;
  mtime: number;
  ctime: number;
  size: number;
}

/**
 * Interface representing metadata stored in Dexie IndexedDB fallback.
 */
export interface DBMetadata {
  path: string;
  metadata: CachedMetadata;
}

/**
 * Interface representing a generic setting stored in Dexie IndexedDB fallback.
 */
export interface DBSetting {
  key: string;
  value: unknown;
}

/**
 * VaultDB class extending Dexie for IndexedDB fallback storage.
 */
export class VaultDB extends Dexie {
  files!: Table<DBFile, string>;
  metadata!: Table<DBMetadata, string>;
  settings!: Table<DBSetting, string>;

  constructor() {
    super('VaultDatabase');
    this.version(1).stores({
      files: 'path', // path is the primary key
      metadata: 'path',
      settings: 'key'
    });
  }
}

/**
 * Singleton instance of the VaultDB.
 */
export const vaultDB = new VaultDB();
