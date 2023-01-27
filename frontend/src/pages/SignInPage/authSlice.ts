import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetailedUser, User } from "../../utils/user";

interface AuthState {
  createLoading: boolean;
  signInLoading: boolean;
  accessToken: string | null;
  signedIn: boolean;
}

const initialState: AuthState = {
  createLoading: false,
  signInLoading: false,
  accessToken: null,
  signedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    createUser(state, action: PayloadAction<DetailedUser>) {
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
      state.signedIn = true;
    },
    signInUserFailed(state) {
      state.signInLoading = false;
      state.signedIn = false;
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
} = authSlice.actions;

export default authSlice.reducer;
