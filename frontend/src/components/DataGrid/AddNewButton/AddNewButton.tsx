import { FC } from "react";

type AddNewButtonProps = {
  handleAddNewClick: () => void;
};

export const AddNewButton: FC<AddNewButtonProps> = ({ handleAddNewClick }: AddNewButtonProps) => {
  return (
    <div>
      <button
        title="Add new"
        className="k-button k-button-md k-rounded-md k-button-solid"
        onClick={handleAddNewClick}
      >
        Add new
      </button>
    </div>
  );
};
