import type { ProfileSavedCategory, ProfileSavedMovie } from './types';


export const MY_SAVED_CATEGORIES: ProfileSavedCategory[] = [
  { id: 'watchlist', title: '보고 싶은 영화', itemCount: 32 },
  { id: 'favorites', title: '인생 영화', itemCount: 14 },
  { id: 'reviews', title: '리뷰 참고', itemCount: 21 },
];

export const MY_SAVED_MOVIES: ProfileSavedMovie[] = [
  { id: 'm1', title: 'Past Lives', meta: '보고 싶은 영화 · 106 min' },
  { id: 'm2', title: 'Dune: Part Two', meta: '리뷰 참고 · 166 min' },
];
