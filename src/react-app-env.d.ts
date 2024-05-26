import Editor from "./svgedit/editor/Editor"

declare global {
  declare module "*.svg"

  interface Window {
    svgEditor: Editor
    editor: Editor
  }
}
