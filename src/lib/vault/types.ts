/**
 * Type alias for a file path.
 */
export type FilePath = string;

/**
 * Base interface for an abstract file in the vault.
 */
export interface TAbstractFile {
  path: FilePath;
  name: string;
  parent: string | null;
}

/**
 * Interface for a file in the vault.
 */
export interface TFile extends TAbstractFile {
  type: 'file';
  extension: string;
  size: number;
  content?: string;
  mtime: number;
  ctime: number;
}

/**
 * Interface for a folder in the vault.
 */
export interface TFolder extends TAbstractFile {
  type: 'folder';
  children: FilePath[];
  mtime: number;
  ctime: number;
}

/**
 * Union type representing either a file or a folder.
 */
export type VaultEntry = TFile | TFolder;

export interface HeadingCache {
  heading: string;
  level: number;
  position: { start: number; end: number };
}

export interface LinkCache {
  link: string;
  displayText?: string;
  heading?: string;
  blockId?: string;
  original: string;
  position: { start: number; end: number };
}

export interface EmbedCache {
  link: string;
  original: string;
  position: { start: number; end: number };
}

export interface TagCache {
  tag: string;
  position: { start: number; end: number };
}

export interface BlockCache {
  id: string;
  position: { start: number; end: number };
}

export interface CachedMetadata {
  frontmatter?: Record<string, unknown>;
  headings?: HeadingCache[];
  links?: LinkCache[];
  embeds?: EmbedCache[];
  tags?: TagCache[];
  blocks?: Record<string, BlockCache>;
}

export interface BacklinkEntry {
  sourcePath: FilePath;
  raw: string;
  displayText?: string;
}

export interface BacklinkIndex {
  incoming: Map<FilePath, BacklinkEntry[]>;
  outgoing: Map<FilePath, Set<FilePath>>;
  unresolved: Map<string, Set<FilePath>>;
}

export interface VaultConfig {
  name: string;
  path: string;
  createdAt: number;
  lastOpenedAt: number;
}

export interface WorkspaceTab {
  id: string;
  filePath: FilePath;
  isPinned: boolean;
  isUnsaved: boolean;
  scrollPosition?: number;
}

export interface WorkspaceLayout {
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
}

export type EditorMode = 'source' | 'live-preview' | 'reading';
export type ThemeMode = 'dark' | 'light';

export interface SearchResult {
  filePath: FilePath;
  score: number;
  matches: { field: string; term: string }[];
}

export interface GraphNode {
  id: FilePath;
  label: string;
  group?: string;
  val?: number;
}

export interface GraphLink {
  source: FilePath;
  target: FilePath;
}
