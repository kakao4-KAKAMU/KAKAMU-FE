export type ProfileTab = 'feed' | 'like' | 'saved';

export type ProfileStatKey = 'feed' | 'save' | 'following';

export type ProfileSavedCategory = {
  id: string;
  title: string;
  itemCount: number;
};

export type ProfileSavedMovie = {
  id: string;
  title: string;
  meta: string;
};

export type ProfileLikeSegment = 'all' | 'movie' | 'feed';
