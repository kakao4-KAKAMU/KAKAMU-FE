import type { MovieWithTrailers } from '@kakamu/types';

import type { TrailerQueueItem } from '@/components/featured/sonar/types';

function formatReleaseLabel(releaseDate?: string | null): string {
  if (!releaseDate) {
    return '—';
  }
  const year = releaseDate.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : releaseDate;
}

export function mapMovieToTrailerItem(movie: MovieWithTrailers): TrailerQueueItem | null {
  const videos = movie.youtube_videos ?? [];
  if (videos.length === 0) {
    return null;
  }

  const picked = videos[Math.floor(Math.random() * videos.length)];

  return {
    id: movie.id,
    title: movie.title,
    durationLabel: formatReleaseLabel(movie.release_date),
    youtubeVideoId: picked.youtube_video_id,
  };
}

export function mapMoviesToTrailerItems(movies: MovieWithTrailers[]): TrailerQueueItem[] {
  return movies
    .map(mapMovieToTrailerItem)
    .filter((item): item is TrailerQueueItem => item != null);
}
