import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewStudent, Student } from "../../utils/student";

interface StudentState {
  createLoading: number;
  updateLoading: number;
  removeLoading: number;
  getLoading: number;
  value: Student[];
}

// Loading = 0 no loading
// Loading = (x > 0)     x operations are still loading
const initialState: StudentState = {
  createLoading: 0,
  updateLoading: 0,
  removeLoading: 0,
  getLoading: 0,
  value: [],
};

export const slice = createSlice({
  name: "student",
  initialState,
  reducers: {
    createStudent(state, action: PayloadAction<NewStudent>) {
      state.createLoading += 1;
    },
    createStudentSuccess(state) {
      state.createLoading -= 1;
    },
    createStudentFailed(state) {
      state.createLoading -= 1;
    },
    createReduxStudent(state, action: PayloadAction<Student>) {
      state.value.push(action.payload);
    },

    updateStudent(state, action: PayloadAction<Student>) {
      state.updateLoading += 1;
    },
    updateStudentSuccess(state) {
      state.updateLoading -= 1;
    },
    updateStudentFailed(state) {
      state.updateLoading -= 1;
    },
    updateReduxStudent(state, action: PayloadAction<Student>) {
      state.value = state.value.map((val) => {
        if (val.id === action.payload.id) {
          if (action.payload.name) {
            val.name = action.payload.name;
          }
          if (action.payload.gender) {
            val.gender = action.payload.gender;
          }
          if (action.payload.mobileNo) {
            val.mobileNo = action.payload.mobileNo;
          }
          if (action.payload.birthday) {
            val.birthday = action.payload.birthday;
            val.age = action.payload.age;
          }
        }
        return val;
      });
    },
    removeStudent(state, action: PayloadAction<number>) {
      state.removeLoading += 1;
    },
    removeStudentSuccess(state) {
      state.removeLoading -= 1;
    },
    removeStudentFailed(state) {
      state.removeLoading -= 1;
    },
    removeReduxStudent(state, action: PayloadAction<number>) {
      let ind = -1;
      state.value.forEach((val, index) => {
        if (val.id === action.payload) {
          ind = index;
        }
      });
      if (ind >= 0) {
        state.value.splice(ind, 1);
      }
    },
    getStudent(state) {
      state.getLoading += 1;
    },
    getStudentSuccess(state, action: PayloadAction<Student[]>) {
      state.getLoading -= 1;
      state.value = action.payload;
    },
    getStudentFailed(state) {
      state.getLoading -= 1;
    },
  },
});

export const {
  createStudentFailed,
  createStudentSuccess,
  createStudent,
  createReduxStudent,
  updateStudentFailed,
  updateStudentSuccess,
  updateStudent,
  updateReduxStudent,
  getStudentSuccess,
  getStudentFailed,
  getStudent,
  removeStudentFailed,
  removeStudentSuccess,
  removeStudent,
  removeReduxStudent,
} = slice.actions;

export default slice.reducer;
