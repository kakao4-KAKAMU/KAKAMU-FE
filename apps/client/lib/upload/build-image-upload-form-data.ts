import type { ImageUploadType } from '@kakamu/types';

import type { LocalImagePick } from './local-image';

/** Metro가 `.native` / `.web` 구현으로 대체합니다. */
export async function createImagePreviewUri(_pick: LocalImagePick): Promise<string> {
  throw new Error('Unsupported platform for image preview.');
}

/** Metro가 `.native` / `.web` 구현으로 대체합니다. */
export async function buildImageUploadFormData(
  _pick: LocalImagePick,
  _imageType: ImageUploadType,
): Promise<FormData> {
  throw new Error('Unsupported platform for image upload form data.');
}
