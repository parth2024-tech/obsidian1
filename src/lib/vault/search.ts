import MiniSearch, { type SearchResult as MiniSearchResult } from 'minisearch';
import type { SearchResult } from './types';

export interface SearchDocument {
  path: string;
  title: string;
  content: string;
  tags: string[];
}

/**
 * Search module using MiniSearch.
 */
export class VaultSearch {
  private miniSearch: MiniSearch<SearchDocument>;

  constructor() {
    this.miniSearch = new MiniSearch({
      fields: ['title', 'content', 'tags'],
      storeFields: ['title', 'tags'],
      idField: 'path',
      searchOptions: {
        boost: { title: 3, tags: 2 },
        fuzzy: 0.2
      }
    });
  }

  /**
   * Build search index with an array of documents.
   */
  public indexFiles(files: SearchDocument[]): void {
    this.miniSearch.removeAll();
    this.miniSearch.addAll(files);
  }

  /**
   * Add a new document to the index.
   */
  public addDocument(doc: SearchDocument): void {
    if (!this.miniSearch.has(doc.path)) {
      this.miniSearch.add(doc);
    }
  }

  /**
   * Remove a document from the index.
   */
  public removeDocument(path: string): void {
    if (this.miniSearch.has(path)) {
      this.miniSearch.discard(path);
    }
  }

  /**
   * Update a document in the index.
   */
  public updateDocument(doc: SearchDocument): void {
    if (this.miniSearch.has(doc.path)) {
      this.miniSearch.replace(doc);
    } else {
      this.miniSearch.add(doc);
    }
  }

  /**
   * Perform fuzzy search.
   */
  public search(query: string): SearchResult[] {
    if (!query.trim()) return [];
    
    const results: MiniSearchResult[] = this.miniSearch.search(query, {
      prefix: true,
      fuzzy: (term) => term.length > 3 ? 0.2 : false
    });

    return results.map(res => ({
      filePath: res.id,
      score: res.score,
      matches: Object.entries(res.match).flatMap(([term, fields]) => 
        fields.map(field => ({ field, term }))
      )
    }));
  }
}
