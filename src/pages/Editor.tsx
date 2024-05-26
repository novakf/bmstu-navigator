import React, { FC, useEffect } from "react"
import ReactDOM from "react-dom/client"
import Editor from "../svgedit/editor/Editor"
import "../svgedit/editor/svgedit.css"
import { TopPanelGlobal } from "../TopPanelGlobal"
import { Provider, useDispatch } from "react-redux"
import { AppDispatch, store } from "../state"
import { initEditor } from "../state/editor/slice"
import { useCurrentUser } from "../state/user"
import { Navigate } from "react-router-dom"

const EditorComp: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useCurrentUser()

  useEffect(() => {
    if (window.svgEditor) return
    if (!user) return

    dispatch(initEditor())

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

  if (!user) return <Navigate to={"/auth"} />

  return <div id={"container"}></div>
}

export { EditorComp as Editor }
