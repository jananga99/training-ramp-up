import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  createStudent,
  createStudentFailed,
  createStudentSuccess,
  getStudent,
  getStudentFailed,
  getStudentSuccess,
  removeStudent,
  removeStudentFailed,
  removeStudentSuccess,
  updateStudent,
  updateStudentFailed,
  updateStudentSuccess,
} from "./studentSlice";
import { Student } from "../../utils/student";
import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { signInUserFailed, signInUserSuccess } from "../../pages/SignUpPage/userSlice";
import { refreshAsync } from "../../pages/SignUpPage/userSaga";

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
  } else {
    yield put(signInUserFailed());
    alert("You need to be signed in.");
  }
}

function* sagaHandler(action: PayloadAction<Student | number>) {
  const accessToken: string = yield select((state) => state.user.accessToken);
  switch (action.type) {
    case createStudent.type: {
      const response: AxiosResponse = yield call(
        createInDB,
        action.payload as Student,
        accessToken
      );
      if (response.status === 201) {
        yield put(createStudentSuccess(response.data));
      } else if (response.status === 401) {
        yield refresh();
      } else {
        alert("Student create failed");
        yield put(createStudentFailed());
      }
      break;
    }
    case updateStudent.type: {
      const response: AxiosResponse = yield call(
        updateInDB,
        action.payload as Student,
        accessToken
      );
      if (response.status === 200) {
        yield put(updateStudentSuccess(response.data));
      } else if (response.status === 401) {
        yield refresh();
      } else {
        alert("Student update failed");
        yield put(updateStudentFailed());
      }
      break;
    }
    case getStudent.type: {
      const response: AxiosResponse = yield call(getInDB, accessToken);
      if (response.status === 200) {
        yield put(getStudentSuccess(response.data));
      } else if (response.status === 401) {
        yield refresh();
      } else {
        yield put(getStudentFailed());
      }
      break;
    }
    case removeStudent.type: {
      const response: AxiosResponse = yield call(removeInDB, action.payload as number, accessToken);
      if (response.status === 204) {
        yield put(removeStudentSuccess(response.data));
      } else if (response.status === 401) {
        yield refresh();
      } else {
        alert("Student remove failed");
        yield put(removeStudentFailed());
      }
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
