import * as ImagePicker from 'expo-image-picker';

import { createImagePreviewUri } from './build-image-upload-form-data';
import { toLocalImagePick } from './local-image';
import type { PickedImage } from '../post/pick-post-images';

export async function pickProfileImage(): Promise<PickedImage | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: false,
    mediaTypes: ['images'],
    quality: 0.85,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const pick = toLocalImagePick(result.assets[0]!);
  const previewUri = await createImagePreviewUri(pick);
  return { previewUri, pick };
}
