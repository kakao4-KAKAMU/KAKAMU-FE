import {
  ProfileSavedPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';

export default function MyProfileSavedScreen() {
  const { savedCategories, savedMovies } = useProfileScreenData({ isMy: true });

  return (
    <ProfileSavedPanel
      isMy
      categories={savedCategories}
      movies={savedMovies}
    />
  );
}
