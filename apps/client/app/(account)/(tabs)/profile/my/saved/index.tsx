import {
  ProfileSavedPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { View } from 'react-native';
export default function MyProfileSavedScreen() {
  const { savedCategories, savedMovies } = useProfileScreenData({ isMy: true });

  const currentUserId = useCurrentUserId();
  if (!currentUserId) { 
    return <View></View>;
  }

  return (
    <ProfileSavedPanel
      isMy
      categories={savedCategories}
      movies={savedMovies}
    />
  );
}
