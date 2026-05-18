import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { cn, Text } from '@kakamu/ui';

type AccountSnsProviderRowProps = {
  name: string;
  description: string;
  icon: ReactNode;
  trailing: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function AccountSnsProviderRow({
  name,
  description,
  icon,
  trailing,
  onPress,
  accessibilityLabel,
}: AccountSnsProviderRowProps) {
  const rowClassName = cn(
    'flex-row items-center justify-between rounded-xl border border-border bg-card p-4',
    onPress && 'active:opacity-70'
  );

  const content = (
    <>
      <View className="min-w-0 flex-1 flex-row items-center gap-2.5 pr-3">
        {icon}
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-foreground">{name}</Text>
          <Text className="text-xs text-muted-foreground">{description}</Text>
        </View>
      </View>
      {trailing}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? name}
        onPress={onPress}
        className={rowClassName}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel ?? name} className={rowClassName}>
      {content}
    </View>
  );
}
