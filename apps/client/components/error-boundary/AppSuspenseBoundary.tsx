import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { GlobalErrorFallback } from './GlobalErrorFallback';

export type AppSuspenseBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
};

export function AppSuspenseBoundary({
  children,
  fallback,
  className,
}: AppSuspenseBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <GlobalErrorFallback {...props} className={className} />
      )}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
