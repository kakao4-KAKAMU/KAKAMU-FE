import {
  ProfileFeedPanel,
} from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserOrThrow } from '@/hooks/auth/useCurrentUserId';
import { usePostsInfiniteQuery } from '@kakamu/query';

export default function ProfileFeedScreen() {
  const client = useBackendApiClient()
  const currentUser = useCurrentUserOrThrow();
  const { data } = usePostsInfiniteQuery(client, {
    target_user_id: currentUser.id,
    limit: 20,
  })

  return <ProfileFeedPanel postsIds={data?.pages.flatMap((page) => page.items) ?? []} />;
}
