import type { ImageUploadType } from '@kakamu/types';

import type { LocalImagePick } from './local-image';

export async function createImagePreviewUri(pick: LocalImagePick): Promise<string> {
  const response = await fetch(pick.uri);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function buildImageUploadFormData(
  pick: LocalImagePick,
  imageType: ImageUploadType,
): Promise<FormData> {
  const response = await fetch(pick.uri);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append('file', blob, pick.fileName);
  formData.append('image_type', imageType);
  return formData;
}
