import { useTranslation } from '@kakamu/i18n';
import { DefaultErrorFallback } from '@kakamu/ui';
import type { FallbackProps } from 'react-error-boundary';

type GlobalErrorFallbackProps = FallbackProps & {
  className?: string;
};

export function GlobalErrorFallback({
  className,
  ...props
}: GlobalErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <DefaultErrorFallback
      {...props}
      className={className}
      title={t('shared.errorBoundary.title')}
      description={t('shared.errorBoundary.description')}
      retryLabel={t('shared.errorBoundary.retry')}
    />
  );
}
