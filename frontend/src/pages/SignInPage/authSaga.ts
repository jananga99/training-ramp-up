import { call, put, takeEvery } from "redux-saga/effects";
import { AxiosResponse } from "axios";
import {
  createUserFailed,
  createUserSuccess,
  createUser,
  signInUserSuccess,
  signInUserFailed,
  signInUser,
  signOutUser,
  signOutUserSuccess,
  signOutUserFailed,
} from "./authSlice";
import { DetailedUser, User } from "../../utils/user";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

async function signUpAsync(user: DetailedUser): Promise<AxiosResponse> {
  try {
    return await axios({
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth/signUp`,
      method: "POST",
      data: {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    return error.response;
  }
}

async function signInAsync(user: User): Promise<AxiosResponse> {
  try {
    return await axios({
      withCredentials: true,
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth`,
      method: "POST",
      data: {
        email: user.email,
        password: user.password,
      },
    });
  } catch (error: any) {
    return error.response;
  }
}

async function signOutAsync(): Promise<AxiosResponse> {
  try {
    return await axios({
      withCredentials: true,
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth/signOut`,
      method: "POST",
    });
  } catch (error: any) {
    return error.response;
  }
}

export async function refreshAsync() {
  try {
    return await axios({
      withCredentials: true,
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth/refresh`,
      method: "POST",
    });
  } catch (error: any) {
    return error.response;
  }
}

function* handleSaga(action: PayloadAction<DetailedUser>) {
  switch (action.type) {
    case createUser.type: {
      const response: AxiosResponse = yield call(signUpAsync, action.payload);
      if (response.status === 201) {
        alert(`User - ${response.data.email} is registered successfully`);
        yield put(createUserSuccess());
      } else if (response.status === 200) {
        alert(`This email is already registered`);
        yield put(createUserFailed());
      } else {
        alert(`User - ${response.data.email} registration failed. Try again.`);
        yield put(createUserFailed());
      }
      break;
    }
    case signInUser.type: {
      const response: AxiosResponse = yield call(signInAsync, action.payload);
      if (response.status === 200 && response.data.accessToken) {
        yield put(signInUserSuccess(response.data));
      } else {
        if (response.data.success) {
          alert("Invalid Email or Password");
        } else {
          alert("Sign in failed. Try again");
        }
        yield put(signInUserFailed());
      }
      break;
    }
    case signOutUser.type: {
      const response: AxiosResponse = yield call(signOutAsync);
      if (response.status === 200) {
        yield put(signOutUserSuccess());
        alert("User signed out.");
      } else {
        yield put(signOutUserFailed());
        alert("User sign out failed");
      }
    }
  }
}

export default function* authSaga() {
  yield takeEvery([createUser.type, signInUser.type, signOutUser.type], handleSaga);
}
