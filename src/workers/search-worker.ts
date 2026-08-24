import { VaultSearch, type SearchDocument } from '@/lib/vault/search';

const searchEngine = new VaultSearch();

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case 'index':
        searchEngine.indexFiles(payload.files as SearchDocument[]);
        self.postMessage({ type: 'indexed' });
        break;
      case 'search':
        const results = searchEngine.search(payload.query as string);
        self.postMessage({ type: 'results', results });
        break;
      case 'add':
        searchEngine.addDocument(payload.doc as SearchDocument);
        self.postMessage({ type: 'added', path: payload.doc.path });
        break;
      case 'remove':
        searchEngine.removeDocument(payload.path as string);
        self.postMessage({ type: 'removed', path: payload.path });
        break;
      case 'update':
        searchEngine.updateDocument(payload.doc as SearchDocument);
        self.postMessage({ type: 'updated', path: payload.doc.path });
        break;
      default:
        console.warn(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({ type: 'error', error: String(error) });
  }
};
