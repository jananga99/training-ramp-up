import { call, put, takeEvery } from "redux-saga/effects";
import {
  createUserFailed,
  createUserSuccess,
  createUser,
  signInUserSuccess,
  signInUserFailed,
  signInUser,
} from "./userSlice";
import { User } from "../../utils/user";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

async function createAsync(user: User): Promise<User> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}user/`,
    method: "POST",
    data: {
      email: user.email,
      password: user.password,
    },
  });
  if (response.status === 201) {
    return response.data;
  } else if (response.data.message) {
    throw new Error(response.data.message);
  } else {
    throw new Error("Unknown error occurred");
  }
}

async function signInAsync(user: User): Promise<User> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth/`,
    method: "POST",
    data: {
      email: user.email,
      password: user.password,
    },
  });
  if (response.status === 200 && response.data.accessToken) {
    return response.data.accessToken;
  } else if (response.data.message) {
    throw new Error(response.data.message);
  } else {
    throw new Error("Unknown error occurred");
  }
}

function* signIn(action: PayloadAction<User>) {
  try {
    const response: string = yield call(signInAsync, action.payload);
    yield put(signInUserSuccess(response));
  } catch (error: any) {
    alert(error.message);
    yield put(signInUserFailed(error.message));
  }
}

function* create(action: PayloadAction<User>) {
  try {
    const response: User = yield call(createAsync, action.payload);
    alert(`User - ${response.email} is registered successfully`);
    yield put(createUserSuccess());
  } catch (error: any) {
    alert(error.message);
    yield put(createUserFailed(error.message));
  }
}

export default function* userSaga() {
  yield takeEvery(createUser.type, create);
  yield takeEvery(signInUser.type, signIn);
}
