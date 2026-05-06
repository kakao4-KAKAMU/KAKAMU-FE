import { View, Text, type TextProps, type ViewProps } from "react-native";
import { cn } from "../lib/cn";

type CProps = ViewProps & { className?: string };
type TProps = TextProps & { className?: string };

export function Card({ className, ...props }: CProps) {
  return <View className={cn("rounded-3xl border border-border bg-card p-4", className)} {...props} />;
}

export function CardHeader({ className, ...props }: CProps) {
  return <View className={cn("mb-2 gap-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: TProps) {
  return <Text className={cn("text-base font-semibold text-card-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: TProps) {
  return <Text className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: CProps) {
  return <View className={cn("gap-2", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CProps) {
  return <View className={cn("mt-3 flex-row items-center", className)} {...props} />;
}
