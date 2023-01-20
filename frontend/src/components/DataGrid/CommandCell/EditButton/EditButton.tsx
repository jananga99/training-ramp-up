import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";
import "./EditButton.scss";

type EditButtonProps = {
  handleEditClick: (id: number) => void;
  id: number;
};

export const EditButton: FC<EditButtonProps> = ({ handleEditClick, id }: EditButtonProps) => {
  return (
    <Button
      className="command-edit-button"
      onClick={() => {
        handleEditClick(id);
      }}
    >
      Edit
    </Button>
  );
};
