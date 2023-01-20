import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type AddButtonProps = {
  addRecord: (id: number) => void;
  id: number;
};

export const AddButton: FC<AddButtonProps> = ({ addRecord, id }: AddButtonProps) => {
  return (
    <Button
      onClick={() => {
        addRecord(id);
      }}
    >
      Add
    </Button>
  );
};
