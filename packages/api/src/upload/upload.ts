import type { ImageUploadResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../upload` — multipart/form-data (`file`, `image_type`) */
export async function uploadImage(
  client: ApiClient,
  formData: FormData,
): Promise<ImageUploadResponse> {
  return client
    .post('.', { body: formData as unknown as NonNullable<RequestInit['body']> })
    .json<ImageUploadResponse>();
}
