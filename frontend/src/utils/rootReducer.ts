import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../components/DataGrid/studentSlice";
import userReducer from "../pages/SignUpPage/userSlice";

const rootReducer = combineReducers({
  student: studentReducer,
  user: userReducer,
});

export default rootReducer;
