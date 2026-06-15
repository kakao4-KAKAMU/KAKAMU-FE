import { Platform, Pressable, View } from 'react-native';
import { Icon, Text } from '@kakamu/ui';
import { Image } from 'react-native';
import { Check } from 'lucide-react-native';
import { ConditionalRender } from '../../../utils';
import { convertImagePath } from '@/lib/upload/convert-image-path';


type SelectedMovieRowProps = {
  title: string;
  release_date?: string;
  poster_url?: string;
  checked: boolean;
  onToggle: () => void;
};

export function SelectedMovieRow({
  title,
  release_date,
  poster_url,
  checked,
  onToggle,
}: SelectedMovieRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      className="flex-row items-center gap-3 py-1 active:opacity-70"
    >
      <View className="items-center justify-center rounded border border-border bg-muted">
        {poster_url ? (
          <Image
            source={{ uri: convertImagePath(poster_url) }}
            className="h-[60px] w-[45px] rounded-md"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className="h-[60px] w-[45px] items-center justify-center rounded-md bg-muted">
            <Text className="text-xs text-muted-foreground"></Text>
          </View>
        )}
      </View>
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
