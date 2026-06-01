export function convertImagePath(path: string): string {
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }
  return `${process.env.EXPO_PUBLIC_IMAGE_API_URL}/${path}`
}