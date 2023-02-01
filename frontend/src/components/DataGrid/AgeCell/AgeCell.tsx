import { FC } from "react";
import { GridStudent } from "../../../utils/student";

type AgeCellProps = {
  student: GridStudent;
};

export const AgeCell: FC<AgeCellProps> = ({ student }: AgeCellProps) => {
  if (student.isAdding && !student.age) {
    return <td></td>;
  } else {
    return <td>{student.age}</td>;
  }
};
