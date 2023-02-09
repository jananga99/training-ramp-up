import { call, put, takeEvery } from "redux-saga/effects";
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
import { NewStudent, Student } from "../../utils/student";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { signInUserFailed } from "../SignInPage/slice";
import { axiosInstance } from "../../utils/axiosInstance";

async function createAsync(student: NewStudent): Promise<AxiosResponse> {
  return await axiosInstance.post("students/", student);
}

async function updateAsync(student: Student): Promise<AxiosResponse> {
  return await axiosInstance.patch(`students/${student.id}`, student);
}

async function removeAsync(id: number): Promise<AxiosResponse> {
  return await axiosInstance.delete(`students/${id}`);
}

async function getAsync(): Promise<AxiosResponse> {
  return await axiosInstance.get("students/");
}

function* getStudentHandler() {
  try {
    const response: AxiosResponse = yield call(getAsync);
    if (response.status === 200) {
      yield put(getStudentSuccess(response.data));
    } else {
      yield put(getStudentFailed());
      alert("Loading student data failed");
    }
  } catch (err: any) {
    yield put(getStudentFailed());
    if (err.response.status === 401) {
      yield put(signInUserFailed());
    }
  }
}

function* createStudentHandler(action: PayloadAction<NewStudent>) {
  try {
    const response: AxiosResponse = yield call(createAsync, action.payload as NewStudent);
    if (response.status === 201) {
      yield put(createStudentSuccess(response.data));
    } else {
      yield put(createStudentFailed());
      alert("Creating the student is failed");
    }
  } catch (err: any) {
    yield put(createStudentFailed());
    if (err.response.status === 401) {
      yield put(signInUserFailed());
    }
  }
}

function* updateStudentHandler(action: PayloadAction<Student>) {
  try {
    const response: AxiosResponse = yield call(updateAsync, action.payload as Student);
    if (response.status === 200) {
      yield put(updateStudentSuccess(response.data));
    } else {
      yield put(updateStudentFailed());
      alert("Updating the student is failed");
    }
  } catch (err: any) {
    yield put(updateStudentFailed());
    if (err.response.status === 401) {
      yield put(signInUserFailed());
    }
  }
}

function* removeStudentHandler(action: PayloadAction<number>) {
  try {
    const response: AxiosResponse = yield call(removeAsync, action.payload as number);
    if (response.status === 204) {
      yield put(removeStudentSuccess(response.data));
    } else {
      yield put(removeStudentFailed());
      alert("Removing the student is failed");
    }
  } catch (err: any) {
    yield put(removeStudentFailed());
    if (err.response.status === 401) {
      yield put(signInUserFailed());
    }
  }
}

export default function* studentSaga() {
  yield takeEvery(removeStudent.type, removeStudentHandler);
  yield takeEvery(createStudent.type, createStudentHandler);
  yield takeEvery(updateStudent.type, updateStudentHandler);
  yield takeEvery(getStudent.type, getStudentHandler);
}
