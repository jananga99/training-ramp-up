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

function* handleSaga(action: PayloadAction<User>) {
  try {
    switch (action.type) {
      case createUser.type: {
        const response: User = yield call(createAsync, action.payload);
        alert(`User - ${response.email} is registered successfully`);
        yield put(createUserSuccess());
        break;
      }
      case signInUser.type: {
        const response: string = yield call(signInAsync, action.payload);
        yield put(signInUserSuccess(response));
        break;
      }
    }
  } catch (error: any) {
    switch (action.type) {
      case createUser.type: {
        alert(error.message);
        yield put(createUserFailed(error.message));
        break;
      }
      case signInUser.type: {
        alert(error.message);
        yield put(signInUserFailed(error.message));
        break;
      }
    }
  }
}

export default function* userSaga() {
  yield takeEvery([createUser.type, signInUser.type], handleSaga);
}
