import { View } from 'react-native';
import { Image } from 'react-native';
import { convertImagePath } from '@/lib/upload/convert-image-path';

export function CompactPostImageList({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;

  return (
    <View className="flex-row gap-2">
      {urls.map((url) => (
        <Image
          key={url}
          source={{ uri: convertImagePath(url) }}
          className="size-24 rounded-md"
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ))}
    </View>
  );
}