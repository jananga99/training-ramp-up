import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type CancelButtonProps = {
  handleCancel: (id: number) => void;
  id: number;
};

export const CancelButton: FC<CancelButtonProps> = ({ handleCancel, id }: CancelButtonProps) => {
  return (
    <Button
      onClick={() => {
        handleCancel(id);
      }}
    >
      Cancel
    </Button>
  );
};
