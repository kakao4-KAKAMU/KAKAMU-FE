import { ErrorAlertDialogProvider, ActionAlertDialogProvider, PortalHost } from '@kakamu/ui';
import { MovieDetailDialogProvider } from '@/providers/MovieDetailDialogProvider';
import { ReactNode } from 'react';

export function LayoutDialogProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorAlertDialogProvider>
      <ActionAlertDialogProvider>
        <MovieDetailDialogProvider>
          {children}
          <PortalHost />
        </MovieDetailDialogProvider>
      </ActionAlertDialogProvider>
    </ErrorAlertDialogProvider>
  );
}