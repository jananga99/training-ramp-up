import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../utils/user";
import jwt from "jsonwebtoken";

interface UserState {
  createLoading: boolean;
  signInLoading: boolean;
  accessToken: string | null;
}

const initialState: UserState = {
  createLoading: false,
  signInLoading: false,
  accessToken: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createUser(state, action: PayloadAction<User>) {
      state.createLoading = true;
    },
    createUserSuccess(state) {
      state.createLoading = false;
    },
    createUserFailed(state) {
      state.createLoading = false;
    },
    signInUser(state, action: PayloadAction<User>) {
      state.signInLoading = true;
    },
    signInUserSuccess(state, action: PayloadAction<string>) {
      state.signInLoading = false;
      state.accessToken = action.payload;
    },
    signInUserFailed(state) {
      state.signInLoading = false;
    },
  },
});

export const {
  createUserFailed,
  createUserSuccess,
  createUser,
  signInUserSuccess,
  signInUserFailed,
  signInUser,
} = userSlice.actions;

export default userSlice.reducer;
