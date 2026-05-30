import { Platform, Pressable, View } from 'react-native';
import { Icon, Text } from '@kakamu/ui';
import { Check } from 'lucide-react-native';
import { ConditionalRender } from '../../../utils';

type SelectedMovieRowProps = {
  title: string;
  release_date?: string;
  checked: boolean;
  onToggle: () => void;
};

export function SelectedMovieRow({
  title,
  release_date,
  checked,
  onToggle,
}: SelectedMovieRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      className="flex-row items-center gap-3 py-1 active:opacity-70"
    >
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-foreground">{title}</Text>
        {release_date != null ? <Text className="text-xs text-muted-foreground">{release_date}</Text> : null}
      </View>
      <ConditionalRender.Boolean
        condition={checked}
        render={{
          true:
            <Icon
              as={Check}
              size={16}
              strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5}
              className="text-foreground"
            />,
        }}
      />
    </Pressable>
  );
}
