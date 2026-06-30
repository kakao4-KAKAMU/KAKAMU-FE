import { View } from 'react-native';
import type { MovieItem } from '@kakamu/types';

import { CompactPostMovieCard } from '@/components/featured/post/CompactPostMovieCard';

type ProfileSavedMoviesPanelProps = {
  movieIds: MovieItem['id'][];
};

export function ProfileSavedMoviesPanel({ movieIds }: ProfileSavedMoviesPanelProps) {
  if (movieIds.length === 0) {
    return null;
  }

  return (
    <View className="gap-2">
      {movieIds.map((movieId) => (
        <CompactPostMovieCard key={movieId} movieId={movieId} />
      ))}
    </View>
  );
}
