import type { FollowListParams, FollowListResponse } from '@kakamu/types';
import type { ApiClient } from '../client';
import { toFollowListSearchParams } from './build-follow-list-params';

/** `GET .../relations/{target_user_id}/followers` */
export async function getFollowers(
  client: ApiClient,
  params: FollowListParams,
): Promise<FollowListResponse> {
  const { target_user_id, ...query } = params;
  return client
    .get(`relations/users/${target_user_id}/followers`, {
      searchParams: toFollowListSearchParams(query),
    })
    .json<FollowListResponse>();
}
