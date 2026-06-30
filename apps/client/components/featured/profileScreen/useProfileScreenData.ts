import { MY_SAVED_CATEGORIES } from './profileScreen.mock';

type UseProfileScreenDataParams = {
  isMy: boolean;
  userId?: string;
};

export function useProfileScreenData(_params: UseProfileScreenDataParams) {
  return {
    savedCategories: MY_SAVED_CATEGORIES,
  };
}
