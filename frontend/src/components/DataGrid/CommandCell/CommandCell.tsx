import { FC } from "react";
import { AddButton } from "./AddButton/AddButton";
import { DiscardChangesButton } from "./DiscardChangesButton/DiscardChangesButton";
import { UpdateButton } from "./UpdateButton/UpdateButton";
import { CancelButton } from "./CancelButton/CancelButton";
import { EditButton } from "./EditButton/EditButton";
import { RemoveButton } from "./RemoveButton/RemoveButton";
import { Student } from "../../../utils/student";

type CommandCellProps = {
  student: Student;
  addRecord: (id: number) => void;
  removeRecord: (id: number) => void;
  editRecord: (id: number) => void;
  handleDiscardChanges: (id: number) => void;
  handleCancel: (id: number) => void;
  handleEditClick: (id: number) => void;
};

export const CommandCell: FC<CommandCellProps> = ({
  student,
  addRecord,
  handleDiscardChanges,
  editRecord,
  handleCancel,
  handleEditClick,
  removeRecord,
}: CommandCellProps) => {
  if (student.isAdding) {
    return (
      <td>
        <AddButton addRecord={addRecord} id={student.keyId as number} />
        <DiscardChangesButton
          handleDiscardChanges={handleDiscardChanges}
          id={student.keyId as number}
        />
      </td>
    );
  } else if (student.isEditing) {
    return (
      <td>
        <UpdateButton editRecord={editRecord} id={student.id as number} />
        <CancelButton handleCancel={handleCancel} id={student.id as number} />
      </td>
    );
  } else {
    return (
      <td>
        <EditButton handleEditClick={handleEditClick} id={student.id as number} />
        <RemoveButton removeRecord={removeRecord} id={student.id as number} />
      </td>
    );
  }
};
