import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "./App.css"
import reportWebVitals from "./reportWebVitals"
import { Provider } from "react-redux"
import { store } from "./state"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { Editor } from "./pages/Editor"
import { Viewer } from "./pages/Viewer"
import { Auth } from "./pages/Auth"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Viewer />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/editor",
    element: <Editor />,
  },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* <App /> */}
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
