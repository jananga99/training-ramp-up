import { FC, useEffect, useState } from "react";
import {
  Grid,
  GridCellProps,
  GridColumn,
  GridItemChangeEvent,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import { Gender, Student } from "../../utils/student";
import students from "../../utils/sampleData";
import { userValidationSchema } from "../../utils/personValidation";
import moment from "moment";
import { AddNewButton } from "./AddNewButton/AddNewButton";
import { GenderCell } from "./GenderCell/GenderCell";
import { AgeCell } from "./AgeCell/AgeCell";
import { CommandCell } from "./CommandCell/CommandCell";

export type StudentGrid = Student & {
  isAdding: boolean;
  isEditing: boolean;
};

const initialStudentGrid: StudentGrid = {
  id: 0,
  name: "",
  gender: Gender.MALE,
  address: "",
  mobileNo: "",
  birthday: new Date(),
  age: 0,
  isAdding: false,
  isEditing: false,
};

const compareStudentGrid = (a: StudentGrid, b: StudentGrid) => (b.id as number) - (a.id as number);

const calculateAge = (birthday: Date) => moment().diff(birthday, "years");

const convertStudentGridMapToSortedArray = (data: Map<number, StudentGrid>) =>
  Array.from(data.entries())
    .map(([, value]) => {
      return { ...value, inEdit: value.isAdding || value.isEditing };
    })
    .sort(compareStudentGrid);

const DataGrid: FC = () => {
  const [data, setData] = useState<Map<number, StudentGrid>>(new Map());
  const [editIds, setEditIds] = useState<number[]>([]);
  const [prevEditData, setPrevEditData] = useState<Map<number, StudentGrid>>(new Map());
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    students.forEach((item, index) => {
      data.set(index, {
        ...item,
        isAdding: false,
        isEditing: false,
        id: index,
        birthday: new Date(item.birthday),
        age: calculateAge(new Date(item.birthday)),
      });
    });
    setCount(students.length);
  }, []);

  const handleAddNewClick = () => {
    const newId = count;
    const newRecord = { ...initialStudentGrid, isAdding: true, id: newId };
    data.set(newId, newRecord);
    setCount(count + 1);
  };

  const handleDiscardChanges = (id: number) => {
    data.delete(id);
    setData(new Map(data));
  };

  const addRecord = (id: number) => {
    const addData = data.get(id) as StudentGrid;
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
        data.set(id, { ...(data.get(id) as StudentGrid), isAdding: false, age: addData.age });
        alert(`Student with ${id} is added`);
        setData(new Map(data));
      })
      .catch((err) => {
        console.log(err.errors);
        alert(err.errors);
      });
  };

  const removeRecord = (id: number) => {
    data.delete(id);
    alert(`Student with ${id} is deleted`);
    setData(new Map(data));
  };

  const handleEditClick = (id: number) => {
    setEditIds([...editIds, id]);
    prevEditData.set(id, data.get(id) as StudentGrid);
    data.set(id, { ...(data.get(id) as StudentGrid), isEditing: true });
    setData(new Map(data));
  };

  const editRecord = (id: number) => {
    const editData = data.get(id) as StudentGrid;
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
        data.set(id, { ...(data.get(id) as StudentGrid), isEditing: false, age: editData.age });
        alert(`Student with ${id} is updated`);
        prevEditData.delete(id);
        setPrevEditData(prevEditData);
        editIds.slice(editIds.indexOf(id), 1);
        setEditIds([...editIds]);
      })
      .catch((err) => {
        alert(err.errors);
      });
  };

  const handleCancel = (id: number) => {
    data.set(id, prevEditData.get(id) as StudentGrid);
    prevEditData.delete(id);
    setPrevEditData(prevEditData);
    editIds.slice(editIds.indexOf(id), 1);
    setEditIds([...editIds]);
  };

  const itemChange = (event: GridItemChangeEvent) => {
    const field = event.field as keyof StudentGrid;
    if (field === "birthday") {
      (data.get(event.dataItem.id) as StudentGrid).age = calculateAge(event.value);
      (data.get(event.dataItem.id) as StudentGrid).birthday = event.value;
    } else {
      data.set(event.dataItem.id, {
        ...(data.get(event.dataItem.id) as StudentGrid),
        [field]: event.value,
      });
    }
    setData(new Map(data));
  };

  const dropDownChange = (event: DropDownListChangeEvent, id: number) => {
    (data.get(id) as StudentGrid).gender = event.value;
    setData(new Map(data));
  };

  return (
    <div>
      <Grid
        editField="inEdit"
        onItemChange={itemChange}
        data={convertStudentGridMapToSortedArray(data)}
      >
        <GridToolbar>
          <AddNewButton handleAddNewClick={handleAddNewClick} />
        </GridToolbar>
        <GridColumn
          title="Id"
          field="id"
          editor="numeric"
          cell={(props: GridCellProps) => <td>{props.dataItem.id}</td>}
        />
        <GridColumn title="Name" field="name" editor="text" />
        <GridColumn
          title="Gender"
          field="gender"
          cell={(props: GridCellProps) => (
            <GenderCell dropDownChange={dropDownChange} student={props.dataItem} />
          )}
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
          cell={(props: GridCellProps) => <AgeCell student={props.dataItem} />}
        />
        {/* eslint-disable-next-line react/prop-types */}
        <GridColumn
          title="command"
          field="command"
          cell={(props: GridCellProps) => (
            <CommandCell
              student={props.dataItem}
              editRecord={editRecord}
              handleEditClick={handleEditClick}
              handleCancel={handleCancel}
              addRecord={addRecord}
              handleDiscardChanges={handleDiscardChanges}
              removeRecord={removeRecord}
            />
          )}
        />
      </Grid>
    </div>
  );
};

export default DataGrid;
