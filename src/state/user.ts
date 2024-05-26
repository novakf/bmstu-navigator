import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "."
import { useSelector } from "react-redux"

type State = {
  user: { id: string; login: string } | null
}

const initialState = {
  user: null,
  // user: { id: "user", login: "admin" },
} as State

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<State["user"]>) {
      state.user = payload
    },
  },
})

const selectUser = (state: RootState) => state.user.user

export const useCurrentUser = () => useSelector(selectUser)

export const { setUser: setUserAction } = userSlice.actions

export default userSlice.reducer
