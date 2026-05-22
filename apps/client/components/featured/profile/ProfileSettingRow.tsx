import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { cn, Text } from '@kakamu/ui';

type ProfileSettingRowProps = {
  label: string;
  trailing: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
};

export function ProfileSettingRow({
  label,
  trailing,
  onPress,
  accessibilityLabel,
  className,
}: ProfileSettingRowProps) {
  const rowClassName = cn(
    'flex-row items-center justify-between rounded-xl border border-border bg-card p-4',
    className
  );

  const labelNode = (
    <View className="flex-1 pr-3">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        onPress={onPress}
        className={cn(rowClassName, 'active:opacity-70')}
      >
        {labelNode}
        {trailing}
      </Pressable>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel ?? label} className={rowClassName}>
      {labelNode}
      {trailing}
    </View>
  );
}
