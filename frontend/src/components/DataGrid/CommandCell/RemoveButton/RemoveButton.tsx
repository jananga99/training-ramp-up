import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type RemoveButtonProps = {
  removeRecord: (id: number) => void;
  id: number;
  isAdmin: boolean;
};

export const RemoveButton: FC<RemoveButtonProps> = ({
  removeRecord,
  id,
  isAdmin,
}: RemoveButtonProps) => {
  return (
    <Button
      disabled={!isAdmin}
      onClick={() => {
        confirm(`Confirm deleting student with id ${id} `);
        removeRecord(id);
      }}
    >
      Remove
    </Button>
  );
};
