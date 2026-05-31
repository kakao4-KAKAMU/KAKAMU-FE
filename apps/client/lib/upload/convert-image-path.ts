export function convertImagePath(path: string): string {
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }
  return `/images/${path}`.replace(/\/\//g, '/');
}