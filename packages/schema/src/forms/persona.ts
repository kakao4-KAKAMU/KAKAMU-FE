import { z } from 'zod';

import {
  PERSONA_DESCRIPTION_MAX_LENGTH,
  PERSONA_DESCRIPTION_MIN_LENGTH,
  PERSONA_GENRE_MAX_COUNT,
  PERSONA_NAME_MAX_LENGTH,
  PERSONA_NAME_MIN_LENGTH,
} from './persona-constants';
import type { PersonaFormValidationMessages } from './persona-messages';

const selectedMovieSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  year: z.number().optional(),
});

const selectedPersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  job: z.string().optional(),
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
  const base = z.object({
    name: nameField(messages.name),
    description: descriptionField(messages.description),
    profile_image_url: profileImageUrlField(messages.profileImageUrl),
    selectedGenreIds: z.array(z.string()),
    selectedMovies: z.array(selectedMovieSchema),
    selectedPersons: z.array(selectedPersonSchema),
  });

  const step1 = base.pick({
    name: true,
    description: true,
    profile_image_url: true,
  });

  const step2 = base.pick({ selectedGenreIds: true }).superRefine((data, ctx) => {
    if (data.selectedGenreIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.genres.required,
        path: ['selectedGenreIds'],
      });
    }
    if (data.selectedGenreIds.length > PERSONA_GENRE_MAX_COUNT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.genres.max,
        path: ['selectedGenreIds'],
      });
    }
  });

  const step3 = base.pick({ selectedMovies: true }).superRefine((data, ctx) => {
    if (data.selectedMovies.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.movies.required,
        path: ['selectedMovies'],
      });
    }
  });

  const step4 = base.pick({ selectedPersons: true }).superRefine((data, ctx) => {
    if (data.selectedPersons.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.persons.required,
        path: ['selectedPersons'],
      });
    }
  });

  const full = base.superRefine((data, ctx) => {
    if (data.selectedGenreIds.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.genres.required,
        path: ['selectedGenreIds'],
      });
    }
    if (data.selectedGenreIds.length > PERSONA_GENRE_MAX_COUNT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.genres.max,
        path: ['selectedGenreIds'],
      });
    }
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

  return { step1, step2, step3, step4, full };
}

export type PersonaFormSchemas = ReturnType<typeof createPersonaFormSchemas>;
export type PersonaCreateFormInput = z.infer<PersonaFormSchemas['full']>;
