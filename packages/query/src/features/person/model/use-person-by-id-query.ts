import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { PersonSearchItem } from '@kakamu/types';

import { personKeys } from '../../../shared/keys/person.keys';

export function usePersonByIdQuery(
  personId: string,
  options?: Omit<UseSuspenseQueryOptions<PersonSearchItem>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: personKeys.detail(personId),
    queryFn: () => {
      const cached = queryClient.getQueryData<PersonSearchItem>(personKeys.detail(personId));
      if (!cached) {
        throw new Error(`Person ${personId} is not available in cache`);
      }
      return cached;
    },
    ...options,
  });
}
