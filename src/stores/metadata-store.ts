import { create } from 'zustand';
import type { CachedMetadata, BacklinkIndex, FilePath, BacklinkEntry, LinkCache, HeadingCache } from '@/lib/vault/types';
import { MetadataCache } from '@/lib/vault/metadata-cache';

interface MetadataState {
  cache: Map<FilePath, CachedMetadata>;
  backlinkIndex: BacklinkIndex | null;
  
  updateCache: (path: FilePath, content: string) => void;
  rebuildBacklinks: () => void;
  getBacklinks: (path: FilePath) => BacklinkEntry[];
  getOutgoingLinks: (path: FilePath) => LinkCache[];
  getUnresolvedLinks: (path: FilePath) => LinkCache[];
  getHeadings: (path: FilePath) => HeadingCache[];
  getTags: () => Map<string, FilePath[]>;
}

export const useMetadataStore = create<MetadataState>((set, get) => ({
  cache: new Map(),
  backlinkIndex: null,

  updateCache: (path, content) => {
    const { cache } = get();
    const newMetadata = MetadataCache.parseNote(content);
    const newCache = new Map(cache);
    newCache.set(path, newMetadata);
    set({ cache: newCache });
    get().rebuildBacklinks();
  },

  rebuildBacklinks: () => {
    const { cache } = get();
    const index = MetadataCache.buildBacklinkIndex(cache);
    set({ backlinkIndex: index });
  },

  getBacklinks: (path) => {
    const { backlinkIndex } = get();
    if (!backlinkIndex) return [];
    return backlinkIndex.incoming.get(path) || [];
  },

  getOutgoingLinks: (path) => {
    const { cache } = get();
    const metadata = cache.get(path);
    return metadata?.links || [];
  },

  getUnresolvedLinks: (path) => {
    const { cache } = get();
    const metadata = cache.get(path);
    return metadata?.links || [];
  },

  getHeadings: (path) => {
    const { cache } = get();
    return cache.get(path)?.headings || [];
  },

  getTags: () => {
    const { cache } = get();
    const tagMap = new Map<string, FilePath[]>();
    for (const [path, metadata] of cache.entries()) {
      if (metadata.tags) {
        for (const t of metadata.tags) {
          const files = tagMap.get(t.tag) || [];
          files.push(path);
          tagMap.set(t.tag, files);
        }
      }
    }
    return tagMap;
  }
}));
