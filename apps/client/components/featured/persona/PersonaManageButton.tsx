import { Pressable } from 'react-native';
import { Text } from '@kakamu/ui';

type PersonaManageButtonProps = {
  label: string;
  onPress: () => void;
};

export function PersonaManageButton({ label, onPress }: PersonaManageButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="w-full items-center justify-center rounded-md border border-border bg-background px-4 py-2 active:opacity-70"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1.75,
        elevation: 1,
      }}
    >
      <Text className="text-center text-sm font-medium text-foreground">{label}</Text>
    </Pressable>
  );
}
