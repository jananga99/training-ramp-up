import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from "../components/DataGrid/studentSlice";

const rootReducer = combineReducers({
  student: studentReducer,
});

export default rootReducer;
