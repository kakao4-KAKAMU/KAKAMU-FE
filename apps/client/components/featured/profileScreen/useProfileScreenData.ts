import {
  MY_SAVED_CATEGORIES,
  MY_SAVED_MOVIES,
} from './profileScreen.mock';

type UseProfileScreenDataParams = {
  isMy: boolean;
  userId?: string;
};

export function useProfileScreenData({ isMy, userId }: UseProfileScreenDataParams) {

  return {
    savedCategories: MY_SAVED_CATEGORIES,
    savedMovies: MY_SAVED_MOVIES,
  };
}
