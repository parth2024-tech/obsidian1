import { Extension } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView, MatchDecorator, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view';

class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) {
    super();
  }
  eq(other: CheckboxWidget) { return other.checked === this.checked; }
  toDOM() {
    const wrap = document.createElement('span');
    wrap.className = 'cm-checkbox-widget';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = this.checked;
    cb.className = 'cm-checkbox';
    wrap.appendChild(cb);
    return wrap;
  }
}

class HrWidget extends WidgetType {
  toDOM() {
    const hr = document.createElement('hr');
    hr.className = 'cm-hr-widget';
    return hr;
  }
}

const checkboxDecorator = new MatchDecorator({
  regexp: /^- \[(x| )\] /g,
  decoration: (match) => {
    return Decoration.replace({
      widget: new CheckboxWidget(match[1].toLowerCase() === 'x')
    });
  }
});

const hrDecorator = new MatchDecorator({
  regexp: /^---$/g,
  decoration: () => Decoration.replace({ widget: new HrWidget() })
});

const headingDecorator = new MatchDecorator({
  regexp: /^(#{1,6})\s+(.*)/g,
  decoration: (match) => {
    const level = match[1].length;
    return Decoration.line({
      class: `cm-heading cm-heading-${level}`,
      attributes: { style: `font-size: ${2.5 - (level * 0.2)}em; font-weight: bold;` }
    });
  }
});

const livePreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.buildDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = this.buildDecorations(update.view);
      }
    }
    buildDecorations(view: EditorView): DecorationSet {
      const cursorLine = view.state.doc.lineAt(view.state.selection.main.head).number;

      const collectFromDeco = (decoSet: DecorationSet): Array<{ from: number; to: number; value: Decoration }> => {
        const result: Array<{ from: number; to: number; value: Decoration }> = [];
        const iter = decoSet.iter();
        while (iter.value) {
          const line = view.state.doc.lineAt(iter.from).number;
          if (line !== cursorLine) {
            result.push({ from: iter.from, to: iter.to, value: iter.value });
          }
          iter.next();
        }
        return result;
      };

      const headingDecos = collectFromDeco(headingDecorator.createDeco(view));
      const checkboxDecos = collectFromDeco(checkboxDecorator.createDeco(view));
      const hrDecos = collectFromDeco(hrDecorator.createDeco(view));

      const all = [...headingDecos, ...checkboxDecos, ...hrDecos]
        .sort((a, b) => a.from - b.from || a.to - b.to)
        .map(d => d.value.range(d.from, d.to));

      return Decoration.set(all, true);
    }
  },
  {
    decorations: v => v.decorations
  }
);

export function livePreviewExtension(): Extension[] {
  return [livePreviewPlugin];
}
