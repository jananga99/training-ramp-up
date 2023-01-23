import { all } from "redux-saga/effects";
import studentSaga from "../components/DataGrid/studentSaga";
import notificationSaga from "./notificationSaga";
import userSaga from "../pages/SignUpPage/userSaga";

export default function* rootSaga() {
  yield all([studentSaga(), notificationSaga(), userSaga()]);
}
