import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../pages/DataGridPage/slice";
import authReducer from "../pages/SignInPage/slice";

const rootReducer = combineReducers({
  student: studentReducer,
  auth: authReducer,
});

export default rootReducer;
