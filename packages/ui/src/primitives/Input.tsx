import { TextInput, type TextInputProps } from "react-native-css/components";
import { cn } from "../lib/cn";

type InputProps = TextInputProps & {
  className?: string;
};

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <TextInput
      className={cn(
        "min-h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-foreground",
        "placeholder:text-muted-foreground focus:border-ring",
        className,
      )}
      placeholderTextColor="#7a7a7a"
      {...props}
    />
  );
};
