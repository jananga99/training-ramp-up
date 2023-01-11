import {FC} from "react";
import {Button} from "@progress/kendo-react-buttons";
import './CommandButtons.scss'

const CommandButtons: FC = ()=>{
    return <div>
        <Button className="command-edit-button">Edit</Button>
        <Button>Remove</Button>
    </div>
}


export default  CommandButtons