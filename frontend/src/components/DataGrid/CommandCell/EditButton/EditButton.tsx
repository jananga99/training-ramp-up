import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";
import "./EditButton.scss";

type EditButtonProps = {
  handleEditClick: (id: number) => void;
  id: number;
  isAdmin: boolean;
};

export const EditButton: FC<EditButtonProps> = ({
  handleEditClick,
  id,
  isAdmin,
}: EditButtonProps) => {
  return (
    <Button
      disabled={!isAdmin}
      className="command-edit-button"
      onClick={() => {
        handleEditClick(id);
      }}
    >
      Edit
    </Button>
  );
};
