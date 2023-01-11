import {FC, useEffect, useState} from "react";
import {Grid, GridCellProps, GridColumn, GridRow, GridToolbar} from "@progress/kendo-react-grid";
import {Gender, Person} from "./person";
import persons from './sampleData'
import CommandButtons from "./CommandButtons/CommandButtons";




const DataGrid: FC =  ()=>{

    const [people, setPeople] = useState<Person[]>([]);

    useEffect(()=>{
        setPeople(persons)
    },[])


    return <div>

        <Grid data={people.map(item=>({
            ...item,
            command: <CommandButtons />
        }))}>
            <GridToolbar>
                <div>
                    <button
                        title="Add new"
                        className="k-button k-button-md k-rounded-md k-button-solid"
                        // onClick={()=>{}}
                    >
                        Add new
                    </button>
                </div>
            </GridToolbar>
            <GridColumn title="ID" field="id" />
            <GridColumn title="Name" field="name" />
            <GridColumn title="Gender" field="gender" />
            <GridColumn title="Address" field="address" />
            <GridColumn title="Mobile No" field="mobileNo" />
            <GridColumn title="Date of Birth" field="birthday" />
            <GridColumn title="Age" field="age" />
            {/* eslint-disable-next-line react/prop-types */}
            <GridColumn title="command" field="command" cell={(props: GridCellProps) => props.dataItem.command} />
        </Grid>
    </div>
}

export default  DataGrid;