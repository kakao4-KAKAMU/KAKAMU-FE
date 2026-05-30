import { View } from 'react-native';
import { Clapperboard } from 'lucide-react-native';
import { Icon, TextClassProvider, cn } from '@kakamu/ui';

type AuthBrandLogoProps = {
  size?: 'md' | 'lg';
  className?: string;
};

const SIZE_MAP = {
  md: { container: 'h-12 w-12 rounded-2xl', icon: 22 },
  lg: { container: 'h-14 w-14 rounded-2xl', icon: 26 },
} as const;

export function AuthBrandLogo({ size = 'lg', className }: AuthBrandLogoProps) {
  const sizeStyle = SIZE_MAP[size];
  return (
    <View
      className={cn(
        'items-center justify-center bg-foreground',
        sizeStyle.container,
        className
      )}
      accessibilityRole="image"
      accessibilityLabel="Kakamu"
    >
      <TextClassProvider value="text-background">
        <Icon as={Clapperboard} size={sizeStyle.icon} />
      </TextClassProvider>
    </View>
  );
}
