import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import {
  PROFILE_SAVED_CATEGORY_IDS,
  ProfileSavedCategoryContent,
  ProfileSavedPanel,
  type ProfileSavedCategoryId,
} from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import {
  useProfileSavedCategories,
  useProfileSavedQueries,
} from '@/hooks/profile/useProfileSavedCategories';

function isSavedCategoryId(value: string | undefined): value is ProfileSavedCategoryId {
  return PROFILE_SAVED_CATEGORY_IDS.includes(value as ProfileSavedCategoryId);
}

export default function SavedFeedByCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const client = useBackendApiClient();
  const currentUserId = useCurrentUserId();
  const queries = useProfileSavedQueries(client);
  const categories = useProfileSavedCategories(queries);

  if (!currentUserId) {
    return <View />;
  }

  if (!isSavedCategoryId(category)) {
    return <Redirect href="/profile/my/saved" />;
  }

  return (
    <ProfileSavedPanel isMy categories={categories} activeCategoryId={category}>
      <ProfileSavedCategoryContent categoryId={category} queries={queries} />
    </ProfileSavedPanel>
  );
}
