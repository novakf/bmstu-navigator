import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from ".."

type State = {
  selectedElement: {
    id: string
    properties: string | null
  } | null
}

const initialState = {
  editor: null,
  selectedElement: null,
} as State

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setSelectedElement(
      state,
      { payload }: PayloadAction<State["selectedElement"]>
    ) {
      state.selectedElement = payload
    },
  },
})

export const selectSelectedElement = (state: RootState) =>
  state.editor.selectedElement

export const useSelectedElement = () => {
  const selectedElement = useSelector(selectSelectedElement)

  if (!selectedElement) return null

  const htmlElement = document.querySelector(
    `#${selectedElement.id}`
  ) as HTMLElement

  return { element: htmlElement, properties: selectedElement.properties }
}

export const { setSelectedElement: setSelectedElementAction } =
  editorSlice.actions

export default editorSlice.reducer
