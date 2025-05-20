import Editor from './svgedit/editor/Editor';
import EditorNew from './svgedit2/editor.class';

declare global {
  declare module '*.svg';

  interface Window {
    svgEditor: EditorNew;
    editor: Editor;
    editorNew: EditorNew;
    navigate: any;
  }
}
