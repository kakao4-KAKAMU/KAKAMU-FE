import * as ImagePicker from 'expo-image-picker';

export async function pickPostImages(remaining: number): Promise<string[] | null> {
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

  return result.assets.map((asset) => asset.uri);
}
