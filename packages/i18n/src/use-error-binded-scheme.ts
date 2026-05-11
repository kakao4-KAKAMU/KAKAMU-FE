import { useMemo } from 'react';
import type { z } from 'zod';

function firstFieldMessage(errors: string[] | undefined): string | undefined {
  return errors?.[0];
}

export type ErrorBindedSchemeResult<Schema extends z.ZodTypeAny> =
  | {
      success: true;
      data: z.output<Schema>;
      fieldErrors: Record<string, never>;
    }
  | {
      success: false;
      fieldErrors: Record<string, string | undefined>;
      formError?: string;
    };

/**
 * Zod 스키마와 폼 값을 받아 `safeParse` 결과와 필드별 첫 오류 메시지를 제공합니다.
 * 스키마는 `useMemo(() => createAuthFormSchemas(buildAuthFormValidationMessages(t)), [t])`처럼 안정적으로 두세요.
 */
export function useErrorBindedScheme<Schema extends z.ZodTypeAny>(
  schema: Schema,
  values: z.input<Schema>
): ErrorBindedSchemeResult<Schema> {
  return useMemo(() => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      return {
        success: true,
        data: parsed.data,
        fieldErrors: {},
      };
    }
    const flat = parsed.error.flatten();
    const fieldErrors: Record<string, string | undefined> = {};
    for (const key of Object.keys(flat.fieldErrors)) {
      fieldErrors[key] = firstFieldMessage(flat.fieldErrors[key as keyof typeof flat.fieldErrors]);
    }
    const formError = flat.formErrors[0];
    return {
      success: false,
      fieldErrors,
      ...(formError !== undefined ? { formError } : {}),
    };
  }, [schema, values]) as ErrorBindedSchemeResult<Schema>;
}
