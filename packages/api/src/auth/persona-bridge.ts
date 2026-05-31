/** 앱·플랫폼별 페르소나 선택 상태를 `@kakamu/api`에 주입하기 위한 계약 */
export type PersonaBridge = {
  getSelectedPersonaId: () => string | null;
};
