import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetailedUser, User } from "../../utils/user";

interface AuthState {
  createLoading: boolean;
  createSuccess: boolean;
  signInLoading: boolean;
  signOutLoading: boolean;
  signedIn: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  createLoading: false,
  createSuccess: false,
  signInLoading: false,
  signOutLoading: false,
  signedIn: false,
  isAdmin: false,
};

type signInSuccessDataType = {
  isAdmin: boolean;
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    createUser(state, action: PayloadAction<DetailedUser>) {
      state.createLoading = true;
    },
    createUserSuccess(state) {
      state.createLoading = false;
      state.createSuccess = true;
    },
    createUserFailed(state) {
      state.createLoading = false;
      state.createSuccess = false;
    },
    resetCreateSuccess(state) {
      state.createSuccess = false;
    },
    signInUser(state, action: PayloadAction<User>) {
      state.signInLoading = true;
    },
    signInUserSuccess(state, action: PayloadAction<signInSuccessDataType>) {
      state.signInLoading = false;
      state.isAdmin = action.payload.isAdmin;
      state.signedIn = true;
    },
    signInUserFailed(state) {
      state.signInLoading = false;
      state.signedIn = false;
      state.isAdmin = false;
    },
    signOutUser(state) {
      state.signOutLoading = true;
    },
    signOutUserSuccess(state) {
      state.signOutLoading = false;
      state.signedIn = false;
      state.isAdmin = false;
    },
    signOutUserFailed(state) {
      state.signOutLoading = false;
    },
  },
});

export const {
  createUserFailed,
  createUserSuccess,
  createUser,
  resetCreateSuccess,
  signInUserSuccess,
  signInUserFailed,
  signInUser,
  signOutUserFailed,
  signOutUserSuccess,
  signOutUser,
} = slice.actions;

export default slice.reducer;
