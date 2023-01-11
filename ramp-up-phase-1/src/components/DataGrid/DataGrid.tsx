import {FC, useEffect, useState} from "react";
import {Grid, GridCellProps, GridColumn, GridItemChangeEvent, GridRow, GridToolbar} from "@progress/kendo-react-grid";
import { Person} from "./person";
import persons from './sampleData'
import CommandButtons from "./CommandButtons/CommandButtons";
import {Button} from "@progress/kendo-react-buttons";




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
        // TODO Validate
        const newData = data.map((item) =>
            item.tempId === -1 ? { ...item, ["tempId"]: 0 } : item
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
    }

    const itemChange = (event: GridItemChangeEvent) => {
        console.log(event)
        const field = event.field || "";
        const newData = data.map((item) =>
            item.tempId === -1 ? { ...item, [field]: event.value } : item
        );
        setData(newData);
        const temp =  'id' || event.field;
        if( event.field){
            editData[temp] = event.value
            setEditData(editData)
        }
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
            <GridColumn title="ID" field="id"  />
            <GridColumn title="Name" field="name" editor="text" />
            <GridColumn title="Gender" field="gender" />
            <GridColumn title="Address" field="address" />
            <GridColumn title="Mobile No" field="mobileNo" />
            <GridColumn title="Date of Birth" field="birthday" />
            <GridColumn title="Age" field="age" />
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