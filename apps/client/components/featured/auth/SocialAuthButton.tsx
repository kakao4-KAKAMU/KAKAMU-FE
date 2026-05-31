import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Button, Icon, Text, TextClassProvider, cn } from '@kakamu/ui';

type SocialAuthButtonProps = {
  label: string;
  icon?: LucideIcon;
  iconClassName?: string;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
};

export function SocialAuthButton({
  label,
  icon,
  iconClassName,
  onPress,
  disabled,
  className,
}: SocialAuthButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cn('h-12 rounded-xl', className)}
    >
      {icon ? (
        <View className="absolute left-4 top-0 bottom-0 items-center justify-center">
          <TextClassProvider value={iconClassName ?? 'text-foreground'}>
            <Icon as={icon} size={18} />
          </TextClassProvider>
        </View>
      ) : null}
      <Text className="text-sm font-semibold">{label}</Text>
    </Button>
  );
}
