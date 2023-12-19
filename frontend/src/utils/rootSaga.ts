import { all } from "redux-saga/effects";
import studentSaga from "../pages/DataGridPage/saga";
import notificationSaga from "./notificationSaga";
import authSaga from "../pages/SignInPage/saga";

export default function* rootSaga() {
  yield all([studentSaga(), notificationSaga(), authSaga()]);
}
