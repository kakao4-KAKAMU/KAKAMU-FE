import { Platform, Pressable, View } from 'react-native';
import { Icon, Text } from '@kakamu/ui';
import { Image } from 'react-native';
import { ConditionalRender } from '@/components/utils';
import { Check } from 'lucide-react-native';
import { convertImagePath } from '@/lib/upload/convert-image-path';

type SelectedPersonRowProps = {
  name: string;
  job?: string;
  profile_image?: string;
  checked: boolean;
  onToggle: () => void;
};

export function SelectedPersonRow({
  name,
  job,
  profile_image,
  checked,
  onToggle,
}: SelectedPersonRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      className="flex-row items-center gap-3 py-1 active:opacity-70"
    >
      <View className="items-center justify-center rounded border border-border bg-muted">
        {profile_image ? (
            <Image
            source={{ uri: convertImagePath(profile_image) }}
            className="h-[60px] w-[45px] rounded-md"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            />
        ) : (
          <View className="h-[60px] w-[45px] items-center justify-center rounded-md bg-muted">
          </View>
        )}
      </View>
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
              className="text-foreground"
            />,
        }}
      />
    </Pressable>
  );
}
