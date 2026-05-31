import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { ChevronLeft } from 'lucide-react-native';
import { Icon, Button, TextClassProvider } from '@kakamu/ui';
import { HeaderTemplate } from './HeaderTemplate';

type ProfileSubpageHeaderProps = {
  title: string;
  onBackPress?: () => void;
};

export function ProfileSubpageHeader({ title, onBackPress }: ProfileSubpageHeaderProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBack = onBackPress ?? (() => router.back());

  return (
    <HeaderTemplate
      title={title}
      leftAction={
        <Button
          variant="ghost"
          size="icon"
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.navigation.back')}
        >
         <TextClassProvider value="text-secondary-foreground">
            <Icon as={ChevronLeft} size={18} />
          </TextClassProvider>
        </Button>
      }
    />
  );
}
