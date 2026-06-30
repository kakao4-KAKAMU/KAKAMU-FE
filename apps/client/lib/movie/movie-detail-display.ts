import type { MovieOverview } from '@kakamu/types';

export function getPreferredMovieOverview(overviews: MovieOverview[] | undefined): string | null {
  if (!overviews?.length) {
    return null;
  }

  const koreanOverview = overviews.find(
    (item) => item.lang?.toLowerCase() === 'ko' || item.lang?.toLowerCase() === 'kr',
  )?.overview.trim();
  if (koreanOverview) {
    return koreanOverview;
  }

  const firstOverview = overviews.find((item) => item.overview.trim())?.overview.trim();
  return firstOverview ?? null;
}

export function formatMovieMetaLine({
  releaseDate,
  nation,
  producingYear,
  runtimeLabel,
}: {
  releaseDate?: string | null;
  nation?: string | null;
  producingYear?: number | null;
  runtimeLabel?: string | null;
}): string | null {
  const parts = [
    releaseDate?.trim() || (producingYear ? String(producingYear) : null),
    nation?.trim() || null,
    runtimeLabel || null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : null;
}
