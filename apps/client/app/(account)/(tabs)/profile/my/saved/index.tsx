import {
  ProfileSavedPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';
import { usePersonaStore } from '@kakamu/store';
import { View } from 'react-native';
export default function MyProfileSavedScreen() {
  const { savedCategories, savedMovies } = useProfileScreenData({ isMy: true });

  const targetPersonaId = usePersonaStore((state) => state.selectedPersonaId);
  if (!targetPersonaId) {
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
