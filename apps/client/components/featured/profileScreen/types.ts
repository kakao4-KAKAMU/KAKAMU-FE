export type ProfileTab = 'feed' | 'like' | 'saved';

export type ProfileStatKey = 'feed' | 'save' | 'following';

export type ProfileSavedCategoryId = 'posts' | 'comments' | 'movies';

export const PROFILE_SAVED_CATEGORY_IDS = [
  'posts',
  'comments',
  'movies',
] as const satisfies readonly ProfileSavedCategoryId[];

export type ProfileSavedCategory = {
  id: ProfileSavedCategoryId;
  title: string;
  itemCount: number;
};

export type ProfileLikeSegment = 'all' | 'movie' | 'feed';
