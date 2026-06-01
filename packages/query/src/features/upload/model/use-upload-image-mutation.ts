import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { uploadImage } from '@kakamu/api';
import type { ImageUploadResponse } from '@kakamu/types';

const NO_MUTATION_CACHE = { gcTime: 0 } as const;

export function useUploadImageMutation(
  client: ApiClient,
  options?: UseMutationOptions<ImageUploadResponse, unknown, FormData>,
) {
  return useMutation({
    mutationFn: (formData: FormData) => uploadImage(client, formData),
    ...NO_MUTATION_CACHE,
    ...options,
  });
}
