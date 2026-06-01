import {
  ProfileFeedPanel,
  useProfileScreenData,
} from '@/components/featured/profileScreen';
import { usePostsInfiniteQuery } from '@kakamu/query';
import { useLocalSearchParams } from 'expo-router';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
export default function MemberProfileFeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useBackendApiClient();
  const { data } = usePostsInfiniteQuery(client, {
    target_persona_id: id,
    limit: 20,
  });

  return <ProfileFeedPanel posts={data?.pages.flatMap((page) => page.items) ?? []} />;
}
