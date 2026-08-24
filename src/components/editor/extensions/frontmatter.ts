import { Extension } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { foldService } from '@codemirror/language';

const frontmatterPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }
    buildDecorations(view: EditorView) {
      const doc = view.state.doc;
      if (doc.lines < 2) return Decoration.none;
      const firstLine = doc.line(1).text;
      if (firstLine !== '---') return Decoration.none;
      
      let endLine = -1;
      for (let i = 2; i <= doc.lines; i++) {
        if (doc.line(i).text === '---') {
          endLine = i;
          break;
        }
      }
      if (endLine === -1) return Decoration.none;
      
      const start = doc.line(1).from;
      const end = doc.line(endLine).to;
      
      return Decoration.set([
        Decoration.mark({ class: 'cm-frontmatter' }).range(start, end)
      ]);
    }
  },
  {
    decorations: v => v.decorations
  }
);

const frontmatterFold = foldService.of((state, lineStart, lineEnd) => {
  const line = state.doc.lineAt(lineStart);
  if (line.number === 1 && line.text === '---') {
    for (let i = 2; i <= state.doc.lines; i++) {
      const l = state.doc.line(i);
      if (l.text === '---') {
        return { from: lineEnd, to: l.to };
      }
    }
  }
  return null;
});

export function frontmatterExtension(): Extension[] {
  return [frontmatterPlugin, frontmatterFold];
}
