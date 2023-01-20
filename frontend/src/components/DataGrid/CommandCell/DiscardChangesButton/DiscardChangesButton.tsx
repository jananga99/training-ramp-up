import { FC } from "react";
import { Button } from "@progress/kendo-react-buttons";

type DiscardChangesButtonProps = {
  handleDiscardChanges: (id: number) => void;
  id: number;
};

export const DiscardChangesButton: FC<DiscardChangesButtonProps> = ({
  handleDiscardChanges,
  id,
}: DiscardChangesButtonProps) => {
  return (
    <Button
      onClick={() => {
        handleDiscardChanges(id);
      }}
    >
      Discard Changes
    </Button>
  );
};
