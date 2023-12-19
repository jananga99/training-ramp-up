import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type AddNewButtonProps = {
  handleAddNewClick: () => void;
  isAdmin: boolean;
};

export const AddNewButton: FC<AddNewButtonProps> = ({
  handleAddNewClick,
  isAdmin,
}: AddNewButtonProps) => {
  return (
    <div>
      <Button
        disabled={!isAdmin}
        title="Add new"
        className="k-button k-button-md k-rounded-md k-button-solid"
        onClick={handleAddNewClick}
      >
        Add new
      </Button>
    </div>
  );
};
