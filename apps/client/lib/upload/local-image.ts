import type { ImagePickerAsset } from 'expo-image-picker';

export type LocalImagePick = {
  uri: string;
  mimeType: string;
  fileName: string;
};

export function isRemoteImageUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function isLocalImageUri(value: string): boolean {
  const trimmed = value.trim();
  return /^(file|content|blob|ph|assets-library):/.test(trimmed);
}

export function toLocalImagePick(asset: ImagePickerAsset): LocalImagePick {
  const extension = asset.mimeType?.split('/')[1] ?? 'jpg';

  return {
    uri: asset.uri,
    mimeType: asset.mimeType ?? 'image/jpeg',
    fileName: asset.fileName ?? `image-${Date.now()}.${extension}`,
  };
}

export function revokeImagePreviewUri(previewUri: string): void {
  if (previewUri.startsWith('blob:')) {
    URL.revokeObjectURL(previewUri);
  }
}
