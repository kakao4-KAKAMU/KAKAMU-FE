import { Pressable, View } from 'react-native';
import { Checkbox, Text } from '@kakamu/ui';

type PersonaSelectedMovieRowProps = {
  name: string;
  year?: number;
  checked: boolean;
  onToggle: () => void;
};

export function PersonaSelectedMovieRow({
  name,
  year,
  checked,
  onToggle,
}: PersonaSelectedMovieRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      className="flex-row items-center gap-3 py-1 active:opacity-70"
    >
      <View className="min-w-0 flex-1">
        <Text className="text-sm font-semibold text-foreground">{name}</Text>
        {year != null ? <Text className="text-xs text-muted-foreground">{year}</Text> : null}
      </View>
      <Checkbox checked={checked} onCheckedChange={onToggle} />
    </Pressable>
  );
}
