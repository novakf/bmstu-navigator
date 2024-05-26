import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "."
import { useSelector } from "react-redux"

export type RouteData = {
  pointIds: string[]
}

type State = {
  activeFloor: number
  routeFrom: string | null
  routeTo: string | null
  activeRoute: RouteData | null
}

const initialState = {
  activeFloor: 9,
  routeFrom: null,
  routeTo: null,
  activeRoute: null,
} as State

const viewerSlice = createSlice({
  name: "viewer",
  initialState,
  reducers: {
    setActiveFloor(state, { payload }: PayloadAction<number>) {
      state.activeFloor = payload
    },
    setActiveRoute(state, { payload }: PayloadAction<RouteData | null>) {
      state.activeRoute = payload
    },
    setRouteFrom(state, { payload }: PayloadAction<string | null>) {
      state.routeFrom = payload
    },
    setRouteTo(state, { payload }: PayloadAction<string | null>) {
      state.routeTo = payload
    },
    setRouteEdge(state, { payload }: PayloadAction<string>) {
      if (!state.routeFrom) state.routeFrom = payload
      else if (!state.routeTo) state.routeTo = payload
    },
  },
})

const selectActiveFloor = (state: RootState) => state.viewer.activeFloor
export const useActiveFloor = () => useSelector(selectActiveFloor)

const selectActiveRoute = (state: RootState) => state.viewer.activeRoute
export const useActiveRoute = () => useSelector(selectActiveRoute)

const selectRouteFrom = (state: RootState) => state.viewer.routeFrom
export const useRouteFrom = () => useSelector(selectRouteFrom)

const selectRouteTo = (state: RootState) => state.viewer.routeTo
export const useRouteTo = () => useSelector(selectRouteTo)

export const {
  setActiveFloor: setActiveFloorAction,
  setActiveRoute: setActiveRouteAction,
  setRouteFrom: setRouteFromAction,
  setRouteTo: setRouteToAction,
  setRouteEdge: setRouteEdgeAction,
} = viewerSlice.actions

export default viewerSlice.reducer
