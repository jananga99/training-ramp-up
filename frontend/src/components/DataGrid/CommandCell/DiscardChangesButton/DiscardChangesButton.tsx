import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type DiscardChangesButtonProps = {
  handleDiscardChanges: (id: number) => void;
  id: number;
  isAdmin: boolean;
};

export const DiscardChangesButton: FC<DiscardChangesButtonProps> = ({
  handleDiscardChanges,
  id,
  isAdmin,
}: DiscardChangesButtonProps) => {
  return (
    <Button
      disabled={!isAdmin}
      onClick={() => {
        handleDiscardChanges(id);
      }}
    >
      Discard Changes
    </Button>
  );
};
