import type { PersonaBridge } from '@kakamu/api';
import { usePersonaStore } from '@kakamu/store';

/** `@kakamu/api` `createAuthenticatedApiClient`용 PersonaBridge (getter 기반, 싱글톤 안전) */
export function createPersonaBridge(): PersonaBridge {
  return {
    getSelectedPersonaId: () => usePersonaStore.getState().selectedPersonaId,
  };
}
