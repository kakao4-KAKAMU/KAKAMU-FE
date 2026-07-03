
import { ProfileFeedPanel } from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUser } from '@/hooks/auth/useCurrentUserId';
import { useLikedPostsInfiniteQuery } from '@kakamu/query';
import { View } from 'react-native';

export default function MyProfileLikesScreen() {
  const client = useBackendApiClient()

  const currentUser = useCurrentUser();
  if (!currentUser) {
    return <View></View>;
  }
  const { data } = useLikedPostsInfiniteQuery(client, {
    target_user_id: currentUser.id,
    limit: 20,
  })

  return <ProfileFeedPanel postsIds={data?.pages.flatMap((page) => page.items) ?? []} />;
}
