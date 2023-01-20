import { FC } from "react";
import { Student } from "../../../utils/student";
import { DatePicker, DatePickerChangeEvent } from "@progress/kendo-react-dateinputs";

type BirthdayCellProps = {
  student: Student;
  dateChange: (event: DatePickerChangeEvent, id: number) => void;
};

export const BirthdayCell: FC<BirthdayCellProps> = ({ student, dateChange }: BirthdayCellProps) => {
  if (student.inEdit) {
    return (
      <td>
        <DatePicker
          value={student.birthday}
          max={new Date()}
          onChange={(event) => {
            dateChange(event, student.keyId as number);
          }}
        />
      </td>
    );
  } else {
    return <td>{student.birthday.toDateString()}</td>;
  }
};
