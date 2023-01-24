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

async function createInDB(student: Student, accessToken: string): Promise<Student> {
  const response = await axios({
    url: `${process.env.REACT_APP_BACKEND_SERVER_URL}students/`,
    method: "POST",
    data: {
      student: student,
    },
  });
  console.log(response.status);
  if (response.status === 201) {
    return response.data;
  }
  if (response.data.message) {
    throw new Error(response.data.message);
  } else {
    throw new Error("An unknown error occurred.");
  }
}

async function updateInDB(student: Student, accessToken: string): Promise<Student> {
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

async function removeInDB(id: number, accessToken: string): Promise<boolean> {
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

async function getInDB(accessToken: string): Promise<AxiosResponse> {
  console.log("get in db");
  console.log(accessToken);
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

function* sagaHandler(action: PayloadAction<Student | number>) {
  const accessToken: string = yield select((state) => state.user.accessToken);

  switch (action.type) {
    case createStudent.type: {
      yield call(createInDB, action.payload as Student, accessToken);
      yield put(createStudentSuccess());
      break;
    }
    case updateStudent.type: {
      yield call(updateInDB, action.payload as Student, accessToken);
      yield put(updateStudentSuccess());
      break;
    }
    case getStudent.type: {
      console.log(typeof accessToken);
      const response: AxiosResponse = yield call(getInDB, accessToken);
      if (response.status === 200) {
        yield put(getStudentSuccess(response.data));
      } else if (response.status === 401) {
        const response: AxiosResponse = yield call(refreshAsync);
        if (response.status === 200) {
          yield put(signInUserSuccess(response.data.accessToken));
        } else {
          yield put(signInUserFailed());
        }
      }
      break;
    }
    case removeStudent.type: {
      yield call(removeInDB, action.payload as number, accessToken);
      yield put(removeStudentSuccess());
      break;
    }

    //   console.log(error);
    //   console.log(error.response.status);
    //   if (error.response.status === 401) {
    //     try {
    //       const token: string = yield call(refreshAsync);
    //       yield put(signInUserSuccess(token));
    //       console.log(token);
    //     } catch (err) {
    //       yield put(signInUserFailed());
    //     }
    //   } else {
    //     switch (action.type) {
    //       case createStudent.type:
    //         yield put(createStudentFailed());
    //         break;
    //       case updateStudent.type:
    //         yield put(updateStudentFailed());
    //         break;
    //       case getStudent.type:
    //         yield put(getStudentFailed());
    //         break;
    //       case removeStudent.type:
    //         yield put(removeStudentFailed());
    //         break;
    //     }
    //     alert(error.message);
  }
}

export default function* studentSaga() {
  yield takeEvery(
    [removeStudent.type, createStudent.type, updateStudent.type, getStudent.type],
    sagaHandler
  );
}
