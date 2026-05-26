export type ProfileTab = 'feed' | 'like' | 'saved';

export type ProfileStatKey = 'feed' | 'save' | 'persona';

export type ProfileScreenUser = {
  id: string;
  displayName: string;
  bio: string;
  stats: Record<ProfileStatKey, number>;
};

export type ProfileCompactPost = {
  id: string;
  authorName: string;
  authorHandle: string;
  timeLabel: string;
  body: string;
  movieTitle: string;
  movieDurationMin: number;
  likeCount: number;
  commentCount: number;
};

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
