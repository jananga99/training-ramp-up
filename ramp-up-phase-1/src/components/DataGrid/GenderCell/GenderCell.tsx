import { FC } from "react";
import { StudentGrid } from "../DataGrid";
import { DropDownList, DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import { Gender } from "../../../utils/student";

type GenderCellProps = {
  dropDownChange: (event: DropDownListChangeEvent, id: number) => void;
  student: StudentGrid;
};

export const GenderCell: FC<GenderCellProps> = ({ dropDownChange, student }: GenderCellProps) => {
  if (student.isAdding || student.isEditing) {
    return (
      <td>
        <DropDownList
          data={[Gender.MALE, Gender.FEMALE, Gender.OTHER]}
          onChange={(event) => {
            dropDownChange(event, student.id as number);
          }}
          value={student.gender}
        />
      </td>
    );
  } else {
    return <td>{student.gender}</td>;
  }
};
