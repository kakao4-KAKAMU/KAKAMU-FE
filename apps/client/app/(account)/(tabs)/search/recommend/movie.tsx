import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { useMovieRecommendQuery } from '@kakamu/query';
import { useAuthStore } from '@kakamu/store';
import { Text } from '@kakamu/ui';

import { CompactPostMovieCard } from '@/components/featured/post/CompactPostMovieCard';
import { SearchResultsFrame } from '@/components/featured/search/SearchResultsFrame';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { useSearchNavigation } from '@/hooks/search/useSearchNavigation';

export default function SearchRecommendMovieScreen() {
  const { t } = useTranslation();
  const client = useBackendApiClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUserId = useCurrentUserId();
  const { query } = useSearchNavigation();
  const recommendQuery = useMovieRecommendQuery(
    client,
    { query },
    { enabled: currentUserId != null && query.trim().length > 0 },
  );

  const movieIds = useMemo(
    () => recommendQuery.data?.movies.map((movie) => movie.id) ?? [],
    [recommendQuery.data?.movies],
  );

  if (!accessToken) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="px-4 text-center text-sm text-muted-foreground">
          {t('account.search.recommend.loginRequired')}
        </Text>
      </View>
    );
  }

  if (!query.trim()) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-sm text-muted-foreground">{t('account.search.emptyQuery')}</Text>
      </View>
    );
  }

  return (
    <SearchResultsFrame
      items={movieIds}
      isLoading={recommendQuery.isLoading}
      isFetchingNextPage={false}
      hasNextPage={false}
      onLoadMore={() => {}}
      keyExtractor={(movieId) => movieId}
      renderItem={(movieId) => <CompactPostMovieCard movieId={movieId} />}
    />
  );
}
