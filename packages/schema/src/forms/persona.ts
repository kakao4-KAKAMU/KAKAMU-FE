import { z } from 'zod';

import {
  PERSONA_DESCRIPTION_MAX_LENGTH,
  PERSONA_DESCRIPTION_MIN_LENGTH,
  PERSONA_NAME_MAX_LENGTH,
  PERSONA_NAME_MIN_LENGTH,
} from './persona-constants';
import type { PersonaFormValidationMessages } from './persona-messages';

const selectedMovieSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

const selectedPersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

function nameField(messages: PersonaFormValidationMessages['name']) {
  return z
    .string()
    .trim()
    .min(1, messages.required)
    .min(PERSONA_NAME_MIN_LENGTH, messages.min)
    .max(PERSONA_NAME_MAX_LENGTH, messages.max);
}

function descriptionField(messages: PersonaFormValidationMessages['description']) {
  return z
    .string()
    .trim()
    .min(1, messages.required)
    .min(PERSONA_DESCRIPTION_MIN_LENGTH, messages.min)
    .max(PERSONA_DESCRIPTION_MAX_LENGTH, messages.max);
}

function profileImageUrlField(messages: PersonaFormValidationMessages['profileImageUrl']) {
  return z
    .string()
    .trim()
    .refine((value) => value.length === 0 || z.string().url().safeParse(value).success, {
      message: messages.invalid,
    });
}

export function createPersonaFormSchemas(messages: PersonaFormValidationMessages) {
  const step1 = z.object({
    name: nameField(messages.name),
    description: descriptionField(messages.description),
    profile_image_url: profileImageUrlField(messages.profileImageUrl),
    selectedGenreIds: z.array(z.string()),
    selectedMovies: z.array(selectedMovieSchema),
    selectedPersons: z.array(selectedPersonSchema),
  });

  const step1Fields = step1.pick({
    name: true,
    description: true,
    profile_image_url: true,
  });

  const step2 = step1
    .pick({
      selectedGenreIds: true,
      selectedMovies: true,
      selectedPersons: true,
    })
    .superRefine((data, ctx) => {
      if (data.selectedMovies.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.movies.required,
          path: ['selectedMovies'],
        });
      }
      if (data.selectedPersons.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.persons.required,
          path: ['selectedPersons'],
        });
      }
    });

  const full = step1.superRefine((data, ctx) => {
    if (data.selectedMovies.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.movies.required,
        path: ['selectedMovies'],
      });
    }
    if (data.selectedPersons.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.persons.required,
        path: ['selectedPersons'],
      });
    }
  });

  return { step1: step1Fields, step2, full };
}

export type PersonaFormSchemas = ReturnType<typeof createPersonaFormSchemas>;
export type PersonaCreateFormInput = z.infer<PersonaFormSchemas['full']>;
