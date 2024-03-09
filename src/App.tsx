import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import "./App.css"
import Editor from "./svgedit/editor/Editor"
import "./svgedit/editor/svgedit.css"
import { TopPanelGlobal } from "./TopPanelGlobal"
import { Provider } from "react-redux"
import { store } from "./state"

function App() {
  useEffect(() => {
    if (window.svgEditor) return

    const svgEditor = new Editor(
      document.getElementById("container") as HTMLElement
    )

    svgEditor.setConfig({
      allowInitialUserOverride: true,
      extensions: [],
      noDefaultExtensions: false,
      userExtensions: [
        /* { pathName: '/packages/react-test/dist/react-test.js' } */
      ],
    })

    window.editor = svgEditor

    svgEditor.init().then(() => {
      const topPanelGlobal = ReactDOM.createRoot(
        document.querySelector("#top-panel-global") as HTMLElement
      )

      topPanelGlobal.render(
        <React.StrictMode>
          <Provider store={store}>
            <TopPanelGlobal editor={svgEditor} />
          </Provider>
        </React.StrictMode>
      )
    })
  }, [])

  return (
    <div className="App">
      <div id="container" style={{ width: "100%", height: "100vh" }}></div>
    </div>
  )
}

export default App
