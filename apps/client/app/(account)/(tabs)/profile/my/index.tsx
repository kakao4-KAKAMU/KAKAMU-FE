import {
  ProfileFeedPanel,
} from '@/components/featured/profileScreen';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { usePostsInfiniteQuery } from '@kakamu/query';
import { usePersonaStore } from '@kakamu/store';

export default function ProfileFeedScreen() {
  const client = useBackendApiClient()
  const targetPersonaId = usePersonaStore((state) => state.selectedPersonaId);
  if (!targetPersonaId) {
    return null;
  }
  const { data } = usePostsInfiniteQuery(client, {
    target_persona_id: targetPersonaId,
    limit: 20,
  })

  return <ProfileFeedPanel posts={data?.pages.flatMap((page) => page.items) ?? []} />;
}
