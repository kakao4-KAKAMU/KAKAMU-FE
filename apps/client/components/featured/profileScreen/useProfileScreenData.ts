import { useMemo } from 'react';
import {
  MY_FEED_POSTS,
  MY_LIKED_POSTS,
  MY_PROFILE_USER,
  MY_SAVED_CATEGORIES,
  MY_SAVED_MOVIES,
  getMemberProfileUser,
} from './profileScreen.mock';
import type { ProfileScreenUser } from './types';

type UseProfileScreenDataParams = {
  isMy: boolean;
  userId?: string;
};

export function useProfileScreenData({ isMy, userId }: UseProfileScreenDataParams) {
  const user: ProfileScreenUser = useMemo(
    () => (isMy ? MY_PROFILE_USER : getMemberProfileUser(userId ?? '')),
    [isMy, userId],
  );

  return {
    user,
    feedPosts: MY_FEED_POSTS,
    likedPosts: MY_LIKED_POSTS,
    savedCategories: MY_SAVED_CATEGORIES,
    savedMovies: MY_SAVED_MOVIES,
  };
}
