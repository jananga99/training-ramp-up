import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type RemoveButtonProps = {
  removeRecord: (id: number) => void;
  id: number;
};

export const RemoveButton: FC<RemoveButtonProps> = ({ removeRecord, id }: RemoveButtonProps) => {
  return (
    <Button
      onClick={() => {
        confirm(`Confirm deleting student with id ${id} `);
        removeRecord(id);
      }}
    >
      Remove
    </Button>
  );
};
