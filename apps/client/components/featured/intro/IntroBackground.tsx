import { View } from 'react-native';
import { useThemeScheme } from '@/components/themeScheme';
import { StyledLinearGradient } from './StyledLinearGradient';

const LIGHT_GRADIENT = ['#fafafa', '#f5f3ff', '#e0f2fe'] as const;
const DARK_GRADIENT = ['#09090b', '#1e1b4b', '#0c4a6e'] as const;

const GRADIENT_LOCATIONS = [0, 0.45, 1] as const;

const GRADIENT_START = { x: 0.29, y: 0.05 } as const;
const GRADIENT_END = { x: 0.71, y: 0.95 } as const;

export function IntroBackground() {
  const { colorScheme } = useThemeScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className="absolute inset-0 overflow-hidden pointer-events-none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <StyledLinearGradient
        className="absolute inset-0"
        colors={[...(isDark ? DARK_GRADIENT : LIGHT_GRADIENT)]}
        locations={[...GRADIENT_LOCATIONS]}
        start={GRADIENT_START}
        end={GRADIENT_END}
      />

      <View className="absolute -left-28 -top-56 h-[520px] w-[520px] rounded-full bg-violet-200/50 dark:bg-violet-900/25" />
      <View className="absolute -left-6 top-44 h-[480px] w-[480px] rounded-full bg-sky-200/65 dark:bg-sky-900/20" />
    </View>
  );
}
