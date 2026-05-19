/** `EXPO_PUBLIC_BACKEND_API_URL` — trailing slash 제거 */
export function getBackendApiPrefixUrl(): string {
  const raw = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  return raw?.replace(/\/$/, '') ?? '';
}
