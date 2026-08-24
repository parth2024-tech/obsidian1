import matter from 'gray-matter';
import type { 
  CachedMetadata, 
  HeadingCache, 
  LinkCache, 
  EmbedCache, 
  TagCache, 
  BlockCache, 
  BacklinkIndex, 
  FilePath 
} from './types';

/**
 * MetadataCache class for parsing and caching note metadata.
 */
export class MetadataCache {
  /**
   * Parse a markdown string and extract metadata.
   */
  public static parseNote(content: string): CachedMetadata {
    const cache: CachedMetadata = {};
    
    // Frontmatter
    try {
      const parsed = matter(content);
      if (parsed.data && Object.keys(parsed.data).length > 0) {
        cache.frontmatter = parsed.data;
      }
    } catch (e) {
      console.warn("Failed to parse frontmatter", e);
    }

    // Headings
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;
    const headings: HeadingCache[] = [];
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        heading: match[2],
        level: match[1].length,
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
    if (headings.length > 0) cache.headings = headings;

    // Links & Embeds (e.g. [[Link]] or ![[Embed]])
    const linkRegex = /(!)?\[\[([^\]]+)\]\]/g;
    const links: LinkCache[] = [];
    const embeds: EmbedCache[] = [];
    
    while ((match = linkRegex.exec(content)) !== null) {
      const isEmbed = !!match[1];
      const innerText = match[2];
      const parts = innerText.split('|');
      const linkTarget = parts[0];
      const displayText = parts.length > 1 ? parts[1] : undefined;
      
      const hashSplit = linkTarget.split('#');
      let link = hashSplit[0];
      let heading: string | undefined;
      let blockId: string | undefined;
      
      if (hashSplit.length > 1) {
        if (hashSplit[1].startsWith('^')) {
          blockId = hashSplit[1].substring(1);
        } else {
          heading = hashSplit[1];
        }
      }

      if (isEmbed) {
        embeds.push({
          link,
          original: match[0],
          position: { start: match.index, end: match.index + match[0].length }
        });
      } else {
        links.push({
          link,
          displayText,
          heading,
          blockId,
          original: match[0],
          position: { start: match.index, end: match.index + match[0].length }
        });
      }
    }
    if (links.length > 0) cache.links = links;
    if (embeds.length > 0) cache.embeds = embeds;

    // Tags
    const tagRegex = /(?:^|\s)#([a-zA-Z0-9_\-\/]+)/g;
    const tags: TagCache[] = [];
    while ((match = tagRegex.exec(content)) !== null) {
      tags.push({
        tag: match[1],
        position: { start: match.index, end: match.index + match[0].length }
      });
    }
    if (tags.length > 0) cache.tags = tags;

    // Blocks
    const blockRegex = /\^([a-zA-Z0-9\-]+)$/gm;
    const blocks: Record<string, BlockCache> = {};
    let blockCount = 0;
    while ((match = blockRegex.exec(content)) !== null) {
      blocks[match[1]] = {
        id: match[1],
        position: { start: match.index, end: match.index + match[0].length }
      };
      blockCount++;
    }
    if (blockCount > 0) cache.blocks = blocks;

    return cache;
  }

  /**
   * Build the backlink index from the entire cache.
   */
  public static buildBacklinkIndex(cache: Map<FilePath, CachedMetadata>): BacklinkIndex {
    const incoming = new Map<FilePath, import('./types').BacklinkEntry[]>();
    const outgoing = new Map<FilePath, Set<FilePath>>();
    const unresolved = new Map<string, Set<FilePath>>();

    for (const [sourcePath, metadata] of cache.entries()) {
      const outSet = new Set<FilePath>();
      
      if (metadata.links) {
        for (const link of metadata.links) {
          if (!link.link) continue;
          outSet.add(link.link);
          
          let entries = incoming.get(link.link);
          if (!entries) {
            entries = [];
            incoming.set(link.link, entries);
          }
          entries.push({
            sourcePath,
            raw: link.original,
            displayText: link.displayText
          });
        }
      }
      outgoing.set(sourcePath, outSet);
    }

    return { incoming, outgoing, unresolved };
  }

  /**
   * Resolves a wikilink text to an actual file path.
   */
  public static resolveLink(linkText: string, allFiles: FilePath[]): FilePath | null {
    if (!linkText) return null;
    const normalizedTarget = linkText.toLowerCase();
    for (const file of allFiles) {
      if (file.toLowerCase() === normalizedTarget || file.toLowerCase().endsWith(`/${normalizedTarget}`) || file.toLowerCase().endsWith(`/${normalizedTarget}.md`)) {
        return file;
      }
    }
    return null;
  }

  /**
   * Finds plain text mentions of a target.
   */
  public static findUnlinkedMentions(targetName: string, allFiles: Map<FilePath, string>): Array<{sourcePath: FilePath, positions: number[]}> {
    const results: Array<{sourcePath: FilePath, positions: number[]}> = [];
    const regex = new RegExp(`\\b${targetName}\\b`, 'gi');

    for (const [path, content] of allFiles.entries()) {
      let match;
      const positions: number[] = [];
      while ((match = regex.exec(content)) !== null) {
        positions.push(match.index);
      }
      if (positions.length > 0) {
        results.push({ sourcePath: path, positions });
      }
    }
    return results;
  }
}
