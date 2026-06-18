import { createContext, useCallback, useContext, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../composed/alert-dialog';
import { buttonVariants } from '../composed/button';
import { Text } from '../composed/text';
import { cn } from '../lib/cn';

export type ActionAlertDialogProps = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
};

type ActionAlertDialogItem = ActionAlertDialogProps & {
  id: string;
};

type ActionAlertDialogViewProps = ActionAlertDialogProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActionAlertDialog({
  title,
  description,
  cancelLabel,
  confirmLabel,
  onConfirm,
  destructive = false,
  open,
  onOpenChange,
}: ActionAlertDialogViewProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={() => onOpenChange(false)}>
            <Text>{cancelLabel}</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(destructive ? buttonVariants({ variant: 'destructive' }) : undefined)}
            onPress={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            <Text>{confirmLabel}</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const ActionAlertDialogContext = createContext<{
  open: (props: ActionAlertDialogProps) => void;
}>({
  open: () => {},
});

export const useActionAlertDialog = () => {
  const context = useContext(ActionAlertDialogContext);
  if (!context) {
    throw new Error('useActionAlertDialog must be used within an ActionAlertDialogProvider');
  }
  return context;
};

export const ActionAlertDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [item, setItem] = useState<ActionAlertDialogItem | null>(null);

  const open = useCallback((props: ActionAlertDialogProps) => {
    setItem({ ...props, id: new Date().toISOString() });
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setItem(null);
    }
  }, []);

  return (
    <ActionAlertDialogContext.Provider value={{ open }}>
      {children}
      {item ? (
        <ActionAlertDialog
          key={item.id}
          title={item.title}
          description={item.description}
          cancelLabel={item.cancelLabel}
          confirmLabel={item.confirmLabel}
          destructive={item.destructive}
          onConfirm={item.onConfirm}
          open
          onOpenChange={handleOpenChange}
        />
      ) : null}
    </ActionAlertDialogContext.Provider>
  );
};
