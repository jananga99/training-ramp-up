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

function* sagaHandler(action: PayloadAction<Student | number>) {
  try {
    switch (action.type) {
      case createStudent.type: {
        yield call(createInDB, action.payload as Student);
        yield put(createStudentSuccess());
        break;
      }
      case updateStudent.type: {
        yield call(updateInDB, action.payload as Student);
        yield put(updateStudentSuccess());
        break;
      }
      case getStudent.type: {
        const response: Student[] = yield call(getInDB);
        yield put(getStudentSuccess(response));
        break;
      }
      case removeStudent.type: {
        yield call(removeInDB, action.payload as number);
        yield put(removeStudentSuccess());
        break;
      }
    }
  } catch (error: any) {
    switch (action.type) {
      case createStudent.type:
        yield put(createStudentFailed());
        break;
      case updateStudent.type:
        yield put(updateStudentFailed());
        break;
      case getStudent.type:
        yield put(getStudentFailed());
        break;
      case removeStudent.type:
        yield put(removeStudentFailed());
        break;
    }
    alert(error.message);
  }
}

export default function* studentSaga() {
  yield takeEvery(
    [removeStudent.type, createStudent.type, updateStudent.type, getStudent.type],
    sagaHandler
  );
}
