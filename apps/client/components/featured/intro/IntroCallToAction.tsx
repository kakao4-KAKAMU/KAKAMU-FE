import { View } from 'react-native';
import { Button, Text } from '@kakamu/ui';

type IntroCallToActionProps = {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function IntroCallToAction({
  label = 'Kakamu 시작하기',
  onPress,
  disabled,
}: IntroCallToActionProps) {
  return (
    <View className="flex-col gap-2 pt-1">
      <Button
        variant="default"
        size="lg"
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="w-full rounded-full"
      >
        <Text>{label}</Text>
      </Button>
    </View>
  );
}
