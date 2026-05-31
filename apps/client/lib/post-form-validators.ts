import type { TFunction } from 'i18next';
import { useMemo } from 'react';

import { buildPostFormValidationMessages } from '@kakamu/i18n';
import { createPostFormSchema } from '@kakamu/schema';

export function usePostFormValidationKit(t: TFunction) {
  return useMemo(
    () => createPostFormSchema(buildPostFormValidationMessages(t)),
    [t],
  );
}
