import { FC, useEffect, useState } from "react";
import {
  Grid,
  GridCellProps,
  GridColumn,
  GridItemChangeEvent,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { DropDownList, DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import { Gender, Student } from "./student";
import { Button } from "@progress/kendo-react-buttons";
import { userValidationSchema } from "./personValidation";
import moment from "moment";
import "./DataGrid.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import {
  createAddNewReduxStudent,
  createStudent,
  getStudent,
  removeAddNewReduxStudent,
  removeStudent,
  updateReduxStudentFromDB,
  updateReduxStudentFromGrid,
  updateReduxStudentToEditing,
  updateStudent,
} from "./studentSlice";

const DataGrid: FC = () => {
  const [editIds, setEditIds] = useState<number[]>([]);
  const [prevEditData, setPrevEditData] = useState<Map<number, Student>>(new Map());

  const students = useSelector((state: RootState) => state.student.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStudent());
  }, []);

  const handleAddNewClick = () => {
    dispatch(createAddNewReduxStudent());
  };

  const handleDiscardChanges = (keyId: number) => {
    dispatch(removeAddNewReduxStudent(keyId));
  };

  const addRecord = (keyId: number) => {
    let ind = -1;
    students.forEach((val, index) => {
      if (val.keyId === keyId) {
        ind = index;
      }
    });
    if (ind < 0) {
      return;
    }
    const addData = students[ind];
    userValidationSchema
      .validate({
        id: addData.id,
        name: addData.name,
        gender: addData.gender,
        address: addData.address,
        mobileNo: addData.mobileNo,
        age: addData.age,
      })
      .then(() => {
        let isDuplicate = false;
        students.forEach((val) => {
          if (val.keyId !== keyId && val.id === addData.id) {
            alert("Duplicate Id");
            isDuplicate = true;
          }
        });
        if (!isDuplicate) {
          dispatch(createStudent({ ...addData }));
          dispatch(removeAddNewReduxStudent(keyId));
        }
      })
      .catch((err) => {
        alert(err.errors);
      });
  };

  const removeRecord = (dbId: number) => {
    dispatch(removeStudent(dbId));
  };

  const handleEditClick = (dbId: number) => {
    setEditIds([...editIds, dbId]);
    let ind = -1;
    students.forEach((val, index) => {
      if (val.dbId === dbId) {
        ind = index;
      }
    });
    if (ind < 0) {
      return;
    }
    prevEditData.set(dbId, students[ind]);
    dispatch(updateReduxStudentToEditing(dbId));
  };

  const editRecord = (dbId: number) => {
    let ind = -1;
    students.forEach((val, index) => {
      if (val.dbId === dbId) {
        ind = index;
      }
    });
    if (ind < 0) {
      return;
    }
    const editData = students[ind];
    userValidationSchema
      .validate({
        id: editData.id,
        name: editData.name,
        gender: editData.gender,
        address: editData.address,
        mobileNo: editData.mobileNo,
        age: editData.age,
      })
      .then(() => {
        let isDuplicate = false;
        students.forEach((val) => {
          if (val.dbId !== dbId && val.id === editData.id) {
            alert("Duplicate Id");
            isDuplicate = true;
          }
        });
        if (!isDuplicate) {
          dispatch(updateStudent({ ...editData }));
          editIds.slice(editIds.indexOf(dbId), 1);
          setEditIds(editIds);
          prevEditData.delete(dbId);
          setPrevEditData(prevEditData);
        }
      })
      .catch((err) => {
        alert(err.errors);
      });
  };

  const handleCancel = (dbId: number) => {
    dispatch(updateReduxStudentFromDB(prevEditData.get(dbId) as Student));
    editIds.splice(editIds.indexOf(dbId), 1);
    setEditIds(editIds);
    prevEditData.delete(dbId);
    setPrevEditData(prevEditData);
  };

  const itemChange = (event: GridItemChangeEvent) => {
    const field = event.field || "";
    let ind = -1;
    students.forEach((val, index) => {
      if (val.keyId === event.dataItem.keyId) {
        ind = index;
      }
    });
    if (ind < 0) {
      return;
    }
    if (field === "birthday") {
      dispatch(
        updateReduxStudentFromGrid({
          ...students[ind],
          birthday: event.value,
          age: moment().diff(event.value, "years"),
        })
      );
    } else {
      dispatch(updateReduxStudentFromGrid({ ...students[ind], [field]: event.value }));
    }
  };

  const dropDownChange = (event: DropDownListChangeEvent, keyId: number) => {
    let ind = -1;
    students.forEach((val, index) => {
      if (val.keyId === keyId) {
        ind = index;
      }
    });
    if (ind < 0) {
      return;
    }
    dispatch(updateReduxStudentFromGrid({ ...students[ind], gender: event.value }));
  };

  return (
    <div>
      <Grid editField="inEdit" onItemChange={itemChange} data={students}>
        <GridToolbar>
          <div>
            <button
              title="Add new"
              className="k-button k-button-md k-rounded-md k-button-solid"
              onClick={handleAddNewClick}
            >
              Add new
            </button>
          </div>
        </GridToolbar>
        <GridColumn title="ID" field="id" editor="numeric" />
        <GridColumn title="Name" field="name" editor="text" />
        <GridColumn
          title="Gender"
          field="gender"
          cell={(props: GridCellProps) => {
            if (props.dataItem.isAdding || props.dataItem.isEditing) {
              return (
                <td>
                  <DropDownList
                    data={[Gender.MALE, Gender.FEMALE, Gender.OTHER]}
                    onChange={(event) => {
                      dropDownChange(event, props.dataItem.keyId);
                    }}
                    value={props.dataItem.gender}
                  />
                </td>
              );
            } else {
              return <td>{props.dataItem.gender}</td>;
            }
          }}
        />
        <GridColumn title="Address" field="address" editor="text" />
        <GridColumn title="Mobile No" field="mobileNo" editor="text" />
        <GridColumn
          title="Date of Birth"
          field="birthday"
          editor="date"
          format="{0:E MMM dd yyyy}"
        />
        <GridColumn
          title="Age"
          field="age"
          editor="numeric"
          cell={(props: GridCellProps) => {
            if (props.dataItem.isAdding) {
              return <td></td>;
            } else {
              return <td>{props.dataItem.age}</td>;
            }
          }}
        />
        {/* eslint-disable-next-line react/prop-types */}
        <GridColumn
          title="command"
          field="command"
          cell={(props: GridCellProps) => {
            if (props.dataItem.isAdding) {
              return (
                <td>
                  <Button
                    onClick={() => {
                      addRecord(props.dataItem.keyId);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      handleDiscardChanges(props.dataItem.keyId);
                    }}
                  >
                    Discard Changes
                  </Button>
                </td>
              );
            } else if (props.dataItem.isEditing) {
              return (
                <td>
                  <Button
                    onClick={() => {
                      editRecord(props.dataItem.dbId);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => {
                      handleCancel(props.dataItem.dbId);
                    }}
                  >
                    Cancel
                  </Button>
                </td>
              );
            } else {
              return (
                <td>
                  <Button
                    className="command-edit-button"
                    onClick={() => {
                      handleEditClick(props.dataItem.dbId);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      removeRecord(props.dataItem.dbId);
                    }}
                  >
                    Remove
                  </Button>
                </td>
              );
            }
          }}
        />
      </Grid>
    </div>
  );
};

export default DataGrid;
