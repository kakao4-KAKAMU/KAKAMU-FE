import {
  ProfileSavedPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';
import { useLocalSearchParams } from 'expo-router';

export default function MemberProfileSavedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { savedCategories, savedMovies } = useProfileScreenData({ isMy: false, userId: id });

  return (
    <ProfileSavedPanel
      isMy={false}
      categories={savedCategories}
      movies={savedMovies}
    />
  );
}
