import {
  ProfileFeedPanel,
} from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useMyPostsInfiniteQuery } from '@kakamu/query';

export default function MyProfileFeedScreen() {
  const client = useBackendApiClient()
  const { data } = useMyPostsInfiniteQuery(client, {
    limit: 20,
  })

  return <ProfileFeedPanel posts={data?.pages.flatMap((page) => page.items) ?? []} />;
}
