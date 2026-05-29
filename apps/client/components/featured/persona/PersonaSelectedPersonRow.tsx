import { Platform, Pressable, View } from 'react-native';
import { Icon, Text } from '@kakamu/ui';
import { ConditionalRender } from '@/components/utils';
import { Check } from 'lucide-react-native';

type PersonaSelectedPersonRowProps = {
  name: string;
  job?: string;
  checked: boolean;
  onToggle: () => void;
};

export function PersonaSelectedPersonRow({
  name,
  job,
  checked,
  onToggle,
}: PersonaSelectedPersonRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      className="flex-row items-center gap-3 py-1 active:opacity-70"
    >
      <View className="min-w-0 flex-1 gap-0.5">
        {job ? <Text className="text-xs text-muted-foreground">{job}</Text> : null}
        <Text className="text-sm font-semibold text-foreground">{name}</Text>
      </View>

      <ConditionalRender.Boolean
        condition={checked}
        render={{
          true:
            <Icon
              as={Check}
              size={16}
              strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5}
              className="text-primary-foreground"
            />,
        }}
      />
    </Pressable>
  );
}
