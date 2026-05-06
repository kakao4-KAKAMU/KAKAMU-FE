'use client';

import * as React from 'react';
import {
  ErrorBoundary,
  type ErrorBoundaryPropsWithComponent,
  type FallbackProps,
} from 'react-error-boundary';
import { Text, View } from 'react-native-web';

import { Button } from '../primitives/Button.web';
import { cn } from '../lib/cn';

export type UiErrorBoundaryProps = Omit<
  ErrorBoundaryPropsWithComponent,
  'FallbackComponent'
> & {
  className?: string;
  title?: string;
  description?: string;
};

export function DefaultErrorFallback({
  error,
  resetErrorBoundary,
  className,
  title = '문제가 발생했습니다',
  description = '잠시 후 다시 시도해주세요.',
}: FallbackProps & {
  className?: string;
  title?: string;
  description?: string;
}) {
  const errorMessage = error instanceof Error ? error.message : undefined;

  return (
    <View className={cn('rounded-3xl border border-destructive/30 bg-destructive/10 p-4', className)}>
      <Text className="text-base font-semibold text-destructive">{title}</Text>
      <Text className="mt-1 text-sm text-destructive/90">{description}</Text>
      {errorMessage ? (
        <Text className="mt-2 text-xs text-destructive/80">{errorMessage}</Text>
      ) : null}
      <Button className="mt-4 self-start" variant="destructive" onPress={resetErrorBoundary}>
        다시 시도
      </Button>
    </View>
  );
}

export function AppErrorBoundary({
  children,
  className,
  title,
  description,
  ...props
}: UiErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={(fallbackProps) => (
        <DefaultErrorFallback
          {...fallbackProps}
          className={className}
          title={title}
          description={description}
        />
      )}
      {...props}
    >
      {children}
    </ErrorBoundary>
  );
}

