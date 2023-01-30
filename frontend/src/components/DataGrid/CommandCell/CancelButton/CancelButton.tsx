import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type CancelButtonProps = {
  handleCancel: (id: number) => void;
  id: number;
  isAdmin: boolean;
};

export const CancelButton: FC<CancelButtonProps> = ({
  handleCancel,
  id,
  isAdmin,
}: CancelButtonProps) => {
  return (
    <Button
      disabled={!isAdmin}
      onClick={() => {
        handleCancel(id);
      }}
    >
      Cancel
    </Button>
  );
};
