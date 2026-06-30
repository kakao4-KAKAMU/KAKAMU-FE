import { View } from 'react-native';

import {
  ProfileSavedCategoryContent,
  ProfileSavedPanel,
} from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import {
  useProfileSavedCategories,
  useProfileSavedQueries,
} from '@/hooks/profile/useProfileSavedCategories';

export default function MyProfileSavedScreen() {
  const client = useBackendApiClient();
  const currentUserId = useCurrentUserId();
  const queries = useProfileSavedQueries(client);
  const categories = useProfileSavedCategories(queries);

  if (!currentUserId) {
    return <View />;
  }

  return (
    <ProfileSavedPanel isMy categories={categories} activeCategoryId="movies">
      <ProfileSavedCategoryContent categoryId="movies" queries={queries} />
    </ProfileSavedPanel>
  );
}
