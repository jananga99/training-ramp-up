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
} from "./studentSlice";
import { Student } from "../../utils/student";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

async function createInDB(student: Student): Promise<Student> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/`,
    method: "POST",
    data: {
      student: student,
    },
  });
  if (response.status === 201) {
    return response.data;
  }
  if (response.data.message) {
    throw new Error(response.data.message);
  } else {
    throw new Error("An unknown error occurred.");
  }
}

async function updateInDB(student: Student): Promise<Student> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${student.id}`,
    method: "PUT",
    data: {
      student: student,
    },
  });
  if (response.status === 200) {
    return response.data;
  }
  if (response.data.message) {
    throw new Error(response.data.message);
  } else {
    throw new Error("An unknown error occurred.");
  }
}

async function removeInDB(id: number): Promise<boolean> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${id}`,
    method: "DELETE",
  });
  if (response.status === 204) {
    return true;
  }
  if (response.data.message) {
    throw new Error(response.data.message);
  } else {
    throw new Error("An unknown error occurred.");
  }
}

async function getInDB(): Promise<Student[]> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/`,
    method: "GET",
  });
  if (response.status === 200) {
    return response.data;
  }
  if (response.data.message) {
    throw new Error(response.data.message);
  } else {
    throw new Error("An unknown error occurred.");
  }
}

function* create(action: PayloadAction<Student>) {
  try {
    yield call(createInDB, action.payload);
    yield put(createStudentSuccess());
  } catch (error: any) {
    yield put(createStudentFailed());
    alert(error.message);
  }
}

function* update(action: PayloadAction<Student>) {
  try {
    yield call(updateInDB, action.payload);
    yield put(updateStudentSuccess());
  } catch (error: any) {
    yield put(updateStudentFailed());
    alert(error.message);
  }
}

function* remove(action: PayloadAction<number>) {
  try {
    yield call(removeInDB, action.payload);
    yield put(removeStudentSuccess());
  } catch (error: any) {
    yield put(removeStudentFailed());
    alert(error.message);
  }
}

function* get() {
  try {
    const response: Student[] = yield call(getInDB);
    yield put(getStudentSuccess(response));
  } catch (error: any) {
    yield put(getStudentFailed());
    alert(error.message);
  }
}

export default function* studentSaga() {
  yield takeEvery(createStudent.type, create);
  yield takeEvery(updateStudent.type, update);
  yield takeEvery(removeStudent.type, remove);
  yield takeEvery(getStudent.type, get);
}
