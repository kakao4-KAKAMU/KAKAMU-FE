
import { ProfileFeedPanel } from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useLikedPostsInfiniteQuery } from '@kakamu/query';

export default function MyProfileLikesScreen() {
  const client = useBackendApiClient()
  const { data } = useLikedPostsInfiniteQuery(client, {
    limit: 20,
  })

  return <ProfileFeedPanel posts={data?.pages.flatMap((page) => page.items) ?? []} />;
}
