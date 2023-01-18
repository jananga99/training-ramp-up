import { Student } from "../../components/DataGrid/student";

export type UserNotification = {
  type: string;
  dbId: number;
  message: string;
  data: Student | null;
};
