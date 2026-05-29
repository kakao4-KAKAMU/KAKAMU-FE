import { useGenreListQuery } from '@kakamu/query';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';

export function usePersonaCreateGenreList() {
  const client = useBackendApiClient();
  return useGenreListQuery(client);
}
