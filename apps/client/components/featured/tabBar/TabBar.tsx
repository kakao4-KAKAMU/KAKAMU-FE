import { View } from "react-native";
import { TextClassProvider } from "@kakamu/ui";
import { StyledLinearGradient } from "../intro/StyledLinearGradient";
import { useColors } from "@/components/themeColor";
import { formatRgb, parse } from "culori";

type TabBarProps = {
  children: React.ReactNode;
};

export function TabBar({ children }: TabBarProps) {
  const colors = useColors()
  const backgroundColor = colors['--background']

  const backgroundColorAlpha = parse(backgroundColor)

  let backgroundColorAlphaString = 'rgb(0,0,0,0)'
  if (backgroundColorAlpha) {
    backgroundColorAlpha.alpha = 0
    backgroundColorAlphaString = formatRgb(backgroundColorAlpha)
  }

  return (
    <TextClassProvider value="text-card-foreground">
      <View
        className="fixed left-0 right-0 bottom-0"
        accessibilityRole="tablist"
      >
        <StyledLinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          locations={[0, 1]}
          colors={[backgroundColor, backgroundColorAlphaString]}
          className="absolute -top-4 left-0 right-0 h-4"
        />
        <View className="bg-background absolute top-0 left-0 right-0 bottom-0" />
        <View className="bg-card border border-border h-15.5 mx-5.5 mb-5.5 flex-row items-stretch gap-0.5 rounded-full p-1">
        {children}
        </View>
      </View>
    </TextClassProvider>
  );
}
