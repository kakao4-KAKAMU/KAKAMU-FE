import type { PostItem } from '@kakamu/types';
import type { ProfileSavedCategory, ProfileSavedMovie, ProfileScreenUser } from './types';

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

const PAST_LIVES_MOVIE = {
  id: 1,
  title: 'Past Lives',
  release_date: '2023',
  poster_url: undefined,
} as const;

const LITTLE_FOREST_MOVIE = {
  id: 2,
  title: 'Little Forest',
  release_date: '2018',
  poster_url: undefined,
} as const;

const AFTER_YANG_MOVIE = {
  id: 3,
  title: 'After Yang',
  release_date: '2021',
  poster_url: undefined,
} as const;

export const MY_FEED_POSTS: PostItem[] = [
  {
    id: 1,
    author_id: 'choe',
    author: 'Choe Cinema',
    author_image: null,
    title: '조용하지만 오래 남는 엔딩',
    content: '오늘의 감정 기록: 영화가 끝난 뒤에도 오래 남는 장면들. #PastLives',
    image_urls: [
      'https://images.unsplash.com/photo-1739051337652-53a857851168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1765087909769-68dd574ecf08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    is_spoiler: true,
    movies: [PAST_LIVES_MOVIE],
    hashtags: ['PastLives'],
    like_count: 86,
    comment_count: 12,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    author_id: 'choe',
    author: 'Choe Cinema',
    author_image: null,
    title: '예고편은 짧았지만',
    content: '예고편은 짧았지만 장면의 온도가 좋았다. #LittleForest',
    image_urls: [],
    is_spoiler: true,
    movies: [LITTLE_FOREST_MOVIE],
    hashtags: ['LittleForest'],
    like_count: 41,
    comment_count: 8,
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];

export const MY_LIKED_POSTS: PostItem[] = [
  {
    id: 101,
    author_id: null,
    author: null,
    author_image: null,
    title: '조용하지만 오래 남는 엔딩',
    content: '엔딩 크레딧 이후에도 잔향이 긴 영화. 저장해둘 가치가 있어요.',
    image_urls: [
      'https://images.unsplash.com/photo-1739051337652-53a857851168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    is_spoiler: false,
    movies: [AFTER_YANG_MOVIE],
    hashtags: [],
    like_count: 204,
    comment_count: 31,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 102,
    author_id: 'taste_curator',
    author: 'Movie Sommelier',
    author_image: null,
    title: '슬픔보다 더 오래 남는 온도',
    content: '슬픔보다 더 오래 남는 온도. #LittleForest',
    image_urls: [],
    is_spoiler: false,
    movies: [LITTLE_FOREST_MOVIE],
    hashtags: ['LittleForest'],
    like_count: 88,
    comment_count: 14,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
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
