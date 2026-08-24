import { Extension } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView, MatchDecorator, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { CompletionContext, CompletionResult, autocompletion } from '@codemirror/autocomplete';

const wikilinkDecorator = new MatchDecorator({
  regexp: /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
  decoration: (match) => {
    return Decoration.mark({
      class: 'cm-wikilink',
      attributes: {
        'data-target': match[1],
        'data-display': match[2] || match[1],
        'title': `Link to ${match[1]}`
      }
    });
  }
});

const embedDecorator = new MatchDecorator({
  regexp: /!\[\[([^\]]+)\]\]/g,
  decoration: (match) => {
    return Decoration.mark({
      class: 'cm-wikilink cm-embed',
      attributes: {
        'data-target': match[1],
        'title': `Embed ${match[1]}`
      }
    });
  }
});

function mergeDecorations(view: EditorView): DecorationSet {
  const wikiDecos = wikilinkDecorator.createDeco(view);
  const embedDecos = embedDecorator.createDeco(view);
  const all: Array<{ from: number; to: number; value: Decoration }> = [];
  for (const decoSet of [wikiDecos, embedDecos]) {
    const iter = decoSet.iter();
    while (iter.value) {
      all.push({ from: iter.from, to: iter.to, value: iter.value });
      iter.next();
    }
  }
  all.sort((a, b) => a.from - b.from || a.to - b.to);
  return Decoration.set(all.map(d => d.value.range(d.from, d.to)), true);
}

const wikilinkPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = mergeDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = mergeDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
    eventHandlers: {
      mousedown(e, view) {
        const target = e.target as HTMLElement;
        if (target.classList.contains('cm-wikilink')) {
          const linkTarget = target.getAttribute('data-target');
          if (linkTarget) {
            // we dispatch a custom event to be handled by the editor wrapper
            view.dom.dispatchEvent(new CustomEvent('wikilink-click', {
              detail: { target: linkTarget },
              bubbles: true
            }));
            e.preventDefault();
            return true;
          }
        }
        return false;
      }
    }
  }
);

interface WikilinkOptions {
  onLinkClick?: (target: string) => void;
  getFileNames?: () => string[];
}

export function wikilinkExtension(options: WikilinkOptions = {}): Extension[] {
  const extensions: Extension[] = [
    wikilinkPlugin,
  ];
  
  if (options.getFileNames) {
    const wikilinkCompletion = (context: CompletionContext): CompletionResult | null => {
      const match = context.matchBefore(/\[\[([^\]]*)/);
      if (!match) return null;
      if (match.from === match.to && !context.explicit) return null;
      
      const fileNames = options.getFileNames?.() || [];
      return {
        from: match.from + 2,
        options: fileNames.map(name => ({
          label: name,
          type: 'text',
          apply: `${name}]]`
        })),
        validFor: /^[^\]]*$/
      };
    };
    
    extensions.push(autocompletion({ override: [wikilinkCompletion] }));
  }
  
  return extensions;
}
