import {
  ProfileFeedPanel,
} from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserIdOrThrow } from '@/hooks/auth/useCurrentUserId';
import { usePostsInfiniteQuery } from '@kakamu/query';

export default function ProfileFeedScreen() {
  const client = useBackendApiClient()
  const currentUserId = useCurrentUserIdOrThrow();
  const { data } = usePostsInfiniteQuery(client, {
    target_user_id: currentUserId,
    limit: 20,
  })

  return <ProfileFeedPanel posts={data?.pages.flatMap((page) => page.items) ?? []} />;
}
