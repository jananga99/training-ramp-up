import {FC, useEffect, useState} from "react";
import {
    Grid,
    GridCellProps,
    GridColumn,
    GridItemChangeEvent,
    GridToolbar
} from "@progress/kendo-react-grid";
import {DropDownList, DropDownListChangeEvent} from '@progress/kendo-react-dropdowns';
import {Gender, Person} from "./person";
import persons from './sampleData'
import {Button} from "@progress/kendo-react-buttons";
import {userValidationSchema} from "./personValidation";
import moment from 'moment';
import './DataGrid.scss'


type PersonGrid = Person & {
    isAdding: boolean,
    isEditing: boolean,
    keyId: number | null
}

const initialPersonGrid: PersonGrid = {
    id: 0,
    name: '',
    gender: Gender.MALE,
    address: '',
    mobileNo: '',
    birthday: null,
    age: null,
    isAdding: false,
    isEditing: false,
    keyId: null
}


const DataGrid: FC =  ()=>{

    const [data, setData] = useState<Map<number,PersonGrid>>(new Map());
    const [editIds, setEditIds] = useState<number[]>([]);
    const [prevEditData, setPrevEditData] = useState<Map<number, PersonGrid>>(new Map())
    const [keyIdCount, setKeyIdCount] = useState<number>(0)
    const [gridData, setGridData] = useState<PersonGrid[]>([])

    useEffect(()=>{
        persons.forEach((item, index) => {
            data.set(index, {...item, isAdding: false, isEditing: false, keyId: index, birthday: new Date(item.birthday)})
        })
        setKeyIdCount(persons.length)
        manualSetData()
    },[])
    
    const manualSetData = ()=>{
        setData(data);
        setGridData(Array.from(data.values()).sort((a,b)=>{
            return (b.keyId as number) - (a.keyId as number);
        }))
    }

    const handleAddNewClick = () => {
        const newRecord = {...initialPersonGrid, isAdding: true, keyId: keyIdCount};
        data.set(keyIdCount, newRecord)
        manualSetData();
        setKeyIdCount(keyIdCount+1)
    }

    const handleDiscardChanges = (keyId: number) => {
        data.delete(keyId)
        manualSetData();
    }

    const addRecord = (keyId: number) => {
        const addData = data.get(keyId) as PersonGrid
        let age = -1
        if(addData.birthday !== null){
            age = moment().diff(addData.birthday, 'years');
        }
        userValidationSchema.validate({
            id: addData.id,
            name: addData.name,
            gender: addData.gender,
            address: addData.address,
            mobileNo: addData.mobileNo,
            age: age,
        }).then(()=>{
            let isDuplicate = false
            data.forEach((val)=>{
                if(val.keyId!==keyId && val.id===(data.get(keyId) as PersonGrid).id){
                    alert("Duplicate Id")
                    isDuplicate = true
                }
            })
            if(!isDuplicate){
                data.set(keyId, { ...data.get(keyId) as PersonGrid, isAdding: false, age: age })
                manualSetData();
            }
        }).catch((err)=>{
            console.log(err.errors)
            alert(err.errors)
        })
    }

    const removeRecord = (keyId:number) => {
        data.delete(keyId)
        manualSetData();
    }

    const handleEditClick = (keyId: number) =>{
        setEditIds([...editIds, keyId])
        prevEditData.set(keyId, data.get(keyId) as PersonGrid)
        data.set(keyId, {...data.get(keyId) as PersonGrid, isEditing: true})
        manualSetData();
    }

    const editRecord = (keyId: number) => {
        const editData = data.get(keyId) as PersonGrid
        let age = -1
        if(editData.birthday !== null){
            age = moment().diff(editData.birthday, 'years');
        }
        userValidationSchema.validate({
            id: editData.id,
            name: editData.name,
            gender: editData.gender,
            address: editData.address,
            mobileNo: editData.mobileNo,
            age: age,
        }).then(()=>{
            let isDuplicate = false
            data.forEach((val)=>{
                if(val.keyId!==keyId && val.id===(data.get(keyId) as PersonGrid).id){
                    alert("Duplicate Id")
                    isDuplicate = true
                }
            })
            if(!isDuplicate){
                data.set(keyId, { ...data.get(keyId) as PersonGrid, isEditing: false, age: age })
                manualSetData();
                editIds.slice(editIds.indexOf(keyId), 1)
                setEditIds(editIds)
                prevEditData.delete(keyId)
                setPrevEditData(prevEditData)
            }
        }).catch((err)=>{
            alert(err.errors)
        })
    }
    

    const handleCancel = (keyId:number) => {
        data.set(keyId, prevEditData.get(keyId) as PersonGrid)
        manualSetData()
        editIds.slice(editIds.indexOf(keyId), 1)
        setEditIds(editIds)
        prevEditData.delete(keyId)
        setPrevEditData(prevEditData)
    }

    const itemChange = (event: GridItemChangeEvent) => {
        const field = event.field || "";
        data.set(event.dataItem.keyId, { ...data.get(event.dataItem.keyId) as PersonGrid, [field]: event.value })
        manualSetData();
    };

    const dropDownChange = (event: DropDownListChangeEvent, keyId:number) => {
        data.set(keyId, { ...data.get(keyId) as PersonGrid, gender: event.value })
        manualSetData();
    };



    return <div>

        <Grid
            editField="inEdit"
            onItemChange={itemChange}
            data={gridData.map(item=>{
                return ({
                    ...item,
                    inEdit: item.isAdding || item.isEditing
                })
            })}>
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
            <GridColumn title="Gender" field="gender"  cell={(props: GridCellProps) => {
                if(props.dataItem.isAdding || props.dataItem.isEditing){
                    return <td>
                        <DropDownList
                            data={[Gender.MALE, Gender.FEMALE, Gender.OTHER]}
                            onChange={(event)=>{
                                dropDownChange(event, props.dataItem.keyId)
                            }}
                            value={props.dataItem.gender}
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
            <GridColumn title="Date of Birth" field="birthday" editor="date" format="{0:E MMM dd yyyy}" />
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
                        <Button onClick={()=>{
                            addRecord(props.dataItem.keyId)
                        }} >Add</Button>
                        <Button onClick={()=>{
                            handleDiscardChanges(props.dataItem.keyId)
                        }}>Discard Changes</Button>
                    </td>
                }else if(props.dataItem.isEditing){
                    return <td>
                        <Button onClick={()=>{
                            editRecord(props.dataItem.keyId)
                        }}>Update</Button>
                        <Button onClick={()=>{
                            handleCancel(props.dataItem.keyId)
                        }}>Cancel</Button>
                    </td>
                }else{
                    return <td>
                        <Button className="command-edit-button" onClick={()=>{
                            handleEditClick(props.dataItem.keyId)
                        }} >Edit</Button>
                        <Button onClick={()=>{
                            removeRecord(props.dataItem.keyId)
                        }}>Remove</Button>
                    </td>
                }
            }} />
        </Grid>
    </div>
}

export default  DataGrid;