import { useState, cloneElement, ReactElement } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, Button, DialogFooter } from "../ui";

type DoubleConfirmationDialogProps = {
  title?: string;
  message?: string;
  children: ReactElement;
};

export const DoubleConfirmationDialog = ({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  children,
}: DoubleConfirmationDialogProps) => {
  const [isOpen, setOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (children.props.onClick) {
      setOnConfirm(() => children.props.onClick);
    }

    setOpen(true);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {cloneElement(children, { onClick: handleClick })}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-row gap-4 justify-between">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
