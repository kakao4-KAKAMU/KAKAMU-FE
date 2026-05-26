import type { TFunction } from 'i18next';

import {
  PERSONA_DESCRIPTION_MAX_LENGTH,
  PERSONA_DESCRIPTION_MIN_LENGTH,
  PERSONA_NAME_MAX_LENGTH,
  PERSONA_NAME_MIN_LENGTH,
} from '@kakamu/schema';
import type { PersonaFormValidationMessages } from '@kakamu/schema';

export function buildPersonaFormValidationMessages(t: TFunction): PersonaFormValidationMessages {
  return {
    name: {
      required: t('account.persona.create.validation.name.required'),
      min: t('account.persona.create.validation.name.min', { min: PERSONA_NAME_MIN_LENGTH }),
      max: t('account.persona.create.validation.name.max', { max: PERSONA_NAME_MAX_LENGTH }),
    },
    description: {
      required: t('account.persona.create.validation.description.required'),
      min: t('account.persona.create.validation.description.min', {
        min: PERSONA_DESCRIPTION_MIN_LENGTH,
      }),
      max: t('account.persona.create.validation.description.max', {
        max: PERSONA_DESCRIPTION_MAX_LENGTH,
      }),
    },
    profileImageUrl: {
      invalid: t('account.persona.create.validation.thumbnail.invalid'),
    },
    movies: {
      required: t('account.persona.create.validation.movies.required'),
    },
    persons: {
      required: t('account.persona.create.validation.persons.required'),
    },
  };
}
