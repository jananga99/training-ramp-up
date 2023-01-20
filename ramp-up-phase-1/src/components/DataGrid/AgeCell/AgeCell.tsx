import { StudentGrid } from "../DataGrid";
import { FC } from "react";

type AgeCellProps = {
  student: StudentGrid;
};

export const AgeCell: FC<AgeCellProps> = ({ student }: AgeCellProps) => {
  if (student.isAdding && !student.age) {
    return <td></td>;
  } else {
    return <td>{student.age}</td>;
  }
};
