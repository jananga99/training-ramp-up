import { FC } from "react";
import { Student } from "../../../utils/student";

type AgeCellProps = {
  student: Student;
};

export const AgeCell: FC<AgeCellProps> = ({ student }: AgeCellProps) => {
  if (student.isAdding && !student.age) {
    return <td></td>;
  } else {
    return <td>{student.age}</td>;
  }
};
