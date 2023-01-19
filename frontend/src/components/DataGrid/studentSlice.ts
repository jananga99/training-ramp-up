import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gender, Student } from "./student";

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
    createStudentSuccess(state) {
      state.createLoading -= 1;
    },
    createStudentFailed(state) {
      state.createLoading -= 1;
    },
    createReduxStudent(state, action: PayloadAction<Student>) {
      state.value.push({
        ...action.payload,
        isAdding: false,
        isEditing: false,
        inEdit: false,
        keyId: state.value.length,
        birthday: new Date(action.payload.birthday as unknown as string),
      });
    },
    createAddNewReduxStudent(state) {
      state.value.push({
        id: 0,
        dbId: undefined,
        name: "",
        gender: Gender.MALE,
        address: "",
        mobileNo: "",
        birthday: null,
        age: null,
        isAdding: true,
        isEditing: false,
        keyId: state.value.length,
        inEdit: true,
      });
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
    updateReduxStudentFromDB(state, action: PayloadAction<Student>) {
      state.value = state.value.map((val) => {
        if (val.dbId === action.payload.dbId) {
          if (val.isEditing) {
            return { ...val, isEditing: false, isAdding: false, inEdit: false };
          } else {
            return {
              ...action.payload,
              isAdding: false,
              isEditing: false,
              inEdit: false,
              birthday: new Date(action.payload.birthday as unknown as string),
            };
          }
        } else {
          return val;
        }
      });
    },
    updateReduxStudentFromGrid(state, action: PayloadAction<Student>) {
      state.value = state.value.map((val) => {
        if (val.keyId === action.payload.keyId) {
          return { ...action.payload };
        } else {
          return val;
        }
      });
    },
    updateReduxStudentToEditing(state, action: PayloadAction<number>) {
      state.value = state.value.map((val) => {
        if (val.dbId === action.payload) {
          return { ...val, isAdding: false, isEditing: true, inEdit: true };
        } else {
          return val;
        }
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
        if (val.dbId === action.payload) {
          ind = index;
        }
      });
      if (ind >= 0) {
        state.value.splice(ind, 1);
      }
    },
    removeAddNewReduxStudent(state, action: PayloadAction<number>) {
      let ind = -1;
      state.value.forEach((val, index) => {
        if (val.keyId === action.payload) {
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
      state.value = state.value.map((val, index) => {
        return {
          ...val,
          isAdding: false,
          isEditing: false,
          keyId: index,
          inEdit: false,
          birthday: new Date(val.birthday as unknown as string),
        };
      });
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
  createAddNewReduxStudent,
  updateStudentFailed,
  updateStudentSuccess,
  updateStudent,
  updateReduxStudentFromDB,
  updateReduxStudentFromGrid,
  updateReduxStudentToEditing,
  getStudentSuccess,
  getStudentFailed,
  getStudent,
  removeStudentFailed,
  removeStudentSuccess,
  removeStudent,
  removeReduxStudent,
  removeAddNewReduxStudent,
} = studentSlice.actions;

export default studentSlice.reducer;
