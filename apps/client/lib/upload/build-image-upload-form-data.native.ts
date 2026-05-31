import type { ImageUploadType } from '@kakamu/types';

import type { LocalImagePick } from './local-image';

export async function createImagePreviewUri(pick: LocalImagePick): Promise<string> {
  return pick.uri;
}

export async function buildImageUploadFormData(
  pick: LocalImagePick,
  imageType: ImageUploadType,
): Promise<FormData> {
  const formData = new FormData();
  formData.append('file', {
    uri: pick.uri,
    name: pick.fileName,
    type: pick.mimeType,
  } as unknown as Blob);
  formData.append('image_type', imageType);
  return formData;
}
