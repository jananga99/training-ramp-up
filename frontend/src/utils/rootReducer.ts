import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../components/DataGrid/studentSlice";
import authReducer from "../pages/SignInPage/authSlice";

const rootReducer = combineReducers({
  student: studentReducer,
  auth: authReducer,
});

export default rootReducer;
