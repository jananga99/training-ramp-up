import {FC, useEffect, useState} from "react";
import {Grid, GridCellProps, GridColumn, GridItemChangeEvent, GridRow, GridToolbar} from "@progress/kendo-react-grid";
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
    const [editData, setEditData] = useState<PersonGrid>({...initialPersonGrid});


    useEffect(()=>{
        setData(persons.map((item) => {
            return {...item, ["isAdding"]: false, ["isEditing"]: false}
        }))
    },[])

    const handleAddNewClick = () => {
        const newRecord = {...initialPersonGrid, ["isAdding"]: true};
        setData([newRecord, ...data]);
    }

    const handleDiscardChanges = () => {
        const newData: PersonGrid[] = []
        data.forEach((val, index)=>{
            if(!val.isAdding){
                newData.push(val)
            }
        })
        setData(newData);
        setEditData({...initialPersonGrid})
    }

    const addRecord = () => {
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
                item.isAdding ? { ...item, ["isAdding"]: false, ["age"]: age } : item
            );
            setData(newData);
            setEditData({...initialPersonGrid})
        }).catch((err)=>{
            alert(err.errors[0])
        })
    }

    const itemChange = (event: GridItemChangeEvent) => {
        // console.log(event)
        const field = event.field || "";
        const newData = data.map((item) =>
            item.isAdding || item.isEditing  ? { ...item, [field]: event.value } : item
        );
        setData(newData);
        const temp: keyof Person =  event.field as keyof Person;
        editData[temp] = event.value
        setEditData(editData)
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
            <GridColumn title="Gender" field="gender" editor="text" />
            <GridColumn title="Address" field="address" editor="text" />
            <GridColumn title="Mobile No" field="mobileNo" editor="text" />
            <GridColumn title="Date of Birth" field="birthday" editor="text" />
            <GridColumn title="Age" field="age" editor="numeric" cell={(props: GridCellProps) => {
                if(props.dataItem.tempId === -1){
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
                console.log(props.dataItem)
                if(props.dataItem.isAdding){
                    return <td>
                        <Button onClick={addRecord} >Add</Button>
                        <Button onClick={handleDiscardChanges}>Discard Changes</Button>
                    </td>
                }else{
                    return <td>
                        <Button onClick={addRecord} >Edit</Button>
                        <Button onClick={handleDiscardChanges}>Remove</Button>
                    </td>
                }
            }} />
        </Grid>
    </div>
}

export default  DataGrid;