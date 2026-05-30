import { useTranslation } from '@kakamu/i18n';
import { Info } from 'lucide-react-native';
import { Icon, Button } from '@kakamu/ui';
import { HeaderTemplate } from './HeaderTemplate';

type SonarHeaderProps = {
  title?: string;
  onInfoPress?: () => void;
};

export function SonarHeader({ title, onInfoPress }: SonarHeaderProps) {
  const { t } = useTranslation();
  const displayTitle = title ?? t('account.sonar.headerTitle');

  return (
    <HeaderTemplate
      title={displayTitle}
      rightAction={
        <Button
          variant="ghost"
          size="icon"
          onPress={onInfoPress}
          accessibilityRole="button"
          accessibilityLabel={t('account.sonar.headerInfoA11y')}
        >
          <Icon as={Info} className="text-foreground" size={18} />
        </Button>
      }
    />
  );
}
