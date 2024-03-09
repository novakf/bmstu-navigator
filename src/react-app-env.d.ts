import Editor from "./svgedit/editor/Editor"

declare global {
  interface Window {
    svgEditor: Editor
    editor: Editor
  }
}
