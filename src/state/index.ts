import { combineReducers, configureStore } from '@reduxjs/toolkit';
import editorReducer from './editor/slice';
import userReducer from './user';
import viewerReducer from './viewer';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistEditorConfig = {
  key: 'editor',
  storage,
};

const persistUserConfig = {
  key: 'user',
  storage,
};

const persistedEditor = persistReducer(persistEditorConfig, editorReducer);
const persistedUser = persistReducer(persistUserConfig, userReducer);

const rootReducer = combineReducers({
  editor: persistedEditor,
  user: persistedUser,
  viewer: viewerReducer,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;

export const persistor = persistStore(store);

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
