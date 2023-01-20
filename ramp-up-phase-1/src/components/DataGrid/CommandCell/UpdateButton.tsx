import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type UpdateButtonProps = {
  editRecord: (id: number) => void;
  id: number;
};

export const UpdateButton: FC<UpdateButtonProps> = ({ editRecord, id }: UpdateButtonProps) => {
  return (
    <Button
      onClick={() => {
        editRecord(id);
      }}
    >
      Update
    </Button>
  );
};
