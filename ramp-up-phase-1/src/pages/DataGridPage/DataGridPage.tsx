import {FC, useEffect, useState} from "react";
import DataGrid from "../../components/DataGrid/DataGrid";

const DataGridPage: FC =  ()=>{
    useEffect(() => {
        document.title = 'Data Grid';
    }, []);
    return <div>
        <DataGrid />
    </div>
}

export default  DataGridPage;