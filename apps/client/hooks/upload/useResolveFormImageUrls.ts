import { useCallback } from 'react';
import type { ApiClient } from '@kakamu/api';
import { useUploadImageMutation } from '@kakamu/query';
import type { ImageUploadType } from '@kakamu/types';

import { buildImageUploadFormData } from '@/lib/upload/build-image-upload-form-data';
import { isLocalImageUri, type LocalImagePick } from '@/lib/upload/local-image';

export function useResolveFormImageUrls(apiClient: ApiClient) {
  const uploadMutation = useUploadImageMutation(apiClient);

  const resolveFormImageUrl = useCallback(
    async (
      url: string,
      imageType: ImageUploadType,
      pendingLocalImages: ReadonlyMap<string, LocalImagePick>,
    ): Promise<string> => {
      if (!isLocalImageUri(url)) {
        return url.trim();
      }

      const pick = pendingLocalImages.get(url);
      if (!pick) {
        throw new Error('Local image metadata is missing for upload.');
      }

      const formData = await buildImageUploadFormData(pick, imageType);
      const response = await uploadMutation.mutateAsync(formData);
      return response.image_url;
    },
    [uploadMutation],
  );

  const resolveFormImageUrls = useCallback(
    async (
      urls: string[],
      imageType: ImageUploadType,
      pendingLocalImages: ReadonlyMap<string, LocalImagePick>,
    ): Promise<string[]> => {
      return Promise.all(
        urls.map((url) => resolveFormImageUrl(url, imageType, pendingLocalImages)),
      );
    },
    [resolveFormImageUrl],
  );

  return {
    resolveFormImageUrl,
    resolveFormImageUrls,
    isUploading: uploadMutation.isPending,
  };
}
