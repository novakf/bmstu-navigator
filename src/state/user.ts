import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { useSelector } from 'react-redux';

type State = {
  user: { id: string; login: string } | null;
  isFormOpen: boolean;
};

const initialState = {
  user: null,
  isFormOpen: false,
  // user: { id: "user", login: "admin" },
} as State;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<State['user']>) {
      state.user = payload;
    },
    setFormOpen(state, { payload }: PayloadAction<boolean>) {
      state.isFormOpen = payload;
    },
  },
});

const selectUser = (state: RootState) => state.user.user;

const selectFormOpen = (state: RootState) => state.user.isFormOpen;

export const useCurrentUser = () => useSelector(selectUser);

export const useFormOpen = () => useSelector(selectFormOpen);

export const { setUser: setUserAction, setFormOpen: setFormOpenAction } =
  userSlice.actions;

export default userSlice.reducer;
