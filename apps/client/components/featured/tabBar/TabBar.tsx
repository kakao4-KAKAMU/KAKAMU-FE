import { View } from "react-native";
import { TextClassContext } from "@kakamu/ui";

type TabBarProps = {
  children: React.ReactNode;
};

export function TabBar({ children }: TabBarProps) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View
        className="bg-card border border-border flex-row items-stretch gap-0.5 rounded-full h-15.5 mx-5.5 mt-3 mb-5.5 p-1"
        accessibilityRole="tablist"
      >
        {children}
      </View>
    </TextClassContext.Provider>
  );
}
