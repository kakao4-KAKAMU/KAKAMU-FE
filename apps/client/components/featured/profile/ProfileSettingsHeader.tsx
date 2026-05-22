import { Pressable, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Icon, Text, TextClassContext } from '@kakamu/ui';

type ProfileSettingsHeaderProps = {
  title: string;
  actionIcon: LucideIcon;
  actionAccessibilityLabel: string;
  onActionPress?: () => void;
};

export function ProfileSettingsHeader({
  title,
  actionIcon,
  actionAccessibilityLabel,
  onActionPress,
}: ProfileSettingsHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-1">
      <Text className="text-[22px] font-bold leading-tight text-foreground">{title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionAccessibilityLabel}
        onPress={onActionPress}
        hitSlop={8}
        className="h-8 w-8 items-center justify-center rounded-full bg-secondary active:opacity-70"
      >
        <TextClassContext.Provider value="text-secondary-foreground">
          <Icon as={actionIcon} size={18} />
        </TextClassContext.Provider>
      </Pressable>
    </View>
  );
}
