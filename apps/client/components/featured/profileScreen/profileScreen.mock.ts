import type {
  ProfileCompactPost,
  ProfileSavedCategory,
  ProfileSavedMovie,
  ProfileScreenUser,
} from './types';

export const MY_PROFILE_USER: ProfileScreenUser = {
  id: 'me',
  displayName: 'Choe Cinema',
  bio: '페르소나 3개 · 작성 피드 42개 · 저장 영화 128개',
  stats: { feed: 42, save: 128, persona: 3 },
};

export function getMemberProfileUser(userId: string): ProfileScreenUser {
  return {
    id: userId,
    displayName: 'Seo Cine',
    bio: '페르소나 2개 · 작성 피드 18개 · 저장 영화 64개',
    stats: { feed: 18, save: 64, persona: 2 },
  };
}

export const MY_FEED_POSTS: ProfileCompactPost[] = [
  {
    id: '1',
    authorName: 'Choe Cinema',
    authorHandle: '@choe',
    timeLabel: '2h',
    body: '오늘의 감정 기록: 조용하지만 오래 남는 엔딩.',
    movieTitle: 'Past Lives',
    movieDurationMin: 106,
    likeCount: 86,
    commentCount: 12,
  },
  {
    id: '2',
    authorName: 'Choe Cinema',
    authorHandle: '@choe',
    timeLabel: '어제',
    body: '예고편은 짧았지만 장면의 온도가 좋았다. #LittleForest',
    movieTitle: 'Little Forest',
    movieDurationMin: 103,
    likeCount: 41,
    commentCount: 8,
  },
];

export const MY_LIKED_POSTS: ProfileCompactPost[] = [
  {
    id: 'l1',
    authorName: 'Seo Cine',
    authorHandle: '@seofilm',
    timeLabel: '좋아요함',
    body: '엔딩 크레딧 이후에도 잔향이 긴 영화. 저장해둘 가치가 있어요.',
    movieTitle: 'After Yang',
    movieDurationMin: 96,
    likeCount: 204,
    commentCount: 31,
  },
  {
    id: 'l2',
    authorName: 'Movie Sommelier',
    authorHandle: '@taste_curator',
    timeLabel: '좋아요함',
    body: '슬픔보다 더 오래 남는 온도. #LittleForest',
    movieTitle: 'Little Forest',
    movieDurationMin: 103,
    likeCount: 88,
    commentCount: 14,
  },
];

export const MY_SAVED_CATEGORIES: ProfileSavedCategory[] = [
  { id: 'watchlist', title: '보고 싶은 영화', itemCount: 32 },
  { id: 'favorites', title: '인생 영화', itemCount: 14 },
  { id: 'reviews', title: '리뷰 참고', itemCount: 21 },
];

export const MY_SAVED_MOVIES: ProfileSavedMovie[] = [
  { id: 'm1', title: 'Past Lives', meta: '보고 싶은 영화 · 106 min' },
  { id: 'm2', title: 'Dune: Part Two', meta: '리뷰 참고 · 166 min' },
];
