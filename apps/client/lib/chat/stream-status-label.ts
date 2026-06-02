import type { TFunction } from 'i18next';

export function getStreamStatusLabel(
  t: TFunction,
  type: string,
  nodePhaseKey: string | null,
): string | null {
  if (type === 'open') {
    return t('account.chat.streamStatus.open');
  }

  if (type === 'node') {
    if (!nodePhaseKey) {
      return t('account.chat.streamStatus.processing');
    }
    return (
      t(`account.chat.streamStatus.node.${nodePhaseKey}` as any, {
        defaultValue: t('account.chat.streamStatus.processing'),
      }) ?? t('account.chat.streamStatus.processing')
    );
  }

  if (type === 'done') {
    return null;
  }

  return null;
}
