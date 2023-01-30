import { call, put, takeEvery, select } from "redux-saga/effects";
import {
  createStudentFailed,
  createStudentSuccess,
  createStudent,
  updateStudentFailed,
  updateStudentSuccess,
  updateStudent,
  getStudentSuccess,
  getStudentFailed,
  getStudent,
  removeStudentFailed,
  removeStudentSuccess,
  removeStudent,
} from "./studentSlice";
import { Student } from "../../utils/student";
import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { signInUserFailed, signInUserSuccess } from "../../pages/SignInPage/authSlice";
import { refreshAsync } from "../../pages/SignInPage/authSaga";

async function createInDB(student: Student, accessToken: string): Promise<AxiosResponse> {
  try {
    return await axios({
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/`,
      method: "POST",
      data: {
        student: student,
      },
    });
  } catch (error: any) {
    return error.response;
  }
}

async function updateInDB(student: Student, accessToken: string): Promise<AxiosResponse> {
  try {
    return await axios({
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${student.id}`,
      method: "PUT",
      data: {
        student: student,
      },
    });
  } catch (error: any) {
    return error.response;
  }
}

async function removeInDB(id: number, accessToken: string): Promise<AxiosResponse> {
  try {
    return await axios({
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${id}`,
      method: "DELETE",
    });
  } catch (error: any) {
    return error.response;
  }
}

async function getInDB(accessToken: string): Promise<AxiosResponse> {
  try {
    return await axios({
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/`,
      method: "GET",
    });
  } catch (error: any) {
    return error.response;
  }
}

function* refresh() {
  const response: AxiosResponse = yield call(refreshAsync);
  if (response.status === 200) {
    yield put(signInUserSuccess(response.data.accessToken));
    return true;
  } else {
    yield put(signInUserFailed());
    return false;
  }
}
type asyncFunctionType = typeof createInDB | typeof updateInDB | typeof removeInDB | typeof getInDB;
type successFunctionType =
  | typeof createStudentSuccess
  | typeof updateStudentSuccess
  | typeof getStudentSuccess
  | typeof removeStudentSuccess;
type failedFunctionType =
  | typeof createStudentFailed
  | typeof removeStudentFailed
  | typeof updateStudentFailed
  | typeof getStudentFailed;
function* asyncResponseHandler(
  asyncFunction: asyncFunctionType,
  requestData: any,
  accessToken: string,
  successFunction: successFunctionType,
  failedFunction: failedFunctionType
) {
  let response: AxiosResponse;
  if (requestData) {
    response = yield call(asyncFunction, requestData, accessToken);
  } else {
    response = yield call(asyncFunction, accessToken);
  }
  console.log(response.status);
  if (response.status >= 200 && response.status < 300) {
    yield put(successFunction(response.data));
  } else if (response.status === 401) {
    const success: boolean = yield refresh();
    if (success) {
      const accessToken: string = yield select((state) => state.auth.accessToken);
      if (requestData) {
        response = yield call(asyncFunction, requestData, accessToken);
      } else {
        response = yield call(asyncFunction, accessToken);
      }
      if (response.status >= 200 && response.status < 300) {
        yield put(successFunction(response.data));
      } else {
        yield put(failedFunction(response.data));
      }
    }
  } else {
    yield put(failedFunction(response.data));
  }
}

function* sagaHandler(action: PayloadAction<Student | number>) {
  const accessToken: string = yield select((state) => state.auth.accessToken);
  switch (action.type) {
    case createStudent.type: {
      yield asyncResponseHandler(
        createInDB,
        action.payload as Student,
        accessToken,
        createStudentSuccess,
        createStudentFailed
      );
      break;
    }
    case updateStudent.type: {
      yield asyncResponseHandler(
        updateInDB,
        action.payload as Student,
        accessToken,
        updateStudentSuccess,
        updateStudentFailed
      );
      break;
    }
    case removeStudent.type: {
      yield asyncResponseHandler(
        removeInDB,
        action.payload as number,
        accessToken,
        removeStudentSuccess,
        removeStudentFailed
      );
      break;
    }
    case getStudent.type: {
      yield asyncResponseHandler(getInDB, null, accessToken, getStudentSuccess, getStudentFailed);
      break;
    }
  }
}

export default function* studentSaga() {
  yield takeEvery(
    [removeStudent.type, createStudent.type, updateStudent.type, getStudent.type],
    sagaHandler
  );
}
