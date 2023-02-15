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
import { axiosInstance } from "../../utils/axiosInstance";

async function signUpAsync(user: DetailedUser): Promise<AxiosResponse> {
  return await axiosInstance.post("auth/signUp", {
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
  });
}

async function signInAsync(user: User): Promise<AxiosResponse> {
  return await axiosInstance.post("auth/", {
    email: user.email,
    password: user.password,
  });
}

async function signOutAsync(): Promise<AxiosResponse> {
  return await axiosInstance.post("auth/signOut");
}

function* signUpHandler(action: PayloadAction<DetailedUser>) {
  try {
    const response: AxiosResponse = yield call(signUpAsync, action.payload);
    if (response.status === 201) {
      alert(`User - ${response.data.email} is registered successfully`);
      yield put(createUserSuccess());
    } else {
      alert(`User registration failed. Try again.`);
      yield put(createUserFailed());
    }
  } catch (err: any) {
    if (err.response.status === 409) {
      alert(`This email is already registered`);
    } else {
      alert(`User registration failed. Try again.`);
    }
    yield put(createUserFailed());
  }
}

function* signInHandler(action: PayloadAction<DetailedUser>) {
  try {
    const response: AxiosResponse = yield call(signInAsync, action.payload);
    if (response.status === 200) {
      yield put(signInUserSuccess(response.data));
    } else {
      alert("Invalid Email or Password");
      yield put(signInUserFailed());
    }
  } catch (err: any) {
    if (err.response.status === 401) {
      alert("Invalid email or password");
    } else {
      alert("Sign in failed. Try again");
    }
    yield put(signInUserFailed());
  }
}

function* signOutHandler() {
  try {
    yield call(signOutAsync);
    yield put(signOutUserSuccess());
    alert("User signed out.");
  } catch (err) {
    yield put(signOutUserFailed());
    alert("User sign out failed");
  }
}

export default function* authSaga() {
  yield takeEvery(createUser.type, signUpHandler);
  yield takeEvery(signInUser.type, signInHandler);
  yield takeEvery(signOutUser.type, signOutHandler);
}
