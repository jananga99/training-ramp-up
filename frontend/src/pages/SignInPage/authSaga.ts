import { call, put, takeEvery } from "redux-saga/effects";
import { AxiosResponse } from "axios";
import {
  createUserFailed,
  createUserSuccess,
  createUser,
  signInUserSuccess,
  signInUserFailed,
  signInUser,
} from "./authSlice";
import { DetailedUser, User } from "../../utils/user";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

async function createAsync(user: DetailedUser): Promise<AxiosResponse> {
  try {
    return await axios({
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth/`,
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
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}auth/`,
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

function* handleSaga(action: PayloadAction<DetailedUser>) {
  switch (action.type) {
    case createUser.type: {
      const response: AxiosResponse = yield call(createAsync, action.payload);
      if (response.status === 201) {
        alert(`User - ${response.data.email} is registered successfully`);
        yield put(createUserSuccess());
      } else {
        alert(`User - ${response.data.email} registration failed. Try again.`);
        yield put(createUserFailed());
      }
      break;
    }
    case signInUser.type: {
      const response: AxiosResponse = yield call(signInAsync, action.payload);
      if (response.status === 200 && response.data.accessToken) {
        yield put(signInUserSuccess(response.data.accessToken));
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
  }
}

export default function* authSaga() {
  yield takeEvery([createUser.type, signInUser.type], handleSaga);
}
