import type { TFunction } from 'i18next';
import { useMemo } from 'react';

import { buildPersonaFormValidationMessages } from '@kakamu/i18n';
import { createPersonaFormSchemas } from '@kakamu/schema';

export function usePersonaFormValidationKit(t: TFunction) {
  return useMemo(
    () => createPersonaFormSchemas(buildPersonaFormValidationMessages(t)),
    [t],
  );
}
