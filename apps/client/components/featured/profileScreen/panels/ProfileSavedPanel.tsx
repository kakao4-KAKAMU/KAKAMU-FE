import { useCallback } from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler'
import { type Href, useRouter } from 'expo-router';
import { Clapperboard } from 'lucide-react-native';
import { Icon, Text, cn } from '@kakamu/ui';
import type { ProfileSavedCategory, ProfileSavedMovie } from '../types';

type ProfileSavedPanelProps = {
  isMy: boolean;
  categories: ProfileSavedCategory[];
  movies: ProfileSavedMovie[];
  activeCategoryId?: string;
};

export function ProfileSavedPanel({
  isMy,
  categories,
  movies,
  activeCategoryId = categories[0]?.id,
}: ProfileSavedPanelProps) {
  const router = useRouter();

  const onCategoryPress = useCallback(
    (categoryId: string) => {
      if (isMy) {
        router.push(`/profile/my/saved/${categoryId}` as Href);
      }
    },
    [isMy, router],
  );

  return (
    <View className="gap-2.5">
      <View className="flex-row gap-2">
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <Pressable
              key={category.id}
              onPress={() => onCategoryPress(category.id)}
              accessibilityRole="button"
              className={cn(
                'flex-1 gap-1 rounded-[14px] p-3',
                isActive ? 'bg-primary' : 'bg-secondary',
              )}
            >
              <Text
                className={cn(
                  'text-[13px] font-extrabold',
                  isActive ? 'text-primary-foreground' : 'text-secondary-foreground',
                )}
              >
                {category.title}
              </Text>
              <Text
                className={cn(
                  'text-[11px]',
                  isActive ? 'text-primary-foreground opacity-80' : 'text-muted-foreground',
                )}
              >
                {category.itemCount} items
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="gap-2">
        {movies.map((movie) => (
          <View
            key={movie.id}
            className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            <View className="h-10 w-10 items-center justify-center rounded bg-muted">
              <Icon as={Clapperboard} size={18} className="text-muted-foreground" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">{movie.title}</Text>
              <Text className="text-xs text-muted-foreground">{movie.meta}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
