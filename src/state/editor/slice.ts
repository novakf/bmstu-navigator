import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from ".."
import { Link, UniverObject } from "../../interfaces"
import uoItemsMock from "../../mocks/uo-items.json"
import uoHoldersMock from "../../mocks/uo-holders.json"
import uoLinksMock from "../../mocks/uo-links.json"

export type UoLinks = Record<string, Link[]>

type State = {
  selectedElement: {
    svgId: string
    uo: UniverObject | null
  } | null
  scale?: number
  // все объекты на схеме (аудитории, коридоры, все точки, ...)
  uoItems: Record<string, UniverObject>
  // связи между точками
  uoLinks: UoLinks
  // вспомогательные холдеры, просто родитель - ребенок
  uoHolders: Record<string, string[]>
  floor: number | null
}

export type EditorState = State

const initialState = {
  selectedElement: null,
  scale: 0.0175,
  floor: null,
  uoItems: {},
  uoLinks: {},
  uoHolders: {},
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
    setScale(state, { payload }: PayloadAction<number>) {
      state.scale = payload
    },
    setFloor(state, { payload }: PayloadAction<number>) {
      state.floor = payload
    },
    setUoItems(state, { payload }: PayloadAction<State["uoItems"]>) {
      localStorage.setItem("uoItems", JSON.stringify(payload))

      state.uoItems = payload
    },
    setUoLinks(state, { payload }: PayloadAction<State["uoLinks"]>) {
      localStorage.setItem("uoLinks", JSON.stringify(payload))

      state.uoLinks = payload
    },
    setUoHolders(state, { payload }: PayloadAction<State["uoHolders"]>) {
      localStorage.setItem("uoHolders", JSON.stringify(payload))

      state.uoHolders = payload
    },
    addUoToHolder(state, { payload }: PayloadAction<[string, string]>) {
      const [holderId, childId] = payload

      if (state.uoHolders[holderId]) {
        state.uoHolders[holderId].push(childId)
      } else {
        state.uoHolders[holderId] = [childId]
      }

      localStorage.setItem("uoHolders", JSON.stringify(state.uoHolders))
    },
    removeObjectFromUoItems(state, { payload }: PayloadAction<{ id: string }>) {
      const uoItems = state.uoItems
      delete uoItems[payload.id]
      state.uoItems = uoItems

      localStorage.setItem("uoItems", JSON.stringify(state.uoItems))
    },
    removeObjectFromUoLinks(state, { payload }: PayloadAction<{ id: string }>) {
      const uoLinks = state.uoLinks

      delete uoLinks[payload.id]

      Object.keys(uoLinks).forEach((key) => {
        uoLinks[key] = uoLinks[key].filter((link) => link.id !== payload.id)
      })

      state.uoLinks = uoLinks

      localStorage.setItem("uoLinks", JSON.stringify(state.uoLinks))
    },
    removeObjectFromUoHolders(
      state,
      { payload }: PayloadAction<{ id: string }>
    ) {
      const uoHolders = state.uoHolders

      delete uoHolders[payload.id]

      Object.keys(uoHolders).forEach((key) => {
        uoHolders[key] = uoHolders[key].filter((item) => item !== payload.id)
      })

      state.uoHolders = uoHolders

      localStorage.setItem("uoHolders", JSON.stringify(state.uoHolders))
    },
  },
})

export const selectSelectedElement = (state: RootState) =>
  state.editor.selectedElement

export const selectScale = (state: RootState) => state.editor.scale

export const selectFloor = (state: RootState) => state.editor.floor

export const selectUoItems = (state: RootState) => state.editor.uoItems

export const selectUoLinks = (state: RootState) => state.editor.uoLinks

export const selectUoHolders = (state: RootState) => state.editor.uoHolders

export const useSelectedElement = () => {
  const selectedElement = useSelector(selectSelectedElement)

  if (!selectedElement) return null

  const htmlElement = document.querySelector(
    `#${selectedElement.svgId}`
  ) as HTMLElement

  return { element: htmlElement, uo: selectedElement.uo }
}

export const useScale = () => useSelector(selectScale)

export const useFloor = () => useSelector(selectFloor)

export const useUoItems = () => useSelector(selectUoItems)

export const useUoLinks = () => useSelector(selectUoLinks)

export const useUoHolders = () => useSelector(selectUoHolders)

export const initEditor = createAsyncThunk("initEditor", (_, { dispatch }) => {
  const uoItems =
    JSON.parse(localStorage.getItem("uoItems") || "null") || uoItemsMock
  const uoLinks =
    JSON.parse(localStorage.getItem("uoLinks") || "null") || uoLinksMock
  const uoHolders =
    JSON.parse(localStorage.getItem("uoHolders") || "null") || uoHoldersMock

  dispatch(setUoItemsAction(uoItems))
  dispatch(setUoLinksAction(uoLinks))
  dispatch(setUoHoldersAction(uoHolders))
})

export const {
  setSelectedElement: setSelectedElementAction,
  setScale: setScaleAction,
  setFloor: setFloorAction,
  setUoItems: setUoItemsAction,
  setUoLinks: setUoLinksAction,
  setUoHolders: setUoHoldersAction,
  addUoToHolder: addUoToHolderAction,
  removeObjectFromUoItems: removeObjectFromUoItemsAction,
  removeObjectFromUoLinks: removeObjectFromUoLinksAction,
  removeObjectFromUoHolders: removeObjectFromUoHoldersAction,
} = editorSlice.actions

export default editorSlice.reducer
