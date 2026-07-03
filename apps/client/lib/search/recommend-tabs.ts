export type RecommendTab = 'feed' | 'movie';

export const RECOMMEND_TAB_ROUTES: Record<RecommendTab, `/search/recommend${'' | '/movie'}`> = {
  feed: '/search/recommend',
  movie: '/search/recommend/movie',
};

export function resolveActiveRecommendTab(pathname: string): RecommendTab {
  if (pathname.endsWith('/movie')) {
    return 'movie';
  }
  return 'feed';
}
