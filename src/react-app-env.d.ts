import Editor from './svgedit/editor/Editor';
import EditorNew from './svgedit2/editor.class';
import SvgCanvas from '@svgedit/svgcanvas';

declare global {
  declare module '*.svg';

  interface Window {
    svgEditor: SvgCanvas;
    editor: Editor;
    editorNew: EditorNew;
    navigate: any;
  }
}
