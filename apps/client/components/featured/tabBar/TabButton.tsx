import { Pressable } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { cn, Icon, Text, TextClassProvider } from "@kakamu/ui";

type TabButtonProps = TabTriggerSlotProps & {
  icon: LucideIcon;
  label: string;
  className?: string;
};

export function TabButton({
  icon,
  label,
  isFocused,
  ref,
  style: _ignoredStyle,
  className,
  ...pressableProps
}: TabButtonProps) {
  return (
    <TextClassProvider
      value={isFocused ? "text-background" : "text-muted-foreground"}
    >
      <Pressable
        ref={ref}
        accessibilityRole="tab"
        accessibilityState={{ selected: !!isFocused }}
        android_ripple={{ borderless: true }}
        {...pressableProps}
        className={cn(
          "flex-1 items-center justify-center gap-1 rounded-full opacity-100 active:opacity-70",
          isFocused && "bg-foreground",
          className
        )}
      >
        <Icon as={icon} size={18} />
        <Text className="text-xs font-semibold tracking-wider uppercase leading-none">
          {label}
        </Text>
      </Pressable>
    </TextClassProvider>
  );
}
