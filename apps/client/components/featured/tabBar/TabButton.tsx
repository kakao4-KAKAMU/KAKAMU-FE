import { Pressable } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { cn, Icon, Text, TextClassContext } from "@kakamu/ui";

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
    <TextClassContext.Provider
      value={isFocused ? "text-background" : "text-muted-foreground"}
    >
      <Pressable
        ref={ref}
        accessibilityRole="tab"
        accessibilityState={{ selected: !!isFocused }}
        android_ripple={{ borderless: true }}
        {...pressableProps}
        className={cn(
          "flex-1 items-center justify-center gap-1 rounded-full",
          isFocused && "bg-foreground",
          className
        )}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <Icon as={icon} size={18} />
        <Text className="text-[10px] font-semibold tracking-wider uppercase leading-none">
          {label}
        </Text>
      </Pressable>
    </TextClassContext.Provider>
  );
}
