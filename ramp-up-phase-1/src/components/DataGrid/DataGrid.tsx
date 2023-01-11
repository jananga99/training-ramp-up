import {FC, useEffect, useState} from "react";
import {Grid, GridCellProps, GridColumn, GridItemChangeEvent, GridRow, GridToolbar} from "@progress/kendo-react-grid";
import {Gender, Person} from "./person";
import persons from './sampleData'
import CommandButtons from "./CommandButtons/CommandButtons";
import {Button} from "@progress/kendo-react-buttons";
import userValidationSchema from "./personValidatio";
import moment from 'moment';

const getDateFromBirthday = (birthday:string)=>{
    const arr = birthday.split(' ')
    let month = ''
    if(!["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(arr[0] as never)){
        console.log("Invalid week day")
        return ''
    }else if(!["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Sep", "Oct", "Nov", "Dec"].includes(arr[1] as never)){
        console.log("Invalid Month")
        return ''
    }
    switch (arr[1]) {
        case "Jan":
            month='1'
            break
        case "Feb":
            month='2'
            break
        case "Mar":
            month='3'
            break
        case "Apr":
            month='4'
            break
        case "May":
            month='5'
            break
        case "Jum":
            month='6'
            break
        case "Jul":
            month='7'
            break
        case "Aug":
            month='8'
            break
        case "Sep":
            month='9'
            break
        case "Oct":
            month='10'
            break
        case "Nov":
            month='11'
            break
        case "Dec":
            month='12'
            break
    }
    return arr[3]+"-"+month+"-"+arr[2]
}



const DataGrid: FC =  ()=>{

    const [data, setData] = useState<Person[]>([]);
    const [editData, setEditData] = useState<Person>({
        id: null,
        name: null,
        gender: null,
        address: null,
        mobileNo: null,
        birthday: null,
        age: null,
        tempId: null
    });
    

    useEffect(()=>{
        setData(persons)
    },[])

    const handleAddNewClick = () => {
        const newRecord = {
            id: null,
            name: null,
            gender: null,
            address: null,
            mobileNo: null,
            birthday: null,
            age: null,
            tempId: -1,
            inEdit: true
        };
        setData([newRecord, ...data]);
    }

    const handleDiscardChanges = () => {
        const newData: Person[] = []
        data.forEach((val, index)=>{
            if(val.tempId !== -1){
                newData.push(val)
            }
        })
        setData(newData);
        setEditData({
            id: null,
            name: null,
            gender: null,
            address: null,
            mobileNo: null,
            birthday: null,
            age: null,
            tempId: null
        })
    }

    const addRecord = () => {
        console.log("in add record")
        console.log(editData)
        // Mon Sep 16 1996
        const getBirthdayOut = getDateFromBirthday(editData.birthday as string)
        if(getBirthdayOut.length===0){
            alert("Invalid Date of birth format")
            return
        }
        const birthDate = new Date(getBirthdayOut)
        const age = moment().diff(birthDate, 'years')
        console.log(age)
        userValidationSchema.validate({
            id: editData.id,
            name: editData.name,
            gender: editData.gender,
            address: editData.address,
            mobileNo: editData.mobileNo,
            age: age,
        }).then((validData)=>{
            console.log("before valid")
                console.log("valid")
                const newData = data.map((item) =>
                    item.tempId === -1 ? { ...item, ["tempId"]: 0, ["age"]: age } : item
                );
                setData(newData);
                setEditData({
                    id: null,
                    name: null,
                    gender: null,
                    address: null,
                    mobileNo: null,
                    birthday: null,
                    age: null,
                    tempId: null
                })
        }).catch((err)=>{
            console.log(err.errors)
            alert(err.errors[0])
        })
    }

    const itemChange = (event: GridItemChangeEvent) => {
        console.log(event)
        const field = event.field || "";
        const newData = data.map((item) =>
            item.tempId === -1 ? { ...item, [field]: event.value } : item
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
            command: <CommandButtons />,
                inEdit: item.tempId === -1
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
            <GridColumn title="Age" field="age" editor="numeric" />
            {/* eslint-disable-next-line react/prop-types */}
            <GridColumn title="command" field="command" cell={(props) => (
                <td>
                    <Button onClick={addRecord} >Add</Button>
                    <Button onClick={handleDiscardChanges}>Discard Changes</Button>
                </td>
            )} />
        </Grid>
    </div>
}

export default  DataGrid;