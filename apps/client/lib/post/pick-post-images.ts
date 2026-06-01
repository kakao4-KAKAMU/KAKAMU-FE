import * as ImagePicker from 'expo-image-picker';

import { createImagePreviewUri } from '../upload/build-image-upload-form-data';
import { toLocalImagePick, type LocalImagePick } from '../upload/local-image';

export type PickedImage = {
  previewUri: string;
  pick: LocalImagePick;
};

export async function pickPostImages(remaining: number): Promise<PickedImage[] | null> {
  if (remaining <= 0) {
    return null;
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: remaining > 1,
    selectionLimit: remaining,
    mediaTypes: ['images'],
    quality: 0.85,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return Promise.all(
    result.assets.map(async (asset) => {
      const pick = toLocalImagePick(asset);
      const previewUri = await createImagePreviewUri(pick);
      return { previewUri, pick };
    }),
  );
}
