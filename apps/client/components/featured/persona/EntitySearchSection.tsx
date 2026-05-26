import { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { X } from 'lucide-react-native';
import {
  Badge,
  Button,
  cn,
  Icon,
  Input,
  Label,
  Text,
  TextClassContext,
} from '@kakamu/ui';

export type SelectedEntity = { id: string; name: string };

type SortOption = { value: string; label: string };

type EntitySearchSectionProps<T extends SelectedEntity> = {
  title: string;
  searchPlaceholder: string;
  sortOptions: SortOption[];
  sort: string;
  onSortChange: (value: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  filterSlot?: React.ReactNode;
  items: T[];
  selected: SelectedEntity[];
  onToggle: (item: T) => void;
  getSubtitle?: (item: T) => string | undefined;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  emptyLabel: string;
  loadMoreLabel: string;
  errorMessage?: string;
};

export function EntitySearchSection<T extends SelectedEntity>({
  title,
  searchPlaceholder,
  sortOptions,
  sort,
  onSortChange,
  keyword,
  onKeywordChange,
  filterSlot,
  items,
  selected,
  onToggle,
  getSubtitle,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  emptyLabel,
  loadMoreLabel,
  errorMessage,
}: EntitySearchSectionProps<T>) {
  const isSelected = useCallback(
    (id: string) => selected.some((item) => item.id === id),
    [selected],
  );

  return (
    <View className="gap-3">
      <Label className="text-sm font-semibold text-foreground">{title}</Label>

      {selected.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {selected.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item as T)}
              accessibilityRole="button"
            >
              <Badge variant="secondary" className="flex-row items-center gap-1 pr-1">
                <Text className="text-xs text-secondary-foreground">{item.name}</Text>
                <TextClassContext.Provider value="text-secondary-foreground">
                  <Icon as={X} size={12} />
                </TextClassContext.Provider>
              </Badge>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View className="gap-2">
        <Input
          value={keyword}
          onChangeText={onKeywordChange}
          placeholder={searchPlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
          className="h-11 rounded-xl"
        />
        {filterSlot}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-2"
        >
          {sortOptions.map((option) => {
            const active = sort === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onSortChange(option.value)}
                accessibilityRole="button"
              >
                <Badge variant={active ? 'default' : 'outline'} className={cn('px-3 py-1')}>
                  <Text
                    className={cn(
                      'text-xs',
                      active ? 'text-primary-foreground' : 'text-foreground',
                    )}
                  >
                    {option.label}
                  </Text>
                </Badge>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {errorMessage ? (
        <Text className="text-sm text-destructive">{errorMessage}</Text>
      ) : null}

      <View className="gap-1 rounded-xl border border-border bg-card p-2">
        {isLoading ? (
          <Text className="py-4 text-center text-sm text-muted-foreground">…</Text>
        ) : items.length === 0 ? (
          <Text className="py-4 text-center text-sm text-muted-foreground">{emptyLabel}</Text>
        ) : (
          items.map((item) => {
            const active = isSelected(item.id);
            const subtitle = getSubtitle?.(item);
            return (
              <Pressable
                key={item.id}
                onPress={() => onToggle(item)}
                accessibilityRole="button"
                className={`rounded-lg px-3 py-2.5 active:opacity-70 ${active ? 'bg-primary/10' : ''}`}
              >
                <Text className={`text-sm font-medium ${active ? 'text-primary' : 'text-foreground'}`}>
                  {item.name}
                </Text>
                {subtitle ? (
                  <Text className="text-xs text-muted-foreground">{subtitle}</Text>
                ) : null}
              </Pressable>
            );
          })
        )}
        {hasNextPage && onLoadMore ? (
          <Button
            variant="ghost"
            onPress={onLoadMore}
            disabled={isFetchingNextPage}
            className="mt-1"
          >
            <Text>{isFetchingNextPage ? '…' : loadMoreLabel}</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}
