/** `signInWithPhoneNumber` → `confirm` 결과에서 Firebase ID 토큰 추출 (웹/네이티브 공통) */
export async function getFirebaseIdTokenFromPhoneCredential(credential: unknown): Promise<string> {
  if (!credential || typeof credential !== 'object' || !('user' in credential)) {
    throw new Error('[firebase] 전화 인증 결과가 올바르지 않습니다.');
  }
  const user = (credential as { user: { getIdToken: (forceRefresh?: boolean) => Promise<string> } })
    .user;
  if (typeof user.getIdToken !== 'function') {
    throw new Error('[firebase] getIdToken 을 사용할 수 없습니다.');
  }
  return user.getIdToken();
}
