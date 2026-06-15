import type { Genre } from '@kakamu/types';
import { Pressable, ScrollView } from 'react-native';
import { Badge, cn, Text } from '@kakamu/ui';

type GenreMultiSelectProps = {
  genres: Genre[];
  selectedIds: string[];
  onToggle: (genreId: string) => void;
  isLoading?: boolean;
  maxCount?: number;
};

export function GenreMultiSelect({
  genres,
  selectedIds,
  onToggle,
  isLoading = false,
  maxCount,
}: GenreMultiSelectProps) {
  if (isLoading) {
    return (
      <Text className="text-sm text-muted-foreground">…</Text>
    );
  }

  if (genres.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex-row gap-2"
    >
      {genres.map((genre) => {
        const selected = selectedIds.includes(genre.id);
        const atMax = maxCount != null && selectedIds.length >= maxCount && !selected;
        return (
          <Pressable
            key={genre.id}
            onPress={() => onToggle(genre.id)}
            accessibilityRole="button"
            disabled={atMax}
          >
            <Badge
              variant={selected ? 'default' : 'outline'}
              className={cn('px-3 py-1', selected && 'bg-primary')}
            >
              <Text className={cn('text-xs', selected ? 'text-primary-foreground' : 'text-foreground')}>
                {genre.name}
              </Text>
            </Badge>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
