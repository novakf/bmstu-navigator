import { configureStore } from "@reduxjs/toolkit"
import editorReducer from "./editor/slice"
import userReducer from "./user"
import viewerReducer from "./viewer"

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    user: userReducer,
    viewer: viewerReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
