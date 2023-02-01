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
} from "./slice";
import { Student } from "../../utils/student";
import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { signInUserFailed, signInUserSuccess } from "../SignInPage/slice";
import { refreshAsync } from "../SignInPage/saga";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_SERVER_URL}students`,
  timeout: 5000,
  withCredentials: true,
});

async function createAsync(student: Student, accessToken: string): Promise<AxiosResponse> {
  try {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    return await axiosInstance.post("/", { student: student });
  } catch (error: any) {
    return error.response;
  }
}

async function updateAsync(student: Student, accessToken: string): Promise<AxiosResponse> {
  try {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    return await axiosInstance.put(`/${student.id}`, { student: student });
  } catch (error: any) {
    return error.response;
  }
}

async function removeAsync(id: number, accessToken: string): Promise<AxiosResponse> {
  try {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    return await axiosInstance.delete(`/${id}`);
  } catch (error: any) {
    return error.response;
  }
}

async function getAsync(accessToken: string): Promise<AxiosResponse> {
  try {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    return await axiosInstance.get("/");
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
type asyncFunctionType =
  | typeof createAsync
  | typeof updateAsync
  | typeof removeAsync
  | typeof getAsync;
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
        alert("An error occurred.");
      }
    }
  } else {
    yield put(failedFunction(response.data));
    alert("An error occurred.");
  }
}

function* getStudentHandler(action: PayloadAction<Student>) {
  const accessToken: string = yield select((state) => state.auth.accessToken);
  yield asyncResponseHandler(getAsync, null, accessToken, getStudentSuccess, getStudentFailed);
}

function* createStudentHandler(action: PayloadAction<Student>) {
  const accessToken: string = yield select((state) => state.auth.accessToken);
  yield asyncResponseHandler(
    createAsync,
    action.payload as Student,
    accessToken,
    createStudentSuccess,
    createStudentFailed
  );
}

function* updateStudentHandler(action: PayloadAction<Student>) {
  const accessToken: string = yield select((state) => state.auth.accessToken);
  yield asyncResponseHandler(
    updateAsync,
    action.payload as Student,
    accessToken,
    updateStudentSuccess,
    updateStudentFailed
  );
}

function* removeStudentHandler(action: PayloadAction<number>) {
  const accessToken: string = yield select((state) => state.auth.accessToken);
  yield asyncResponseHandler(
    removeAsync,
    action.payload as number,
    accessToken,
    removeStudentSuccess,
    removeStudentFailed
  );
}

export default function* studentSaga() {
  yield takeEvery(removeStudent.type, removeStudentHandler);
  yield takeEvery(createStudent.type, createStudentHandler);
  yield takeEvery(updateStudent.type, updateStudentHandler);
  yield takeEvery(getStudent.type, getStudentHandler);
}
