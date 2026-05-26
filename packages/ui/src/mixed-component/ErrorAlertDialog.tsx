import { AlertCircleIcon } from "lucide-react-native";
import { Alert, AlertTitle, AlertDescription } from "../composed/alert";
import { createContext, useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { Portal } from "@rn-primitives/portal";
import { NativeOnlyAnimatedView } from "../composed/native-only-animated-view";
import { FadeInDown, FadeOutUp } from "react-native-reanimated";

type ErrorAlertDialogProps = {
  title: string;
  description: string;
}

type ErrorAlertDialogItem = ErrorAlertDialogProps & {
  datetime: string;
}


export function ErrorAlertDialog({ title, description }: ErrorAlertDialogProps) {
  return (
    <Alert variant="destructive" icon={AlertCircleIcon}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

const ErrorAlertDialogContext = createContext<{
  open: (props: ErrorAlertDialogProps) => void;
}>({
  open: () => {},
});

export const useErrorAlertDialog = () => {
  const context = useContext(ErrorAlertDialogContext);
  if (!context) {
    throw new Error('useErrorAlertDialog must be used within a ErrorAlertDialogProvider');
  }
  return context;
}

export const ErrorAlertDialogProvider = ({children}: {children: React.ReactNode}) => {
  const [props, setProps] = useState<ErrorAlertDialogItem[]>([]);
  const open = useCallback((props: ErrorAlertDialogProps) => {
    const datetime = new Date().toISOString();
    setProps((prev) => [...prev, { ...props, datetime }]);
    setTimeout(() => {
      setProps((prev) => prev.slice(1));
    }, 2000);
  }, []);
  return (
    <ErrorAlertDialogContext.Provider value={{ open: open }}>
      {children}
      <Portal name="error-alert-dialog">
        <View className="absolute left-0 right-0 bottom-0 z-50 bg-transparent flex-col gap-2 pb-4 px-4">
          {props.map((props) => (
            <NativeOnlyAnimatedView key={props.datetime} entering={FadeInDown.duration(200)} exiting={FadeOutUp.duration(200)}>
              <ErrorAlertDialog {...props} />
            </NativeOnlyAnimatedView>
          ))}
        </View>
      </Portal>
    </ErrorAlertDialogContext.Provider>
  )
}