import { all } from "redux-saga/effects";
import studentSaga from "../components/DataGrid/studentSaga";

export default function* rootSaga() {
  yield all([studentSaga()]);
}
