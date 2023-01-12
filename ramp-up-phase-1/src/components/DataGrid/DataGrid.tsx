import {FC, useEffect, useState} from "react";
import {Grid, GridCellProps, GridColumn, GridItemChangeEvent, GridRow, GridToolbar} from "@progress/kendo-react-grid";
import {DropDownList, DropDownListChangeEvent} from '@progress/kendo-react-dropdowns';
import {Gender, Person} from "./person";
import persons from './sampleData'
import {Button} from "@progress/kendo-react-buttons";
import {userValidationSchema, getDateFromBirthday} from "./personValidation";
import moment from 'moment';


type PersonGrid = Person & {
    isAdding: boolean,
    isEditing: boolean
}

const initialPersonGrid: PersonGrid = {
    id: null,
    name: null,
    gender: null,
    address: null,
    mobileNo: null,
    birthday: null,
    age: null,
    isAdding: false,
    isEditing: false
}


const DataGrid: FC =  ()=>{

    const [data, setData] = useState<PersonGrid[]>([]);
    const [addData, setAddData] = useState<PersonGrid>({...initialPersonGrid});
    const [editData, setEditData] = useState<PersonGrid>({...initialPersonGrid});


    useEffect(()=>{
        setData(persons.map((item) => {
            return {...item, ["isAdding"]: false, ["isEditing"]: false}
        }))
    },[])

    const handleAddNewClick = () => {
        const newRecord = {...initialPersonGrid, ["isAdding"]: true};
        setData([newRecord, ...data]);
        setAddData(newRecord)
    }

    const handleDiscardChanges = () => {
        const newData: PersonGrid[] = []
        data.forEach((val, index)=>{
            if(!val.isAdding){
                newData.push(val)
            }
        })
        setData(newData);
        setAddData({...initialPersonGrid})
    }

    const addRecord = () => {
        // Mon Sep 16 1996
        console.log(addData)
        const getBirthdayOut = getDateFromBirthday(addData.birthday as string)
        if(getBirthdayOut.length===0){
            alert("Invalid Date of birth format")
            return
        }
        const birthDate = new Date(getBirthdayOut)
        const age = moment().diff(birthDate, 'years')
        userValidationSchema.validate({
            id: addData.id,
            name: addData.name,
            gender: addData.gender,
            address: addData.address,
            mobileNo: addData.mobileNo,
            age: age,
        }).then((validData)=>{
            const newData = data.map((item) =>
                item.isAdding ? { ...item, ["isAdding"]: false, ["age"]: age } : item
            );
            setData(newData);
            setAddData({...initialPersonGrid})
        }).catch((err)=>{
            alert(err.errors[0])
        })
    }

    const removeRecord = (id:number) => {
        const newData: PersonGrid[] = []
        data.forEach((val, index)=>{
            if(val.id!==id){
                newData.push(val)
            }
        })
        setData(newData);
    }

    const handleEditClick = (id: number) =>{
        const newData = data.map((item) =>{
            if(id===item.id){
                setEditData({ ...item, isEditing: true })
                return { ...item, isEditing: true }
            }else{
                return item
            }
        });
        setData(newData);
    }

    const editRecord = () => {
        // Mon Sep 16 1996
        const getBirthdayOut = getDateFromBirthday(editData.birthday as string)
        if(getBirthdayOut.length===0){
            alert("Invalid Date of birth format")
            return
        }
        const birthDate = new Date(getBirthdayOut)
        const age = moment().diff(birthDate, 'years')
        userValidationSchema.validate({
            id: editData.id,
            name: editData.name,
            gender: editData.gender,
            address: editData.address,
            mobileNo: editData.mobileNo,
            age: age,
        }).then((validData)=>{
            const newData = data.map((item) =>
                item.isEditing ? { ...item, isEditing: false, age: age } : item
            );
            setData(newData);
            setEditData({...initialPersonGrid})
        }).catch((err)=>{
            alert(err.errors[0])
        })
    }
    

    const handleCancel = () => {
        const newData: PersonGrid[] = []
        data.forEach((val, index)=>{
            if(!val.isEditing){
                newData.push(val)
            }
        })
        setData(newData);
        setAddData({...initialPersonGrid})
    }

    const itemChange = (event: GridItemChangeEvent) => {

        const field = event.field || "";
        const newData = data.map((item) =>
            item.isAdding || item.isEditing  ? { ...item, [field]: event.value } : item
        );
        setData(newData);
        const temp: keyof Person =  event.field as keyof Person;
        if(addData.isAdding){
            addData[temp] = event.value
            setAddData(addData)
        }else if(editData.isEditing){
            editData[temp] = event.value
            setEditData(editData)
        }
        console.log(addData)
    };

    const dropDownChange = (event: DropDownListChangeEvent) => {
        const newData = data.map((item) =>
            item.isAdding || item.isEditing  ? { ...item, gender: event.value } : item
        );
        setData(newData);
        if(addData.isAdding){
            addData.gender = event.value
            setAddData(addData)
        }else if(editData.isEditing){
            editData.gender = event.value
            setEditData(editData)
        }
    };



    return <div>

        <Grid
            editField="inEdit"
            onItemChange={itemChange}
            data={data.map(item=>({
                ...item,
                inEdit: item.isAdding || item.isEditing
            }))}>
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
            <GridColumn title="ID" field="id" editor="numeric"  />
            <GridColumn title="Name" field="name" editor="text" />
            <GridColumn title="Gender" field="gender"  cell={(props: GridCellProps) => {
                if(props.dataItem.isAdding){
                    return <td>
                        <DropDownList
                            data={[Gender.MALE, Gender.FEMALE, Gender.OTHER]}
                            onChange={dropDownChange}
                            value={props.dataItem.gender}
                        />
                    </td>
                }else if(props.dataItem.isEditing){
                    return <td>
                        <DropDownList
                            data={[Gender.MALE, Gender.FEMALE, Gender.OTHER]}
                            value={props.dataItem.gender}
                            onChange={dropDownChange}
                        />
                    </td>
                }else{
                    return <td>
                        {props.dataItem.gender}
                    </td>
                }
            }}/>
            <GridColumn title="Address" field="address" editor="text" />
            <GridColumn title="Mobile No" field="mobileNo" editor="text" />
            <GridColumn title="Date of Birth" field="birthday" editor="text" />
            <GridColumn title="Age" field="age" editor="numeric" cell={(props: GridCellProps) => {
                if(props.dataItem.isAdding){
                    return <td>
                    </td>
                }else{
                    return <td>
                        {props.dataItem.age}
                    </td>
                }
            }}/>
            {/* eslint-disable-next-line react/prop-types */}
            <GridColumn title="command" field="command" cell={(props: GridCellProps) => {
                if(props.dataItem.isAdding){
                    return <td>
                        <Button onClick={addRecord} >Add</Button>
                        <Button onClick={handleDiscardChanges}>Discard Changes</Button>
                    </td>
                }else if(props.dataItem.isEditing){
                    return <td>
                        <Button onClick={editRecord}>Update</Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </td>
                }else{
                    return <td>
                        <Button onClick={()=>{
                            handleEditClick(props.dataItem.id)
                        }} >Edit</Button>
                        <Button onClick={()=>{
                            removeRecord(props.dataItem.id)
                        }}>Remove</Button>
                    </td>
                }
            }} />
        </Grid>
    </div>
}

export default  DataGrid;