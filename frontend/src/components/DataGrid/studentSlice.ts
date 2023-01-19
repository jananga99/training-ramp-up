import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Student } from "../../utils/student";

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

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    createStudent(state, action: PayloadAction<Student>) {
      state.createLoading += 1;
    },
    createStudentSuccess(state, action: PayloadAction<Student>) {
      state.createLoading -= 1;
      state.value.push(action.payload);
    },
    createStudentFailed(state) {
      state.createLoading -= 1;
    },

    updateStudent(state, action: PayloadAction<Student>) {
      state.updateLoading += 1;
    },
    updateStudentSuccess(state, action: PayloadAction<Student>) {
      state.updateLoading -= 1;
      state.value = state.value.map((val) => {
        if (val.id === action.payload.id) {
          return action.payload;
        } else {
          return val;
        }
      });
    },
    updateStudentFailed(state) {
      state.updateLoading -= 1;
    },

    removeStudent(state, action: PayloadAction<number>) {
      state.removeLoading += 1;
    },
    removeStudentSuccess(state, action: PayloadAction<number>) {
      state.removeLoading -= 1;
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
    removeStudentFailed(state) {
      state.removeLoading -= 1;
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
  updateStudentFailed,
  updateStudentSuccess,
  updateStudent,
  getStudentSuccess,
  getStudentFailed,
  getStudent,
  removeStudentFailed,
  removeStudentSuccess,
  removeStudent,
} = studentSlice.actions;

export default studentSlice.reducer;
