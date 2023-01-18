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
import { Student } from "./student";
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
  return response.data;
}

async function updateInDB(student: Student): Promise<Student> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${student.dbId}`,
    method: "PUT",
    data: {
      student: student,
    },
  });
  return response.data;
}

async function removeInDB(dbId: number): Promise<Student> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${dbId}`,
    method: "DELETE",
  });
  return response.data;
}

async function getInDB(): Promise<Student[]> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/`,
    method: "GET",
  });
  return response.data;
}

function* create(action: PayloadAction<Student>) {
  try {
    yield call(createInDB, action.payload);
    yield put(createStudentSuccess());
  } catch (error) {
    yield put(createStudentFailed());
  }
}

function* update(action: PayloadAction<Student>) {
  try {
    yield call(updateInDB, action.payload);
    yield put(updateStudentSuccess());
  } catch (error) {
    yield put(updateStudentFailed());
  }
}

function* remove(action: PayloadAction<number>) {
  try {
    yield call(removeInDB, action.payload);
    yield put(removeStudentSuccess());
  } catch (error) {
    console.log(error);
    yield put(removeStudentFailed());
  }
}

function* get() {
  try {
    const response: Student[] = yield call(getInDB);
    yield put(getStudentSuccess(response));
  } catch (error) {
    yield put(getStudentFailed());
  }
}

export default function* studentSaga() {
  yield takeEvery(createStudent.type, create);
  yield takeEvery(updateStudent.type, update);
  yield takeEvery(removeStudent.type, remove);
  yield takeEvery(getStudent.type, get);
}
