import { all } from "redux-saga/effects";
import studentSaga from "../components/DataGrid/studentSaga";
import notificationSaga from "./notificationSaga";
import authSaga from "../pages/SignInPage/authSaga";

export default function* rootSaga() {
  yield all([studentSaga(), notificationSaga(), authSaga()]);
}
