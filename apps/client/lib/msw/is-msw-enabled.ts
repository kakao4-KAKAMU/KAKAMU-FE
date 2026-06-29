export function isMswEnabled(): boolean {
  return process.env.EXPO_PUBLIC_USE_MSW === 'true' && process.env.NODE_ENV === 'development';
}
