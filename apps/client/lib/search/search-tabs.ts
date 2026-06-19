export type SearchTab = 'movie' | 'feed' | 'person' | 'recommend';

export type SearchTabRoute = SearchTab | 'index';

export const SEARCH_TAB_ROUTES: Record<SearchTab, `/search/${SearchTab}`> = {
  movie: '/search/movie',
  feed: '/search/feed',
  person: '/search/person',
  recommend: '/search/recommend',
};

export const DEFAULT_SEARCH_TAB: SearchTab = 'movie';

export function isSearchTab(value: string): value is SearchTab {
  return value === 'movie' || value === 'feed' || value === 'person' || value === 'recommend';
}

export function getSearchTabFromPathname(pathname: string): SearchTabRoute {
  const segment = pathname.split('/').filter(Boolean).at(-1) ?? 'index';
  if (segment === 'search') {
    return 'index';
  }
  return isSearchTab(segment) ? segment : 'index';
}
