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
} from "./slice";
import { DetailedUser, User } from "../../utils/user";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth`,
  timeout: 5000,
  withCredentials: true,
});

async function signUpAsync(user: DetailedUser): Promise<AxiosResponse> {
  try {
    return await axiosInstance.post("/signUp", {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error: any) {
    return error.response;
  }
}

async function signInAsync(user: User): Promise<AxiosResponse> {
  try {
    return await axiosInstance.post("/", {
      email: user.email,
      password: user.password,
    });
  } catch (error: any) {
    return error.response;
  }
}

async function signOutAsync(): Promise<AxiosResponse> {
  try {
    return await axiosInstance.post("/signOut");
  } catch (error: any) {
    return error.response;
  }
}

export async function refreshAsync() {
  try {
    return await axiosInstance.post("/refresh");
  } catch (error: any) {
    return error.response;
  }
}

function* signUpHandler(action: PayloadAction<DetailedUser>) {
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
}

function* signInHandler(action: PayloadAction<DetailedUser>) {
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
}

function* signOutHandler() {
  const response: AxiosResponse = yield call(signOutAsync);
  if (response.status === 200) {
    yield put(signOutUserSuccess());
    alert("User signed out.");
  } else {
    yield put(signOutUserFailed());
    alert("User sign out failed");
  }
}

export default function* authSaga() {
  yield takeEvery(createUser.type, signUpHandler);
  yield takeEvery(signInUser.type, signInHandler);
  yield takeEvery(signOutUser.type, signOutHandler);
}
