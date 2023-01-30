import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type UpdateButtonProps = {
  editRecord: (id: number) => void;
  id: number;
  isAdmin: boolean;
};

export const UpdateButton: FC<UpdateButtonProps> = ({
  editRecord,
  id,
  isAdmin,
}: UpdateButtonProps) => {
  return (
    <Button
      disabled={!isAdmin}
      onClick={() => {
        editRecord(id);
      }}
    >
      Update
    </Button>
  );
};
