import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type AddButtonProps = {
  addRecord: (id: number) => void;
  id: number;
  isAdmin: boolean;
};

export const AddButton: FC<AddButtonProps> = ({ addRecord, id }: AddButtonProps, isAdmin) => {
  return (
    <Button
      disabled={!isAdmin}
      onClick={() => {
        addRecord(id);
      }}
    >
      Add
    </Button>
  );
};
