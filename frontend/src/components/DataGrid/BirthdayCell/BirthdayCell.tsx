import { FC } from "react";
import { GridStudent } from "../../../utils/student";
import { DatePicker, DatePickerChangeEvent } from "@progress/kendo-react-dateinputs";
import { getBeforeDate } from "../../../utils/helpers";

type BirthdayCellProps = {
  student: GridStudent;
  dateChange: (event: DatePickerChangeEvent, id: number) => void;
};

export const BirthdayCell: FC<BirthdayCellProps> = ({ student, dateChange }: BirthdayCellProps) => {
  if (student.inEdit) {
    return (
      <td>
        <DatePicker
          value={student.birthday}
          max={getBeforeDate(18)}
          onChange={(event) => {
            dateChange(event, student.keyId as number);
          }}
        />
      </td>
    );
  } else {
    return <td>{(student.birthday as Date).toDateString()}</td>;
  }
};
