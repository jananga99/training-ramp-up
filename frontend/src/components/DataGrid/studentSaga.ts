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
  return response.data;
}

async function updateInDB(student: Student): Promise<Student> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${student.id}`,
    method: "PUT",
    data: {
      student: student,
    },
  });
  return response.data;
}

async function removeInDB(id: number): Promise<Student> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/${id}`,
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
    const response: Student = yield call(createInDB, action.payload);
    if (response) {
      yield put(createStudentSuccess(response));
    } else {
      yield put(createStudentFailed());
    }
  } catch (error) {
    yield put(createStudentFailed());
  }
}

function* update(action: PayloadAction<Student>) {
  try {
    const response: Student = yield call(updateInDB, action.payload);
    if (response) {
      yield put(updateStudentSuccess(response));
    } else {
      yield put(updateStudentFailed());
    }
  } catch (error) {
    yield put(updateStudentFailed());
  }
}

function* remove(action: PayloadAction<number>) {
  try {
    const response: number = yield call(removeInDB, action.payload);
    if (response) {
      yield put(removeStudentSuccess(response));
    } else {
      yield put(removeStudentFailed());
    }
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
